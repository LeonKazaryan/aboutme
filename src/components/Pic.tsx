"use client";

import Image from "next/image";
import { photos, type PhotoKey } from "@/content/photos";
import { useLang } from "@/lib/lang";

type Props = {
  id: PhotoKey;
  sizes: string;
  className?: string;
  eager?: boolean;
  /** Decorative repeat of a photo already described nearby. */
  hidden?: boolean;
};

export function Pic({ id, sizes, className, eager, hidden }: Props) {
  const { lang } = useLang();
  const photo = photos[id];
  return (
    <Image
      src={photo.src}
      width={photo.w}
      height={photo.h}
      alt={hidden ? "" : photo.alt[lang]}
      sizes={sizes}
      className={className}
      loading={eager ? "eager" : "lazy"}
    />
  );
}

/** Heading whose authored lines rise from behind their own baselines. */
export function Lines({ lines, as: Tag = "h2", className }: {
  lines: string[];
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={className} data-rise="lines">
      {lines.map((line, i) => (
        <span className="mask" key={i}>
          <span style={{ "--i": i } as React.CSSProperties}>{line}</span>{" "}
        </span>
      ))}
    </Tag>
  );
}
