import Image from "next/image";
import DecryptTechHeading from "@/components/DecryptTechHeading";
import SiteNav from "@/components/SiteNav";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-zinc-100">
      <Image
        src="/gryphon-landing-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-[25%_100%]"
      />
      {/* The image doesn't cover every aspect ratio cleanly (e.g. very
          tall/narrow viewports) — fade the top and right edges to black so
          any exposed edge blends in rather than showing a hard cutoff. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #000 0%, transparent 22%), linear-gradient(to left, #000 0%, transparent 22%)",
        }}
      />

      <SiteNav />

      <div className="relative z-10 flex min-h-screen items-center justify-end px-6 sm:px-12 md:px-20">
        <div className="flex max-w-xl flex-col items-end gap-3 text-right">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
            IMechE UAS Challenge
          </span>

          <div className="flex flex-col items-end">
            <DecryptTechHeading
              text="Gryphon"
              className="h-14 w-72 sm:h-20 sm:w-96 md:h-28 md:w-[34rem]"
            />
            <DecryptTechHeading
              text="Arrows"
              reverse
              className="-mt-4 h-14 w-72 sm:-mt-6 sm:h-20 sm:w-96 md:-mt-8 md:h-28 md:w-[34rem]"
            />
          </div>

          <p className="mt-2 max-w-sm font-body text-sm text-zinc-300">
            Taking off soon, hang on!!
          </p>
        </div>
      </div>
    </main>
  );
}
