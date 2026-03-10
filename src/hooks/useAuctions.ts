import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

export interface AuctionData {
  id: string;
  reference_no: string | null;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  city: string;
  images: string[] | null;
  starting_price: number;
  reserve_price: number | null;
  current_bid: number | null;
  bid_increment: number | null;
  start_time: string | null;
  ends_at: string;
  end_time?: string;
  extended: boolean | null;
  status: string | null;
  winner_id: string | null;
  winning_bid: number | null;
  deposit_required: boolean | null;
  deposit_pct: number | null;
  auto_extend_minutes: number | null;
  total_bids: number | null;
  total_views: number | null;
  watchers: number | null;
  condition: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BidData {
  id: string;
  auction_id: string;
  user_id: string;
  amount: number;
  is_winning: boolean | null;
  is_auto_bid: boolean | null;
  max_auto_bid: number | null;
  status: string | null;
  created_at: string;
}

export const getBidIncrement = (currentBid: number): number => {
  if (currentBid < 10000) return 500;
  if (currentBid < 100000) return 1000;
  if (currentBid < 500000) return 5000;
  if (currentBid < 1000000) return 10000;
  return 25000;
};

export const useAuctionDetail = (auctionId: string | undefined) => {
  const { user } = useAuth();
  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [bids, setBids] = useState<BidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  const fetchAuction = useCallback(async () => {
    if (!auctionId) return;
    const { data } = await supabase.from("auctions").select("*").eq("id", auctionId).single();
    if (data) setAuction(data as any);
    setLoading(false);
  }, [auctionId]);

  const fetchBids = useCallback(async () => {
    if (!auctionId) return;
    const { data } = await supabase
      .from("bids")
      .select("*")
      .eq("auction_id", auctionId)
      .order("amount", { ascending: false })
      .limit(50);
    if (data) setBids(data as any);
  }, [auctionId]);

  const checkDeposit = useCallback(async () => {
    if (!auctionId || !user) return;
    const { data } = await supabase
      .from("auction_deposits")
      .select("id")
      .eq("auction_id", auctionId)
      .eq("user_id", user.id)
      .eq("status", "paid")
      .maybeSingle();
    setHasDeposit(!!data);
  }, [auctionId, user]);

  const checkWatching = useCallback(async () => {
    if (!auctionId || !user) return;
    const { data } = await supabase
      .from("auction_watchers")
      .select("auction_id")
      .eq("auction_id", auctionId)
      .eq("user_id", user.id)
      .maybeSingle();
    setIsWatching(!!data);
  }, [auctionId, user]);

  useEffect(() => {
    fetchAuction();
    fetchBids();
  }, [fetchAuction, fetchBids]);

  useEffect(() => {
    checkDeposit();
    checkWatching();
  }, [checkDeposit, checkWatching]);

  // Realtime subscription for new bids
  useEffect(() => {
    if (!auctionId) return;
    const channel = supabase
      .channel(`auction-${auctionId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "bids",
        filter: `auction_id=eq.${auctionId}`,
      }, (payload) => {
        const newBid = payload.new as BidData;
        setBids(prev => [newBid, ...prev]);
        setAuction(prev => prev ? {
          ...prev,
          current_bid: Math.max(Number(prev.current_bid) || 0, newBid.amount),
          total_bids: (prev.total_bids || 0) + 1,
        } : prev);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auctionId]);

  const placeBid = async (amount: number, maxAutoBid?: number) => {
    if (!user || !auction) throw new Error("Not authenticated");
    if (auction.user_id === user.id) throw new Error("Cannot bid on own auction");

    const minBid = (Number(auction.current_bid) || Number(auction.starting_price)) + getBidIncrement(Number(auction.current_bid) || Number(auction.starting_price));
    if (amount < minBid) throw new Error(`Minimum bid is ${minBid.toLocaleString()} SAR`);

    // Insert bid
    const { error } = await supabase.from("bids").insert({
      auction_id: auction.id,
      user_id: user.id,
      amount,
      is_auto_bid: !!maxAutoBid,
      max_auto_bid: maxAutoBid || null,
      is_winning: true,
      status: "winning",
    });
    if (error) throw error;

    // Update auction current_bid
    await supabase.from("auctions").update({
      current_bid: amount,
      total_bids: (auction.total_bids || 0) + 1,
    }).eq("id", auction.id);

    // Mark previous winning bids as outbid
    await supabase.from("bids")
      .update({ is_winning: false, status: "outbid" })
      .eq("auction_id", auction.id)
      .neq("user_id", user.id)
      .eq("is_winning", true);

    // Check auto-extend
    const endsAt = new Date(auction.ends_at);
    const now = new Date();
    const minsLeft = (endsAt.getTime() - now.getTime()) / 60000;
    if (minsLeft < (auction.auto_extend_minutes || 5)) {
      const newEnd = new Date(endsAt.getTime() + (auction.auto_extend_minutes || 5) * 60000);
      await supabase.from("auctions").update({
        ends_at: newEnd.toISOString(),
        extended: true,
      }).eq("id", auction.id);
    }

    await fetchAuction();
  };

  const payDeposit = async () => {
    if (!user || !auction) return;
    const depositAmount = Number(auction.starting_price) * (Number(auction.deposit_pct) || 5) / 100;
    await supabase.from("auction_deposits").insert({
      auction_id: auction.id,
      user_id: user.id,
      amount: depositAmount,
      status: "paid",
      paid_at: new Date().toISOString(),
    });
    setHasDeposit(true);
  };

  const toggleWatch = async () => {
    if (!user || !auction) return;
    if (isWatching) {
      await supabase.from("auction_watchers").delete()
        .eq("auction_id", auction.id).eq("user_id", user.id);
      setIsWatching(false);
    } else {
      await supabase.from("auction_watchers").insert({
        auction_id: auction.id,
        user_id: user.id,
      });
      setIsWatching(true);
    }
  };

  return { auction, bids, loading, hasDeposit, isWatching, placeBid, payDeposit, toggleWatch, refetch: fetchAuction };
};

export const useMyBiddingData = () => {
  const { user } = useAuth();
  const [myAuctions, setMyAuctions] = useState<AuctionData[]>([]);
  const [myBids, setMyBids] = useState<(BidData & { auction?: AuctionData })[]>([]);
  const [myQuotations, setMyQuotations] = useState<any[]>([]);
  const [mySubmittedQuotes, setMySubmittedQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetchAll = async () => {
      // My auctions
      const { data: auctions } = await supabase.from("auctions")
        .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setMyAuctions((auctions || []) as any);

      // My bids (with auction data)
      const { data: bidsData } = await supabase.from("bids")
        .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (bidsData && bidsData.length > 0) {
        const auctionIds = [...new Set(bidsData.map(b => b.auction_id))];
        const { data: auctionsData } = await supabase.from("auctions")
          .select("*").in("id", auctionIds);
        const auctionMap = new Map((auctionsData || []).map(a => [a.id, a]));
        setMyBids(bidsData.map(b => ({ ...b, auction: auctionMap.get(b.auction_id) })) as any);
      }

      // My quotations
      const { data: quots } = await supabase.from("quotations")
        .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setMyQuotations(quots || []);

      // My submitted quotes
      const { data: subQuotes } = await supabase.from("quote_responses")
        .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (subQuotes && subQuotes.length > 0) {
        const qIds = [...new Set(subQuotes.map(q => q.quotation_id))];
        const { data: qData } = await supabase.from("quotations")
          .select("*").in("id", qIds);
        const qMap = new Map((qData || []).map(q => [q.id, q]));
        setMySubmittedQuotes(subQuotes.map(q => ({ ...q, quotation: qMap.get(q.quotation_id) })));
      }

      setLoading(false);
    };

    fetchAll();
  }, [user]);

  return { myAuctions, myBids, myQuotations, mySubmittedQuotes, loading };
};
