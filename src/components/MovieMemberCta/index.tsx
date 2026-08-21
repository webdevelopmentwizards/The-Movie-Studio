"use client";

import BehindTheScenesButton from "@/components/BehindTheScenesButton";
import WatchMovieButton from "@/components/WatchMovieButton";
import { useMemberSession } from "@/hooks/useMemberSession";

interface MovieMemberCtaProps {
  compact?: boolean;
  className?: string;
}

export default function MovieMemberCta({
  compact = false,
  className = "",
}: MovieMemberCtaProps) {
  const { isMember } = useMemberSession();

  if (isMember) {
    return (
      <BehindTheScenesButton compact={compact} className={className} />
    );
  }

  return <WatchMovieButton compact={compact} className={className} />;
}
