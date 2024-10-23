import Image from "next/image";
import { range } from "remeda";

const Page = async ({
  params,
}: {
  params: Promise<{
    random: string;
  }>;
}) => {
  const p = await params;

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-6">
      {range(0, 20).map((i) => (
        <Image
          // loading={i < 10 ? "eager" : "lazy"}
          loading={"eager"}
          // Wait for the image to be ready
          decoding="sync"
          key={i}
          width={1000}
          height={1000}
          className="w-full h-full "
          src={`https://picsum.photos/seed/${p.random + i}/1000/1000`}
          alt="Random image"
        />
      ))}
    </div>
  );
};

export default Page;
