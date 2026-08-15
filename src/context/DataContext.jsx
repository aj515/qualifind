import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  // Session-only relevance scores from the free-text AI Matcher (never persisted to the DB —
  // matches the old app's behavior where matchScore was purely a client-side heuristic).
  const [matcherScores, setMatcherScores] = useState({});

  const loadPrograms = useCallback(async () => {
    const { data, error } = await supabase.from('programs').select('*').order('deadline', { ascending: true });
    if (error) {
      console.warn('Failed to load programs:', error.message);
      setPrograms([]);
    } else {
      setPrograms(data);
    }
  }, []);

  const loadSaved = useCallback(async (userId) => {
    if (!userId) {
      setSavedIds([]);
      return;
    }
    const { data, error } = await supabase.from('saved_applications').select('program_id').eq('user_id', userId);
    if (error) {
      console.warn('Failed to load saved applications:', error.message);
      setSavedIds([]);
    } else {
      setSavedIds(data.map((row) => row.program_id));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPrograms(), loadSaved(user?.id)]).finally(() => setLoading(false));
  }, [user?.id, loadPrograms, loadSaved]);

  const toggleSaved = useCallback(
    async (programId) => {
      if (!user?.id) return;
      const isSaved = savedIds.includes(programId);

      if (isSaved) {
        setSavedIds((prev) => prev.filter((id) => id !== programId));
        const { error } = await supabase
          .from('saved_applications')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', programId);
        if (error) {
          console.warn('Failed to unsave:', error.message);
          setSavedIds((prev) => [...prev, programId]);
        }
      } else {
        setSavedIds((prev) => [...prev, programId]);
        const { error } = await supabase.from('saved_applications').insert({ user_id: user.id, program_id: programId });
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
