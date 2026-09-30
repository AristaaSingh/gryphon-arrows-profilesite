import DecryptTechHeading from "@/components/DecryptTechHeading";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative flex w-full flex-col items-center text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
          Gryphon Arrows &middot; IMechE UAS Challenge
        </span>

        <DecryptTechHeading
          text="GRYPHON ARROWS"
          className="h-40 w-full sm:h-56 md:h-72"
        />

        <p className="mt-4 max-w-md font-body text-sm text-zinc-400">
          Taking off soon, hang on!!
        </p>
      </div>
    </main>
  );
}
