import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export type PlaySource = {
  id: string;
  providerName: string;
  sourceType: string;
  playbackUrl: string;
  language: string | null;
  subtitlesLanguage: string | null;
  subtitleUrl: string | null;
  isOfficial: boolean;
};

export function Player({
  source,
  poster,
  startAt,
  onProgress,
}: {
  source: PlaySource | null;
  poster?: string | null;
  startAt?: number;
  onProgress?: (seconds: number, completed: boolean) => void;
}) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;
  const startRef = useRef(0);
  startRef.current = startAt ?? 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source || source.sourceType === "external") return;
    let cancelled = false;
    let detach: (() => void) | undefined;
    setError(null);
    setLoading(true);
    const onTime = () => {
      if (video.currentTime > 0) progressRef.current?.(Math.floor(video.currentTime), video.ended);
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onTime);
    const fail = () => {
      if (!cancelled) {
        setLoading(false);
        setError(source.sourceType === "hls" ? "HLS" : "media");
      }
    };
    video.addEventListener("error", fail);
    const jump = () => {
      if (startRef.current > 0 && video.currentTime < 1) video.currentTime = startRef.current;
    };
    if (source.sourceType === "mp4") {
      video.src = source.playbackUrl;
      video.addEventListener("loadedmetadata", jump, { once: true });
      setLoading(false);
    } else if (source.sourceType === "hls") {
      const native = video.canPlayType("application/vnd.apple.mpegurl");
      if (native) {
        video.src = source.playbackUrl;
        video.addEventListener("loadedmetadata", jump, { once: true });
        setLoading(false);
      } else {
        void import("hls.js")
          .then(({ default: Hls }) => {
            if (cancelled) return;
            if (!Hls.isSupported()) {
              fail();
              return;
            }
            const hls = new Hls({ enableWorker: true });
            hls.loadSource(source.playbackUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal) fail();
            });
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              jump();
              if (!cancelled) setLoading(false);
            });
            detach = () => hls.destroy();
          })
          .catch(fail);
      }
    }
    return () => {
      cancelled = true;
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onTime);
      video.removeEventListener("error", fail);
      detach?.();
    };
  }, [source]);

  if (!source || (source.sourceType !== "mp4" && source.sourceType !== "hls")) {
    return (
      <div className="panel grid min-h-52 place-items-center p-6 text-center">
        <div>
          <p className="font-bold">{t("noSource")}</p>
          <p className="mt-2 text-sm text-muted">{t("noSourceAr")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="relative bg-black">
        {loading ? <p className="absolute inset-x-0 top-3 text-center text-sm text-muted">{t("loading")}</p> : null}
        <video ref={videoRef} poster={poster ?? undefined} controls className="aspect-video w-full" playsInline>
          {source.subtitleUrl ? (
            <track kind="subtitles" src={source.subtitleUrl} srcLang={source.subtitlesLanguage ?? "ar"} label={source.subtitlesLanguage ?? "subtitles"} />
          ) : null}
        </video>
      </div>
      {error ? (
        <p className="p-4 text-sm text-danger">
          {error === "HLS"
            ? "This browser cannot play the HLS source."
            : "Playback failed for this authorized source."}
        </p>
      ) : (
        <p className="px-4 py-3 text-sm text-muted">
          {source.providerName}
          {source.language ? ` · ${source.language}` : ""}
          {source.isOfficial ? " · official" : ""}
        </p>
      )}
    </div>
  );
}
