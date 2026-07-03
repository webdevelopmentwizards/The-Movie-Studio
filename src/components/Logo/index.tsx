"use client";

import Image from "next/image";
import Link from "next/link";

import { markHeroAudioUnlocked } from "@/utils/heroAudio";

const LOGO_SRC = "/assets/PRO_Movie_Studio_Logo_WHT2021-1769728410816.png";

interface LogoProps {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-11 w-auto md:h-12",
  md: "h-12 w-auto md:h-16",
  lg: "h-14 w-auto md:h-[4.5rem]",
};

export default function Logo({
  className = "",
  priority = false,
  size = "md",
}: LogoProps) {
  return (
    <Link
      href="/"
      onPointerDown={markHeroAudioUnlocked}
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src={LOGO_SRC}
        alt="The Movie Studio"
        width={360}
        height={72}
        priority={priority}
        className={sizeClasses[size]}
      />
    </Link>
  );
}
