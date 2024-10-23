export type PrefetchedImage = {
  srcset: string;
  sizes: string;
  src: string;
  alt: string;
  loading: string;
};

export const prefetchImages = async (href: string) => {
  const url = new URL(href, window.location.href);
  const imageResponse = await fetch(`/api/prefetch-images${url.pathname}`, {
    priority: "low",
  });

  if (!imageResponse.ok && process.env.NODE_ENV === "development") {
    throw new Error("Failed to prefetch images");
  }

  const { images } = await imageResponse.json();
  return images as PrefetchedImage[];
};
