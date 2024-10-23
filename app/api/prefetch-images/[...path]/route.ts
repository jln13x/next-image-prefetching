import { parseHTML } from "linkedom";
import { NextRequest, NextResponse } from "next/server";
import { map, filter, pipe, isDefined } from "remeda";

export const dynamic = "force-static";

function getHostname() {
  return "localhost:3000";
}

const schema = "http";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const host = getHostname();

  const p = await params;

  const path = p.path.join("/");

  const url = `${schema}://${host}/${path}`;

  const response = await fetch(url);
  if (!response.ok) {
    return new Response("Failed to fetch", { status: response.status });
  }

  const body = await response.text();
  const { document } = parseHTML(body);

  const images = pipe(
    Array.from(document.querySelectorAll("main img")),
    map((img) => ({
      srcset: img.getAttribute("srcset") || img.getAttribute("srcSet"),
      sizes: img.getAttribute("sizes"),
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
    })),
    filter((img) => isDefined(img.src))
  );

  return NextResponse.json(
    { images },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
