import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';

const TYPE_OPTIONS = ['Scholarship', 'Educational Assistance', 'Student Employment', 'Student Loan', 'Training & Certification'];
const STATUS_OPTIONS = ['Active', 'In Review', 'Draft', 'Expired'];
const PROVIDER_TYPE_OPTIONS = ['government', 'lgu', 'private', 'school', 'bank'];
const EDUCATION_OPTIONS = ['', 'College', 'Graduate'];
const NEW_PROVIDER_VALUE = '__new__';

function arrayToLines(arr) {
  return (arr || []).join('\n');
}
function linesToArray(text) {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToCsv(arr) {
  return (arr || []).join(', ');
}
function csvToArray(text) {
  return text.split(',').map((s) => s.trim()).filter(Boolean);
}
function toIntOrNull(v) {
  return v === '' ? null : parseInt(v, 10);
}
function toNumOrNull(v) {
  return v === '' ? null : parseFloat(v);
}

const BLANK_FORM = {
  title: '',
  type: TYPE_OPTIONS[0],
  provider_id: '',
  dept: '',
  duration: '',
  summary: '',
  funding: '',
  annual_value: '',
  deadline: '',
  status: 'Draft',
  min_gpa: '',
  education_req: '',
  min_year_level: '',
  max_year_level: '',
  age_min: '',
  age_max: '',
  financial_req: false,
  course_req: '',
  location: '',
  degree_required: '',
  citizenship: '',
  source_url: '',
  last_verified_at: new Date().toISOString().slice(0, 10),
  why_strong_match: '',
  tags: '',
  keywords: ''
};

export default function AdminProgramFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { programs, refreshPrograms } = useData();

  const [form, setForm] = useState(BLANK_FORM);
  const [providers, setProviders] = useState([]);
  const [addingProvider, setAddingProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', type: PROVIDER_TYPE_OPTIONS[0], website: '' });

  const [documentsCatalog, setDocumentsCatalog] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState(new Set());
  const [newDoc, setNewDoc] = useState({ name: '', description: '' });

  const [steps, setSteps] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const [providersRes, docsRes] = await Promise.all([
        supabase.from('providers').select('*').order('name'),
        supabase.from('documents').select('*').order('name')
      ]);
      if (cancelled) return;
      if (providersRes.error) setErrorMsg(`Failed to load providers: ${providersRes.error.message}`);
      else setProviders(providersRes.data);
      if (docsRes.error) setErrorMsg((prev) => prev || `Failed to load documents: ${docsRes.error.message}`);
      else setDocumentsCatalog(docsRes.data);

      if (isEditing) {
        const existing = programs.find((p) => p.id === id);
        if (existing) {
          setForm({
            title: existing.title || '',
            type: existing.type || TYPE_OPTIONS[0],
            provider_id: existing.provider_id || '',
            dept: existing.dept || '',
            duration: existing.duration || '',
            summary: existing.summary || '',
            funding: existing.funding || '',
            annual_value: existing.annual_value ?? '',
            deadline: existing.deadline || '',
            status: existing.status || 'Draft',
            min_gpa: existing.min_gpa ?? '',
            education_req: existing.education_req || '',
            min_year_level: existing.min_year_level ?? '',
            max_year_level: existing.max_year_level ?? '',
            age_min: existing.age_min ?? '',
            age_max: existing.age_max ?? '',
            financial_req: existing.financial_req || false,
            course_req: existing.course_req || '',
            location: existing.location || '',
            degree_required: existing.degree_required || '',
            citizenship: existing.citizenship || '',
            source_url: existing.source_url || '',
            last_verified_at: existing.last_verified_at || new Date().toISOString().slice(0, 10),
            why_strong_match: arrayToLines(existing.why_strong_match),
            tags: arrayToCsv(existing.tags),
            keywords: arrayToCsv(existing.keywords)
          });
        }

        const [progDocsRes, stepsRes] = await Promise.all([
          supabase.from('program_documents').select('document_id').eq('program_id', id),
          supabase.from('application_steps').select('*').eq('program_id', id).order('step_number', { ascending: true })
        ]);
        if (cancelled) return;
        if (!progDocsRes.error) setSelectedDocIds(new Set(progDocsRes.data.map((r) => r.document_id)));
        if (!stepsRes.error) setSteps(stepsRes.data.map((s) => ({ title: s.title, description: s.description })));
      }

      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
    // programs intentionally omitted: only need it once on mount to seed the form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDoc(docId) {
    setSelectedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  }

  async function handleAddDocument() {
    if (!newDoc.name.trim()) return;
    const { data, error } = await supabase
      .from('documents')
      .insert({ name: newDoc.name.trim(), description: newDoc.description.trim() || null })
      .select()
      .single();
    if (error) {
      setErrorMsg(`Failed to add document: ${error.message}`);
      return;
    }
    setDocumentsCatalog((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedDocIds((prev) => new Set(prev).add(data.id));
    setNewDoc({ name: '', description: '' });
  }

  function addStep() {
    setSteps((prev) => [...prev, { title: '', description: '' }]);
  }
  function updateStep(index, key, value) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  }
  function removeStep(index) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!form.title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }
    if (addingProvider && !newProvider.name.trim()) {
      setErrorMsg('New provider needs a name, or pick an existing provider.');
      return;
    }

    setSaving(true);

    let providerId = form.provider_id || null;
    if (addingProvider) {
      const { data, error } = await supabase
        .from('providers')
        .insert({ name: newProvider.name.trim(), type: newProvider.type, website: newProvider.website.trim() || null })
        .select()
        .single();
      if (error) {
        setErrorMsg(`Failed to create provider: ${error.message}`);
        setSaving(false);
        return;
      }
      providerId = data.id;
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      provider_id: providerId,
      dept: form.dept.trim() || null,
      duration: form.duration.trim() || null,
      summary: form.summary.trim() || null,
      funding: form.funding.trim() || null,
      annual_value: toNumOrNull(form.annual_value),
      deadline: form.deadline || null,
      status: form.status,
      min_gpa: toNumOrNull(form.min_gpa),
      education_req: form.education_req || null,
      min_year_level: toIntOrNull(form.min_year_level),
      max_year_level: toIntOrNull(form.max_year_level),
      age_min: toIntOrNull(form.age_min),
      age_max: toIntOrNull(form.age_max),
      financial_req: form.financial_req,
      course_req: form.course_req.trim() || null,
      location: form.location.trim() || null,
      degree_required: form.degree_required.trim() || null,
      citizenship: form.citizenship.trim() || null,
      source_url: form.source_url.trim() || null,
      last_verified_at: form.last_verified_at || null,
      why_strong_match: linesToArray(form.why_strong_match),
      tags: csvToArray(form.tags),
      keywords: csvToArray(form.keywords)
    };

    let programId = id;
    if (isEditing) {
      const { error } = await supabase.from('programs').update(payload).eq('id', id);
      if (error) {
        setErrorMsg(`Failed to save program: ${error.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from('programs').insert(payload).select().single();
      if (error) {
        setErrorMsg(`Failed to create program: ${error.message}`);
        setSaving(false);
        return;
      }
      programId = data.id;
    }

    // Simplest correct sync for a hackathon CRUD: replace the full set rather than diff it.
    const { error: delDocsError } = await supabase.from('program_documents').delete().eq('program_id', programId);
    if (delDocsError) console.warn('Failed to clear document checklist:', delDocsError.message);
    if (selectedDocIds.size > 0) {
      const rows = [...selectedDocIds].map((document_id) => ({ program_id: programId, document_id, is_required: true }));
      const { error: insDocsError } = await supabase.from('program_documents').insert(rows);
      if (insDocsError) console.warn('Failed to save document checklist:', insDocsError.message);
    }

    const { error: delStepsError } = await supabase.from('application_steps').delete().eq('program_id', programId);
    if (delStepsError) console.warn('Failed to clear application steps:', delStepsError.message);
    const validSteps = steps.filter((s) => s.title.trim() && s.description.trim());
    if (validSteps.length > 0) {
      const rows = validSteps.map((s, i) => ({ program_id: programId, step_number: i + 1, title: s.title.trim(), description: s.description.trim() }));
      const { error: insStepsError } = await supabase.from('application_steps').insert(rows);
      if (insStepsError) console.warn('Failed to save application steps:', insStepsError.message);
    }

    await refreshPrograms();
    setSaving(false);
    navigate('/admin-dashboard');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="material-symbols-outlined text-4xl text-accent-violet animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-4xl mx-auto gap-6">
      <div
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center gap-2 text-sm font-heading font-bold text-ink cursor-pointer hover:text-accent-violet transition-colors w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Registry
      </div>

      <h1 className="text-2xl font-extrabold font-heading text-ink tracking-tight">
        {isEditing ? 'Edit Program' : 'Add New Program'}
      </h1>

      {errorMsg && <div className="p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink">{errorMsg}</div>}

      {/* Basics */}
      <div className="card-sticker p-6 bg-card flex flex-col gap-4">
        <h2 className="text-sm font-heading font-extrabold uppercase tracking-wider text-ink-muted">Basics</h2>

        <div className="space-y-1">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Title</label>
          <input value={form.title} onChange={(e) => setField('title', e.target.value)} required className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Type</label>
            <select value={form.type} onChange={(e) => setField('type', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold">
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Status</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Provider</label>
          <select
            value={addingProvider ? NEW_PROVIDER_VALUE : form.provider_id}
            onChange={(e) => {
              if (e.target.value === NEW_PROVIDER_VALUE) setAddingProvider(true);
              else {
                setAddingProvider(false);
                setField('provider_id', e.target.value);
              }
            }}
            className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
          >
            <option value="">— None —</option>
            {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            <option value={NEW_PROVIDER_VALUE}>+ Add New Provider…</option>
          </select>
          {addingProvider && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 p-3 rounded-2xl bg-paper border-2 border-ink/20">
              <input
                value={newProvider.name}
                onChange={(e) => setNewProvider((p) => ({ ...p, name: e.target.value }))}
                placeholder="Provider name"
                className="w-full input-playful py-2 px-3 text-xs font-semibold"
              />
              <select
                value={newProvider.type}
                onChange={(e) => setNewProvider((p) => ({ ...p, type: e.target.value }))}
                className="w-full input-playful py-2 px-3 text-xs font-semibold"
              >
                {PROVIDER_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                value={newProvider.website}
                onChange={(e) => setNewProvider((p) => ({ ...p, website: e.target.value }))}
                placeholder="Website (optional)"
                className="w-full input-playful py-2 px-3 text-xs font-semibold"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Department / Focus Area</label>
            <input value={form.dept} onChange={(e) => setField('dept', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Duration</label>
            <input value={form.duration} onChange={(e) => setField('duration', e.target.value)} placeholder="e.g. 1 Year (Renewable)" className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Summary</label>
          <textarea value={form.summary} onChange={(e) => setField('summary', e.target.value)} rows={3} className="w-full input-playful py-2.5 px-4 text-xs font-semibold resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Funding (display text)</label>
            <input value={form.funding} onChange={(e) => setField('funding', e.target.value)} placeholder="e.g. ₱50,000 / yr" className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Annual Value (₱)</label>
            <input type="number" min="0" value={form.annual_value} onChange={(e) => setField('annual_value', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Deadline</label>
            <input type="date" value={form.deadline} onChange={(e) => setField('deadline', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>
      </div>

      {/* Eligibility rules */}
      <div className="card-sticker p-6 bg-card flex flex-col gap-4">
        <h2 className="text-sm font-heading font-extrabold uppercase tracking-wider text-ink-muted">Eligibility Rules</h2>
        <p className="text-[11px] text-ink-muted -mt-2 font-medium">Leave a field blank for "no restriction" — computeEligibility() only checks fields you set here.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Min GPA (%)</label>
            <input type="number" min="0" max="100" step="0.1" value={form.min_gpa} onChange={(e) => setField('min_gpa', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Education Level</label>
            <select value={form.education_req} onChange={(e) => setField('education_req', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold">
              {EDUCATION_OPTIONS.map((o) => <option key={o} value={o}>{o || '— Any —'}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Course Requirement</label>
            <input value={form.course_req} onChange={(e) => setField('course_req', e.target.value)} placeholder="e.g. IT / Computer Science" className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Min Year Level</label>
            <input type="number" min="1" max="6" value={form.min_year_level} onChange={(e) => setField('min_year_level', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Max Year Level</label>
            <input type="number" min="1" max="6" value={form.max_year_level} onChange={(e) => setField('max_year_level', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Min Age</label>
            <input type="number" min="0" value={form.age_min} onChange={(e) => setField('age_min', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Max Age</label>
            <input type="number" min="0" value={form.age_max} onChange={(e) => setField('age_max', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Location Restriction</label>
            <input value={form.location} onChange={(e) => setField('location', e.target.value)} placeholder="e.g. Cebu (blank = nationwide)" className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink pb-2.5">
            <input type="checkbox" checked={form.financial_req} onChange={(e) => setField('financial_req', e.target.checked)} className="w-4 h-4 rounded border-2 border-ink text-accent-violet focus:ring-0" />
            <span>Requires financial-need documentation</span>
          </label>
        </div>
      </div>

      {/* Verification & display */}
      <div className="card-sticker p-6 bg-card flex flex-col gap-4">
        <h2 className="text-sm font-heading font-extrabold uppercase tracking-wider text-ink-muted">Verification &amp; Display</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Official Source URL</label>
            <input value={form.source_url} onChange={(e) => setField('source_url', e.target.value)} placeholder="https://..." className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Last Verified</label>
            <input type="date" value={form.last_verified_at} onChange={(e) => setField('last_verified_at', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Degree Required (display)</label>
            <input value={form.degree_required} onChange={(e) => setField('degree_required', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Citizenship (display)</label>
            <input value={form.citizenship} onChange={(e) => setField('citizenship', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Why It's a Strong Match (one per line)</label>
          <textarea value={form.why_strong_match} onChange={(e) => setField('why_strong_match', e.target.value)} rows={3} className="w-full input-playful py-2.5 px-4 text-xs font-semibold resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setField('tags', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
              Keywords (comma-separated — feeds the AI Matcher)
            </label>
            <input value={form.keywords} onChange={(e) => setField('keywords', e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>
      </div>

      {/* Document checklist */}
      <div className="card-sticker p-6 bg-card flex flex-col gap-4">
        <h2 className="text-sm font-heading font-extrabold uppercase tracking-wider text-ink-muted">Required Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {documentsCatalog.map((doc) => (
            <label key={doc.id} className="flex items-start gap-2 cursor-pointer text-xs font-semibold text-ink p-2 rounded-xl hover:bg-card-subtle">
              <input
                type="checkbox"
                checked={selectedDocIds.has(doc.id)}
                onChange={() => toggleDoc(doc.id)}
                className="w-4 h-4 mt-0.5 rounded border-2 border-ink text-accent-violet focus:ring-0 shrink-0"
              />
              <span>
                {doc.name}
                {doc.description && <span className="block text-[11px] text-ink-muted font-medium">{doc.description}</span>}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t-2 border-ink/10">
          <input
            value={newDoc.name}
            onChange={(e) => setNewDoc((d) => ({ ...d, name: e.target.value }))}
            placeholder="New document name"
            className="flex-1 input-playful py-2 px-3 text-xs font-semibold"
          />
          <input
            value={newDoc.description}
            onChange={(e) => setNewDoc((d) => ({ ...d, description: e.target.value }))}
            placeholder="Description (optional)"
            className="flex-1 input-playful py-2 px-3 text-xs font-semibold"
          />
          <button type="button" onClick={handleAddDocument} className="btn-candy btn-candy-secondary btn-candy-sm shrink-0">
            Add to Catalog
          </button>
        </div>
      </div>

      {/* Application steps */}
      <div className="card-sticker p-6 bg-card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading font-extrabold uppercase tracking-wider text-ink-muted">Application Steps</h2>
          <button type="button" onClick={addStep} className="btn-candy btn-candy-secondary btn-candy-sm">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Step
          </button>
        </div>

        {steps.length === 0 && <p className="text-xs text-ink-muted font-medium">No steps yet — add at least one so students see a recommended next action.</p>}

        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start p-3 rounded-2xl bg-paper border-2 border-ink/20">
            <div className="w-8 h-8 rounded-xl bg-accent-violet text-white border-2 border-ink flex items-center justify-center shrink-0 font-heading font-extrabold text-xs mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                value={step.title}
                onChange={(e) => updateStep(i, 'title', e.target.value)}
                placeholder="Step title"
                className="w-full input-playful py-2 px-3 text-xs font-semibold"
              />
              <textarea
                value={step.description}
                onChange={(e) => updateStep(i, 'description', e.target.value)}
                placeholder="Step description"
                rows={2}
                className="w-full input-playful py-2 px-3 text-xs font-semibold resize-none"
              />
            </div>
            <button type="button" onClick={() => removeStep(i)} className="shrink-0 mt-1 text-ink-muted hover:text-accent-pink">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pb-4">
        <button type="button" onClick={() => navigate('/admin-dashboard')} className="btn-candy btn-candy-secondary px-6">Cancel</button>
        <button type="submit" disabled={saving} className="btn-candy px-6 disabled:opacity-60">
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Program'}
        </button>
      </div>
    </form>
  );
}
