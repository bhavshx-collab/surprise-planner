// useProStatus.js — Hook to check if user is on Pro tier
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useProStatus(user) {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsPro(false); setLoading(false); return; }
    supabase
      .from("pro_users")
      .select("expires_at")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.expires_at) {
          setIsPro(new Date(data.expires_at) > new Date());
        } else {
          setIsPro(false);
        }
        setLoading(false);
      })
      .catch(() => { setIsPro(false); setLoading(false); });
  }, [user?.id]);

  return { isPro, loading };
}
