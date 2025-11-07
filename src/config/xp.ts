const lessonDefault = Number(process.env.NEXT_PUBLIC_XP_PER_LESSON ?? 30);
const courseDefault = Number(process.env.NEXT_PUBLIC_XP_PER_COURSE ?? 250);

export const xpConfig = {
  perLesson: Number.isFinite(lessonDefault) ? lessonDefault : 30,
  perCourse: Number.isFinite(courseDefault) ? courseDefault : 250,
};

export type TierVisual = {
  name: string;
  gradient: string;
  baseBackground: string;
  textClass: string;
  mutedText: string;
  accentPill: string;
  glowClasses: string[];
  progressTrack: string;
  progressIndicator: string;
  sparkles: string[];
};

export function getTierVisuals(level: number): TierVisual {
  if (level >= 40) {
    return {
      name: "Legendary",
      gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 45%, #fb7185 100%)",
      baseBackground: "bg-rose-500",
      textClass: "text-white",
      mutedText: "text-white/80",
      accentPill: "bg-white/20 text-white",
      glowClasses: [
        "-left-6 top-0 h-32 w-32 bg-white/30",
        "right-0 bottom-0 h-40 w-40 bg-rose-400/30",
      ],
      progressTrack: "bg-white/20",
      progressIndicator: "bg-white",
      sparkles: [
        "left-1/3 top-4 h-2 w-2 bg-white/70",
        "right-8 top-10 h-1.5 w-1.5 bg-white/60",
        "left-6 bottom-8 h-1.5 w-1.5 bg-white/50",
      ],
    };
  }
  if (level >= 30) {
    return {
      name: "Mythic",
      gradient: "linear-gradient(135deg, #9333ea 0%, #7c3aed 35%, #ec4899 100%)",
      baseBackground: "bg-purple-600",
      textClass: "text-white",
      mutedText: "text-white/80",
      accentPill: "bg-white/20 text-white",
      glowClasses: [
        "left-0 top-0 h-32 w-32 bg-indigo-400/40",
        "right-6 bottom-0 h-40 w-40 bg-pink-400/30",
      ],
      progressTrack: "bg-white/25",
      progressIndicator: "bg-white",
      sparkles: [
        "right-8 top-6 h-1.5 w-1.5 bg-white/70",
        "left-1/4 top-14 h-2 w-2 bg-pink-200/70",
        "right-16 bottom-8 h-1.5 w-1.5 bg-indigo-200/80",
      ],
    };
  }
  if (level >= 20) {
    return {
      name: "Elite",
      gradient: "linear-gradient(135deg, #fde047 0%, #a3e635 70%, #86efac 100%)",
      baseBackground: "bg-yellow-300",
      textClass: "text-slate-900",
      mutedText: "text-slate-900/70",
      accentPill: "bg-white/60 text-slate-900",
      glowClasses: [
        "-right-6 -top-4 h-32 w-32 bg-white/40",
        "left-6 bottom-0 h-28 w-28 bg-amber-200/60",
      ],
      progressTrack: "bg-slate-900/10",
      progressIndicator: "bg-slate-900",
      sparkles: [
        "right-10 top-8 h-2 w-2 bg-white/60",
        "left-8 top-10 h-1.5 w-1.5 bg-white/50",
        "right-1/3 bottom-6 h-1.5 w-1.5 bg-lime-500/60",
      ],
    };
  }
  if (level >= 10) {
    return {
      name: "Seasoned",
      gradient: "linear-gradient(135deg, #10b981 0%, #22c55e 45%, #84cc16 100%)",
      baseBackground: "bg-emerald-500",
      textClass: "text-white",
      mutedText: "text-white/80",
      accentPill: "bg-white/20 text-white",
      glowClasses: [
        "left-0 top-0 h-32 w-32 bg-green-200/60",
        "right-8 bottom-0 h-24 w-24 bg-emerald-300/50",
      ],
      progressTrack: "bg-white/25",
      progressIndicator: "bg-white",
      sparkles: [
        "left-1/4 top-6 h-1.5 w-1.5 bg-white/60",
        "right-6 top-12 h-2 w-2 bg-lime-200/80",
        "left-10 bottom-4 h-1.5 w-1.5 bg-white/60",
      ],
    };
  }
  return {
    name: "Rookie",
    gradient: "linear-gradient(135deg, #768dc2ff 0%, #415371ff 60%, #475569 100%)",
    baseBackground: "bg-slate-900",
    textClass: "text-white",
    mutedText: "text-white/80",
    accentPill: "bg-white/20 text-white",
    glowClasses: [
      "left-0 top-0 h-28 w-28 bg-slate-500/40",
      "right-6 bottom-0 h-24 w-24 bg-gray-500/30",
    ],
    progressTrack: "bg-white/25",
    progressIndicator: "bg-white",
    sparkles: [
      "left-1/3 top-8 h-1.5 w-1.5 bg-white/50",
      "right-10 top-12 h-2 w-2 bg-white/60",
      "left-8 bottom-6 h-1.5 w-1.5 bg-white/40",
    ],
  };
}
