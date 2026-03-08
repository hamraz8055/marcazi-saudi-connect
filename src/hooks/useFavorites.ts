import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavoriteIds(new Set()); setLoading(false); return; }
    const { data } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id);
    setFavoriteIds(new Set((data || []).map(f => f.listing_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (listingId: string) => {
    if (!user) return false;
    const isFav = favoriteIds.has(listingId);
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(listingId); return next; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: listingId });
      setFavoriteIds(prev => new Set(prev).add(listingId));
    }
    return true;
  }, [user, favoriteIds]);

  const isFavorite = useCallback((listingId: string) => favoriteIds.has(listingId), [favoriteIds]);

  return { favoriteIds, loading, toggleFavorite, isFavorite, refetch: fetchFavorites };
}
