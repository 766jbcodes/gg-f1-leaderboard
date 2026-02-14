import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNextRace } from '../hooks/useRaces';
import { useWeeklyPrediction } from '../hooks/useWeeklyPrediction';
import { DRIVERS_2026 } from '../data/drivers2026';
import { WeeklyLeaderboard } from './WeeklyLeaderboard';

const DEADLINE_OFFSET_MS = 0;

function formatDeadline(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

function isPastDeadline(qualifyingEndUtc: string | null): boolean {
  if (!qualifyingEndUtc) return false;
  return Date.now() > new Date(qualifyingEndUtc).getTime() + DEADLINE_OFFSET_MS;
}

export function PointsFinishPage() {
  const { user } = useAuth();
  const { nextRace, isLoading: racesLoading, error: racesError } = useNextRace();
  const {
    prediction: savedTop10,
    updatedAt,
    isLoading: predLoading,
    save,
    isSaving,
    saveError,
  } = useWeeklyPrediction(nextRace?.id ?? null, user?.id);

  const [top10, setTop10] = useState<string[]>(() =>
    Array(10)
      .fill('')
      .map((_, i) => savedTop10?.[i] ?? '')
  );

  React.useEffect(() => {
    if (savedTop10?.length) {
      setTop10((prev) =>
        Array(10)
          .fill('')
          .map((_, i) => savedTop10[i] ?? prev[i] ?? '')
      );
    }
  }, [savedTop10]);

  const deadline = nextRace?.qualifying_end_utc ?? nextRace?.race_start_utc ?? null;
  const locked = nextRace ? isPastDeadline(deadline) : false;

  const setPosition = (index: number, value: string) => {
    setTop10((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = top10.filter(Boolean);
    if (list.length !== 10) {
      return;
    }
    const uniq = new Set(list);
    if (uniq.size !== 10) {
      return;
    }
    await save(list);
  };

  const valid = useMemo(() => {
    const list = top10.filter(Boolean);
    if (list.length !== 10) return false;
    return new Set(list).size === 10;
  }, [top10]);

  if (racesLoading || predLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-navy font-bold">Loading…</p>
      </div>
    );
  }

  if (racesError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-red font-bold">Failed to load races.</p>
      </div>
    );
  }

  if (!nextRace) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-4">Points Finish</h1>
        <p className="text-navy/80">No upcoming race. Check back when the 2026 schedule is set.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-2">Points Finish</h1>
      <p className="text-navy/80 text-sm mb-4">
        Predict the top 10 finishers in order. One point per correct position (P1 = 1 pt, P2 = 1 pt, …). Max 10 points per race.
      </p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-input p-6 mb-8 shadow-apple">
        <h2 className="text-lg font-bold text-navy mb-1">{nextRace.name}</h2>
        <p className="text-sm text-navy/80">
          Deadline: {formatDeadline(deadline)}
          {locked && <span className="text-red font-bold ml-2">(locked)</span>}
        </p>
        {updatedAt && (
          <p className="text-xs text-navy/60 mt-1">
            Last saved: {formatDeadline(updatedAt)}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-sm font-bold text-navy">{i + 1}.</span>
              <select
                value={top10[i] ?? ''}
                onChange={(e) => setPosition(i, e.target.value)}
                disabled={locked}
                className="flex-1 px-3 py-2 bg-white border border-input rounded-md text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
              >
                <option value="">Select driver</option>
                {DRIVERS_2026.map((d) => (
                  <option key={d} value={d} disabled={top10.includes(d) && top10[i] !== d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {saveError && (
          <p className="text-sm text-red font-bold" role="alert">
            {saveError instanceof Error ? saveError.message : 'Save failed'}
          </p>
        )}

        {!locked && (
          <button
            type="submit"
            disabled={!valid || isSaving}
            className="w-full py-3 px-6 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
          >
            {isSaving ? 'Saving…' : 'Save prediction'}
          </button>
        )}
      </form>

      <WeeklyLeaderboard />
    </div>
  );
}
