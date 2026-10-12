import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMembership, toggleFavorite, toggleWatchlist } from "@/lib/anime/fns";
import { useI18n } from "@/lib/i18n";

export function SaveButtons({ animeId }: { animeId: string }) {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [favorite, setFavorite] = useState(false);
  const [listed, setListed] = useState(false);
  useEffect(() => {
    if (!user) return;
    getMembership()
      .then((row) => {
        setFavorite(row.favoriteIds.includes(animeId));
        setListed(row.watchlistIds.includes(animeId));
      })
      .catch(() => undefined);
  }, [user, animeId]);
  if (isPending) return null;
  if (!user) {
    return <Link to="/login" className="btn btn-ghost">{t("signInNeeded")}</Link>;
  }
  async function run(kind: "favorite" | "watch") {
    try {
      if (kind === "favorite") setFavorite(await toggleFavorite({ data: animeId }));
      else setListed(await toggleWatchlist({ data: animeId }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn btn-primary" onClick={() => void run("favorite")}>{favorite ? t("saved") : t("addFavorite")}</button>
      <button type="button" className="btn btn-ghost" onClick={() => void run("watch")}>{listed ? t("listed") : t("watchlist")}</button>
    </div>
  );
}
