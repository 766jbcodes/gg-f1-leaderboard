import React from 'react';

interface SeasonNotStartedNoticeProps {
  /** Optional compact variant for inline use (e.g. above a single tab's table) */
  compact?: boolean;
}

/**
 * Shown when viewing the current season but no race results/standings exist yet.
 * Explains that the season hasn't produced results to show and sets expectations.
 */
export const SeasonNotStartedNotice: React.FC<SeasonNotStartedNoticeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-3 text-muted-foreground">
        <span className="text-2xl shrink-0" aria-hidden>🏁</span>
        <p className="text-sm">
          No race results yet — leaderboard and standings will update after the first round.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-border bg-secondary/20 px-6 py-6 text-center animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="text-4xl mb-3" aria-hidden>🏁</div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Season hasn&apos;t started yet
      </h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        There are no race results to show just yet. Once the first round is in the books,
        the leaderboard and current standings will update here.
      </p>
    </div>
  );
};
