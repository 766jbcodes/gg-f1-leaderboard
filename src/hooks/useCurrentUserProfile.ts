import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetches the current user's profile (display_name) from public.profiles.
 * Use for showing the user's name instead of email where possible.
 */
export function useCurrentUserProfile(userId: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data: row, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return row?.display_name ?? null;
    },
    enabled: Boolean(userId),
  });

  return { displayName: data ?? null, isLoading };
}
