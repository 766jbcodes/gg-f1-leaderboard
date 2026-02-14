import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Race {
  id: string;
  season: number;
  round: number;
  name: string;
  race_start_utc: string;
  qualifying_end_utc: string | null;
  reminder_sent_at: string | null;
}

export function useUpcomingRaces() {
  const now = new Date().toISOString();
  return useQuery({
    queryKey: ['races', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('races')
        .select('id, season, round, name, race_start_utc, qualifying_end_utc, reminder_sent_at')
        .gte('race_start_utc', now)
        .order('race_start_utc', { ascending: true })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as Race[];
    },
  });
}

export function useNextRace() {
  const { data: races, ...rest } = useUpcomingRaces();
  const nextRace = races?.[0] ?? null;
  return { nextRace, races: races ?? [], ...rest };
}
