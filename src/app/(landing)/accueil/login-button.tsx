
"use client";

import LoginDialog from "@/components/auth/login-dialog";
import { Button, ButtonProps } from "@/components/ui/button";

export function LoginButton(props: ButtonProps) {
  return (
    <LoginDialog>
        <Button {...props} />
    </LoginDialog>
  )
}
