import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOnboardingChecklist } from '../hooks/useOnboardingChecklist';
import { OnboardingChecklistModal, getOnboardingChecklistDismissed } from './OnboardingChecklistModal';

/**
 * When the user is signed in and has incomplete onboarding tasks, shows the
 * checklist modal once per session (dismissal stored in sessionStorage).
 */
export function OnboardingChecklistGate() {
  const { user } = useAuth();
  const { checklist, isLoading, hasIncompleteTasks } = useOnboardingChecklist(user?.id ?? undefined);
  const [dismissedThisMount, setDismissedThisMount] = useState(false);

  const alreadyDismissedSession = getOnboardingChecklistDismissed();
  const showModal =
    Boolean(user && checklist && hasIncompleteTasks) && !dismissedThisMount && !alreadyDismissedSession;

  useEffect(() => {
    if (!showModal) return;
    // Optional: re-check sessionStorage when window gains focus (e.g. they dismissed in another tab)
    const onFocus = () => {
      if (getOnboardingChecklistDismissed()) setDismissedThisMount(true);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [showModal]);

  const handleDismiss = () => {
    setDismissedThisMount(true);
  };

  if (!showModal || !checklist) return null;

  return <OnboardingChecklistModal checklist={checklist} onDismiss={handleDismiss} />;
}
