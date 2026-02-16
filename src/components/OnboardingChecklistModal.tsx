import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { OnboardingChecklistState } from '../hooks/useOnboardingChecklist';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';

const SESSION_STORAGE_KEY = 'gg-f1-onboarding-checklist-dismissed';

export interface OnboardingChecklistModalProps {
  checklist: OnboardingChecklistState;
  onDismiss: () => void;
}

export function OnboardingChecklistModal({ checklist, onDismiss }: OnboardingChecklistModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onDismiss]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onDismiss();
  };

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    onDismiss();
  };

  const tasks = [
    {
      id: 'drivers',
      label: 'Set drivers championship (2026)',
      done: checklist.driversChampionshipDone,
      to: '/season/2026/predictions',
    },
    {
      id: 'constructors',
      label: 'Set constructors championship (2026)',
      done: checklist.constructorsChampionshipDone,
      to: '/season/2026/predictions',
    },
    ...(checklist.nextRaceName
      ? [
          {
            id: 'weekly' as const,
            label: `Set weekly points finish${checklist.nextRaceName ? `: ${checklist.nextRaceName}` : ''}`,
            done: checklist.weeklyPointsFinishDone,
            to: '/points-finish',
          },
        ]
      : []),
  ];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-checklist-title"
    >
      <Card
        className="w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle id="onboarding-checklist-title" className="text-xl">
            Complete your setup
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Finish these to get the most out of the leaderboard and predictions.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2" role="list">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3">
                {task.done ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden>
                    ✓
                  </span>
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/40 text-muted-foreground" aria-hidden>
                    —
                  </span>
                )}
                {task.done ? (
                  <span className="text-muted-foreground line-through">{task.label}</span>
                ) : (
                  <Link
                    to={task.to}
                    className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    onClick={handleDismiss}
                  >
                    {task.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end pt-2">
          <Button variant="secondary" onClick={handleDismiss}>
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function getOnboardingChecklistDismissed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}
