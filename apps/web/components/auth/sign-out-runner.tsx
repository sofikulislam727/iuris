"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutRunner() {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  const run = useCallback(async () => {
    setFailed(false);
    const { error } = await authClient.signOut();
    if (error) {
      setFailed(true);
      toast.error("Could not sign you out. Please try again.");
      return;
    }
    toast.success("You have been signed out.");
    router.replace("/sign-in");
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run();
  }, [run]);

  if (failed) {
    return (
      <Button onClick={() => void run()} className="w-full">
        Try again
      </Button>
    );
  }

  return (
    <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      Signing you out…
    </p>
  );
}