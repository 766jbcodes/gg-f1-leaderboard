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

/** Returns all races for a given season, ordered by round. */
export function useAllRaces(season: number) {
  return useQuery({
    queryKey: ['races', season, 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('races')
        .select('id, season, round, name, race_start_utc, qualifying_end_utc, reminder_sent_at')
        .eq('season', season)
        .order('round', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Race[];
    },
  });
}

/** Returns round 1 of the 2026 season, used to lock season predictions before quali. */
export function useRound1Race() {
  return useQuery({
    queryKey: ['races', 2026, 1],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('races')
        .select('id, season, round, name, race_start_utc, qualifying_end_utc, reminder_sent_at')
        .eq('season', 2026)
        .eq('round', 1)
        .maybeSingle();
      if (error) throw error;
      return data as Race | null;
    },
  });
}
