"use client"

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Button } from "~/components/ui/button";

export default function LoginButton() {
  const [isPending, startTransition] = useTransition();

  async function handleSignIn() {
    startTransition(async () => {
      await signIn("strava")
    })
  }

  return (
    <Button onClick={handleSignIn} disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-1.5" /> : null}
      Login
    </Button>
  )
}
