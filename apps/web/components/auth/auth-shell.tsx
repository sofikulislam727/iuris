import type { ReactNode } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logo.png"
            alt=""
            width={24}
            height={24}
            className="size-6 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight">IURIS</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle role="heading" aria-level={1} className="text-xl">
              {title}
            </CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer ? (
            <CardFooter className="justify-center text-sm text-muted-foreground">
              {footer}
            </CardFooter>
          ) : null}
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Authorized personnel only. Activity is logged.
        </p>
      </div>
    </main>
  );
}