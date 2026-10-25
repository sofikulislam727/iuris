import Link from "next/link";
import { Camera as CameraIcon, VideoOff } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Camera, CameraStatus } from "@/lib/vision/types";

export function FeedPlaceholder({ status }: { status: CameraStatus }) {
  const offline = status === "offline";
  return (
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted/40"
      style={{
        backgroundImage:
          "linear-gradient(to right, oklch(1 0 0 / 4%) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 4%) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {offline ? (
        <VideoOff className="size-8 text-muted-foreground" aria-hidden="true" />
      ) : (
        <CameraIcon className="size-8 text-primary/60" aria-hidden="true" />
      )}
      <span className="absolute bottom-2 left-3 text-xs text-muted-foreground">
        {offline ? "No signal" : "Live feed placeholder"}
      </span>
    </div>
  );
}

export function CameraTile({ camera }: { camera: Camera }) {
  return (
    <Link
      href={`/cameras/${camera.id}`}
      className="group block overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <FeedPlaceholder status={camera.status} />
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{camera.name}</p>
          <p className="truncate text-xs text-muted-foreground">{camera.zone}</p>
        </div>
        <StatusBadge value={camera.status} />
      </div>
    </Link>
  );
}