import { Link } from "@/app/components/link";

export const RandomPageLink = ({ className }: { className?: string }) => {
  const slug = randomSlug();
  return (
    <Link href={`/random/${slug}`} className={className}>
      Page {slug}
    </Link>
  );
};

const randomSlug = () => {
  return Math.random().toString(36).substring(2, 15);
};
