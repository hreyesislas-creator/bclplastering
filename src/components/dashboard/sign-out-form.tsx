"use client";

import * as React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

interface SignOutFormProps {
  className?: string;
  variant?: "default" | "icon" | "compact";
}

export function SignOutForm({ className, variant = "default" }: SignOutFormProps) {
  const [pending, startTransition] = React.useTransition();

  function handleClick() {
    startTransition(async () => {
      await signOut();
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label="Sign out"
        className={cn(
          "grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors",
          className
        )}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOut className="h-3.5 w-3.5" />
        )}
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors disabled:opacity-60",
        className
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Sign out
    </button>
  );
}
