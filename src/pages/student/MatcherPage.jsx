import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { getAIMatches, calculateMatchForPrompt, MATCHER_DEMO_PRESETS, MATCHER_PROFILE_TAGS } from '../../lib/matcher.js';

export default function MatcherPage() {
  const { profile } = useAuth();
  const { programs, applyMatcherScores } = useData();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isMatching, setIsMatching] = useState(false);

  function toggleTag(tag) {
    setSelectedTags((prev) => (prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id]));
    setPrompt((prev) => (prev ? `${prev} ${tag.label}` : tag.label));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || isMatching) return;

    setIsMatching(true);

    let scored;
    let usedFallback = false;
    try {
      scored = await getAIMatches(prompt, programs, profile);
    } catch (err) {
      console.warn('AI matching failed, falling back to offline ranking:', err);
      usedFallback = true;
      scored = calculateMatchForPrompt(prompt, programs, profile?.gpa ?? 75);
    }

    applyMatcherScores(scored);
    setIsMatching(false);
    navigate(usedFallback ? '/opportunities?ai=fallback' : '/opportunities');
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 items-center text-center py-6">
      <span className="badge-sticker badge-violet">
        <span className="material-symbols-outlined text-[15px]">auto_awesome</span> Natural Language AI Matcher
      </span>
      <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">
        Tell us about your situation, <span className="text-accent-violet">we'll find your fit</span>
      </h1>
      <p className="text-sm text-ink-muted max-w-xl font-medium leading-relaxed">
        Describe your education, location, financial need, and interests in your own words — the AI matches you across
        every category of Philippine student assistance.
      </p>

      <form onSubmit={handleSubmit} className="w-full card-sticker p-6 bg-card flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          placeholder="e.g. I'm a 2nd-year IT student in Cebu with an 82% GPA, looking for tuition assistance and transportation support..."
          className="w-full input-playful py-3 px-4 text-sm resize-none"
        />
        <button type="submit" disabled={!prompt.trim() || isMatching} className="btn-candy self-center px-8 disabled:opacity-60">
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          {isMatching ? 'Analyzing your profile requirements...' : 'Find Assistance'}
        </button>
      </form>

      <div className="w-full flex flex-col items-center space-y-3 pt-2">
        <span className="text-xs font-heading font-bold uppercase text-ink-muted tracking-wider">Demo Presets &amp; Starting Stories</span>
        <div className="flex flex-wrap justify-center gap-2">
          {MATCHER_DEMO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPrompt(preset.prompt)}
              className="badge-sticker badge-violet hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col items-center space-y-3 pt-2">
        <span className="text-xs font-heading font-bold uppercase text-ink-muted tracking-wider">Quick Profile Tags</span>
        <div className="flex flex-wrap justify-center gap-2">
          {MATCHER_PROFILE_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`badge-sticker text-xs py-1.5 px-3 transition-transform hover:scale-105 ${
                selectedTags.includes(tag.id) ? 'badge-violet shadow-pop-sm scale-105' : 'bg-card text-ink border-2 border-ink'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tag.icon}</span> {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
