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
        className="object-cover object-[25%_center]"
      />

      <SiteNav />

      <div className="relative z-10 flex min-h-screen items-center justify-end px-6 sm:px-12 md:px-20">
        <div className="flex max-w-xl flex-col items-end gap-3 text-right">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
            IMechE UAS Challenge
          </span>

          <div className="flex flex-col items-end gap-1">
            <DecryptTechHeading
              text="Gryphon"
              className="h-16 w-64 sm:h-24 sm:w-80 md:h-32 md:w-[28rem]"
            />
            <DecryptTechHeading
              text="Arrows"
              className="h-16 w-64 sm:h-24 sm:w-80 md:h-32 md:w-[28rem]"
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
