"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  LogOut,
  Clock,
  ArrowLeft,
  ChevronRight,
  PlayCircle,
  FileText,
} from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  week_number: number | null;
  video_url: string | null;
  thumbnail_url: string | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  Foundations: "bg-blue-100 text-blue-700",
  "Blood Sugar": "bg-rose-100 text-rose-700",
  Nutrition: "bg-green-100 text-green-700",
  Medications: "bg-purple-100 text-purple-700",
  Lifestyle: "bg-amber-100 text-amber-700",
};

const THUMBNAIL_GRADIENTS: Record<string, string> = {
  Foundations: "from-blue-400 to-blue-600",
  "Blood Sugar": "from-rose-400 to-rose-600",
  Nutrition: "from-green-400 to-green-600",
  Medications: "from-purple-400 to-purple-600",
  Lifestyle: "from-amber-400 to-amber-600",
};

function VideoPlayer({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);

  // YouTube embed support
  if (video.video_url) {
    const ytMatch = video.video_url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
      return (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    }

    // Generic video file
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
        <video src={video.video_url} controls className="w-full h-full" />
      </div>
    );
  }

  // Placeholder
  return (
    <div
      className={`aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br ${
        THUMBNAIL_GRADIENTS[video.category] ?? "from-teal-400 to-teal-600"
      } flex flex-col items-center justify-center cursor-pointer group`}
      onClick={() => setPlaying(!playing)}
    >
      {video.thumbnail_url && !playing ? (
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
      <div className="flex flex-col items-center gap-3 text-white">
        <PlayCircle className="w-16 h-16 text-white/90 group-hover:scale-110 transition-transform duration-200" />
        <p className="text-[0.875rem] text-white/80" style={{ fontWeight: 500 }}>
          Video coming soon
        </p>
      </div>
    </div>
  );
}

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoItem | null>(null);
  const [related, setRelated] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: videoData } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (videoData) {
        setVideo(videoData);

        const { data: relatedData } = await supabase
          .from("videos")
          .select("id, title, description, category, duration_minutes, week_number, video_url, thumbnail_url")
          .eq("category", videoData.category)
          .neq("id", videoId)
          .limit(4);

        if (relatedData) setRelated(relatedData);
      }

      setLoading(false);
    };
    run();
  }, [router, videoId]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[color:var(--muted-foreground)] mb-4">Video not found.</p>
          <Link href="/videos" className="text-[color:var(--primary)] hover:underline text-[0.875rem]">
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/member" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">DiabetesConfidence</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/member"
            className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 sm:gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] mb-6">
          <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/videos" className="hover:text-[color:var(--foreground)] transition-colors">
            Weekly Videos
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[color:var(--foreground)] truncate max-w-[180px]">{video.title}</span>
        </div>

        <Link
          href="/videos"
          className="inline-flex items-center gap-1.5 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to videos
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            <VideoPlayer video={video} />

            {/* Meta */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[0.7rem] px-2.5 py-0.5 rounded-full ${
                    CATEGORY_COLORS[video.category] ?? "bg-gray-100 text-gray-600"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {video.category}
                </span>
                {video.week_number && (
                  <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
                    Week {video.week_number}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[0.75rem] text-[color:var(--muted-foreground)]">
                  <Clock className="w-3.5 h-3.5" />
                  {video.duration_minutes} min
                </span>
              </div>

              <h1
                className="text-[1.5rem] text-[color:var(--foreground)] leading-snug mb-3"
                style={{ fontWeight: 700 }}
              >
                {video.title}
              </h1>
              <p className="text-[color:var(--muted-foreground)] text-[0.95rem] leading-relaxed">
                {video.description}
              </p>
            </div>

            {/* Transcript placeholder */}
            <div className="mt-8 bg-white rounded-2xl border border-[color:var(--border)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-[color:var(--primary)]" />
                <h2 className="text-[1rem] text-[color:var(--foreground)]" style={{ fontWeight: 600 }}>
                  Transcript
                </h2>
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-[color:var(--border)] rounded-full"
                    style={{ width: `${[92, 78, 85, 55][i]}%`, opacity: 0.5 }}
                  />
                ))}
                <p className="text-[0.8rem] text-[color:var(--muted-foreground)] pt-2">
                  Transcript will be available once the video is published.
                </p>
              </div>
            </div>
          </div>

          {/* Related videos sidebar */}
          {related.length > 0 && (
            <aside className="lg:w-72 shrink-0">
              <h2
                className="text-[0.9rem] text-[color:var(--foreground)] mb-4"
                style={{ fontWeight: 600 }}
              >
                More in {video.category}
              </h2>
              <div className="flex flex-col gap-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/videos/${rel.id}`}
                    className="group bg-white rounded-xl border border-[color:var(--border)] overflow-hidden hover:shadow-md transition-shadow flex gap-3 p-0"
                  >
                    {/* Mini thumbnail */}
                    <div
                      className={`w-24 shrink-0 bg-gradient-to-br ${
                        THUMBNAIL_GRADIENTS[rel.category] ?? "from-teal-400 to-teal-600"
                      } flex items-center justify-center`}
                    >
                      <PlayCircle className="w-6 h-6 text-white/80" />
                    </div>
                    <div className="py-2.5 pr-3 flex flex-col gap-1 min-w-0">
                      <p
                        className="text-[0.825rem] text-[color:var(--foreground)] leading-snug line-clamp-2"
                        style={{ fontWeight: 600 }}
                      >
                        {rel.title}
                      </p>
                      <span className="flex items-center gap-1 text-[0.7rem] text-[color:var(--muted-foreground)]">
                        <Clock className="w-3 h-3" />
                        {rel.duration_minutes} min
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
