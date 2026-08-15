import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './AuthContext.jsx';
import { computeEligibility } from '../lib/eligibility.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, profile, role } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [eligibilityByProgramId, setEligibilityByProgramId] = useState({});
  const [loading, setLoading] = useState(true);
  // Session-only relevance scores from the free-text AI Matcher (never persisted to the DB —
  // matches the old app's behavior where matchScore was purely a client-side heuristic).
  const [matcherScores, setMatcherScores] = useState({});

  const loadPrograms = useCallback(async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*, providers(id, name, type, website)')
      .order('deadline', { ascending: true });
    if (error) {
      console.warn('Failed to load programs:', error.message);
      setPrograms([]);
      return [];
    }
    setPrograms(data);
    return data;
  }, []);

  const loadSaved = useCallback(async (userId) => {
    if (!userId) {
      setSavedIds([]);
      return;
    }
    const { data, error } = await supabase.from('saved_programs').select('program_id').eq('student_id', userId);
    if (error) {
      console.warn('Failed to load saved programs:', error.message);
      setSavedIds([]);
    } else {
      setSavedIds(data.map((row) => row.program_id));
    }
  }, []);

  // Computes eligibility for every active program against the current student's
  // profile, then persists it to eligibility_results (upsert) for admin
  // analytics/audit trail. The freshly-computed map is what the UI renders from
  // immediately — no need to wait on a round trip to read it back.
  const computeAndPersistEligibility = useCallback(async (studentProfile, allPrograms, studentId) => {
    const map = {};
    const rows = [];
    allPrograms
      .filter((p) => p.status === 'Active')
      .forEach((program) => {
        const { result, explanation } = computeEligibility(studentProfile, program);
        map[program.id] = { result, explanation };
        rows.push({ student_id: studentId, program_id: program.id, result, explanation });
      });

    setEligibilityByProgramId(map);

    if (rows.length > 0) {
      const { error } = await supabase.from('eligibility_results').upsert(rows, { onConflict: 'student_id,program_id' });
      if (error) console.warn('Failed to persist eligibility results:', error.message);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const [loadedPrograms] = await Promise.all([loadPrograms(), loadSaved(user?.id)]);
      if (cancelled) return;

      if (role === 'student' && user?.id && profile) {
        await computeAndPersistEligibility(profile, loadedPrograms, user.id);
      } else {
        setEligibilityByProgramId({});
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // profile is intentionally included so eligibility recomputes after a profile edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, role, profile, loadPrograms, loadSaved, computeAndPersistEligibility]);

  const toggleSaved = useCallback(
    async (programId) => {
      if (!user?.id) return;
      const isSaved = savedIds.includes(programId);

      if (isSaved) {
        setSavedIds((prev) => prev.filter((id) => id !== programId));
        const { error } = await supabase
          .from('saved_programs')
          .delete()
          .eq('student_id', user.id)
          .eq('program_id', programId);
        if (error) {
          console.warn('Failed to unsave:', error.message);
          setSavedIds((prev) => [...prev, programId]);
        }
      } else {
        setSavedIds((prev) => [...prev, programId]);
        const { error } = await supabase.from('saved_programs').insert({ student_id: user.id, program_id: programId });
        if (error) {
          console.warn('Failed to save:', error.message);
          setSavedIds((prev) => prev.filter((id) => id !== programId));
        }
      }
    },
    [user, savedIds]
  );

  const applyMatcherScores = useCallback((scoredPrograms) => {
    const map = {};
    scoredPrograms.forEach((p) => {
      map[p.id] = p.calculatedScore;
    });
    setMatcherScores(map);
  }, []);

  const value = {
    programs,
    savedIds,
    eligibilityByProgramId,
    loading,
    matcherScores,
    refreshPrograms: loadPrograms,
    toggleSaved,
    applyMatcherScores
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
