import { RandomPageLink } from "@/app/components/random-page-link";
import { range } from "remeda";

export default function Home() {
  return (
    <div className="">
      <div className="grid gap-6">
        {range(0, 20).map((i) => (
          <RandomPageLink
            key={i}
            className="h-[320px] w-full bg-emerald-800 flex items-center justify-center font-bold text-xl"
          />
        ))}
      </div>
    </div>
  );
}
