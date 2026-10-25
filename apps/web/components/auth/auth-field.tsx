"use client";

import { forwardRef, useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<"input">, "ref"> & {
  label: string;
  error?: string;
  description?: string;
};

export const AuthField = forwardRef<HTMLInputElement, Props>(function AuthField(
  { label, error, description, type = "text", className, ...props },
  ref,
) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const descId = `${id}-desc`;
  const errId = `${id}-err`;
  const describedBy =
    [description ? descId : null, error ? errId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type={isPassword && visible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(isPassword && "pr-10", className)}
          {...props}
        />
        {isPassword ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 size-9"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        ) : null}
      </div>
      {description ? (
        <p id={descId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
});