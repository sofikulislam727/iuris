import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <Image
        src="/logo.png"
        alt="IURIS Logo"
        width={120}
        height={120}
        priority
      />

      <h1 className="text-4xl font-bold tracking-tight">IURIS</h1>

      <p className="max-w-md text-muted-foreground">
        Islamic University Real-Time Intelligence for Surveillance
      </p>

      <p className="text-sm text-muted-foreground">
        AI-assisted campus security and intelligent video surveillance.
      </p>

      <span className="rounded-full border px-4 py-2 text-sm">
        Under Active Development
      </span>
    </main>
  );
}