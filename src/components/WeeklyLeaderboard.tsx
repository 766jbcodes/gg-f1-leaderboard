import { useWeeklyLeaderboard } from '../hooks/useWeeklyLeaderboard';

export function WeeklyLeaderboard() {
  const { data, isLoading, error } = useWeeklyLeaderboard(2026);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-navy mb-4">Points Finish leaderboard</h2>
        <p className="text-navy/80">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-navy mb-4">Points Finish leaderboard</h2>
        <p className="text-red font-bold">Failed to load leaderboard.</p>
      </div>
    );
  }

  const { aggregate, perRace } = data ?? { aggregate: [], perRace: [] };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-navy mb-4">Points Finish leaderboard</h2>
      <p className="text-sm text-navy/80 mb-4">
        One point per correct position (order matters). Season total below.
      </p>

      {aggregate.length === 0 ? (
        <p className="text-navy/80">No scores yet. Submit predictions and add race results to see the leaderboard.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-white mb-6">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-6">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Correct (total)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pr-6">
                    Races
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {aggregate.map((row, idx) => (
                  <tr key={row.userId} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-navy pl-6">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-navy">{row.displayName}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary text-right">{row.totalCorrect}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-right pr-6">{row.racesScored}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {perRace.length > 0 && (
            <details className="mt-4 group">
              <summary className="text-sm font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                Per-race breakdown
              </summary>
              <div className="mt-4 overflow-x-auto rounded-lg border border-border shadow-sm">
                <table className="min-w-full text-sm divide-y divide-border">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-xs">Race</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-xs">Name</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground uppercase tracking-wider text-xs">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white">
                    {perRace.map((r, i) => (
                      <tr key={`${r.raceId}-${r.userId}-${i}`} className="hover:bg-secondary/20">
                        <td className="px-4 py-2 text-navy">{r.raceName}</td>
                        <td className="px-4 py-2 text-navy">{r.displayName}</td>
                        <td className="px-4 py-2 text-primary font-medium text-right">{r.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
