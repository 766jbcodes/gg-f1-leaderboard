import { useAllWeeklyPredictions } from '../hooks/useAllWeeklyPredictions';
import type { Race } from '../hooks/useRaces';

interface WeeklyPredictionsGridProps {
  race: Race;
}

function isUnlocked(race: Race): boolean {
  const deadline = race.qualifying_end_utc ?? race.race_start_utc;
  if (!deadline) return false;
  return Date.now() > new Date(deadline).getTime();
}

export function WeeklyPredictionsGrid({ race }: WeeklyPredictionsGridProps) {
  const unlocked = isUnlocked(race);
  const { data: userPredictions, isLoading } = useAllWeeklyPredictions(unlocked ? race.id : null);

  if (!unlocked) {
    return (
      <div className="mt-6 rounded-xl border border-border bg-white/60 p-6 text-center">
        <span className="text-2xl">🔒</span>
        <p className="mt-2 text-sm font-semibold text-navy">
          Everyone's picks for {race.name} will be visible once qualifying starts.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="mt-6 text-sm text-navy/80">Loading predictions…</p>;
  }

  if (!userPredictions?.length) {
    return (
      <p className="mt-6 text-sm text-navy/80">No predictions submitted for this race.</p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-base font-bold text-navy mb-3">Everyone's picks — {race.name}</h3>
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="min-w-full text-sm divide-y divide-border bg-white">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10">
                Pos
              </th>
              {userPredictions.map((u) => (
                <th
                  key={u.userId}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {u.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 10 }, (_, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-2 font-bold text-navy">{i + 1}</td>
                {userPredictions.map((u) => (
                  <td key={u.userId} className="px-4 py-2 text-navy">
                    {u.top10[i] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
