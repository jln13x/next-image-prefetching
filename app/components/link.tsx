"use client";

import { PrefetchedImage, prefetchImages } from "@/app/shared/prefetch-images";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Link = (({ children, ...props }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [images, setImages] = useState<PrefetchedImage[]>([]);

  const [preloading, setPreloading] = useState<(() => void)[]>([]);

  const router = useRouter();

  useEffect(() => {
    const link = linkRef.current;

    if (!link) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries.at(0);

        if (!entry) return;

        if (entry.isIntersecting) {
          router.prefetch(String(props.href));
          await new Promise((resolve) => {
            router.prefetch(String(props.href));

            resolve(true);
          });

          await prefetchImages(String(props.href)).then(setImages);

          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px", threshold: 0.1 } // Trigger when at least 10% is visible
    );

    observer.observe(link);

    return () => {
      observer.disconnect();
    };
  }, [props.href, router]);

  return (
    <NextLink
      ref={linkRef}
      onMouseEnter={() => {
        router.prefetch(String(props.href));
        const p: (() => void)[] = [];

        for (const image of images) {
          const remove = prefetchImage(image);
          if (remove) p.push(remove);
        }
        setPreloading(p);
      }}
      onMouseLeave={() => {
        for (const remove of preloading) {
          remove();
        }

        setPreloading([]);
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}) as typeof NextLink;

const imgCache = new Set<string>();

function prefetchImage(image: PrefetchedImage) {
  if (image.loading === "lazy" || imgCache.has(image.srcset)) {
    return;
  }

  const img = new Image();

  img.src = image.src;
  img.srcset = image.srcset;
  imgCache.add(image.srcset);

  img.sizes = image.sizes;
  img.alt = image.alt;
  img.decoding = "async";
  img.fetchPriority = "low";

  let done = false;
  img.onload = img.onerror = () => {
    done = true;
  };

  return () => {
    if (done) return;
    img.src = img.srcset = "";
    imgCache.delete(image.srcset);
  };
}
