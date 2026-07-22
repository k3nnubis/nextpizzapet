"use client";
import { Button, Dialog, DialogContent } from "@/shared/components/ui";
import { signIn } from "next-auth/react";
import { SignIn, SignUp } from "./forms";
import { useState } from "react";
import { SwitcherText } from "./switcher-text";
import { boolean } from "zod";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ onClose, open }: AuthModalProps) {
  const [type, setType] = useState<"login" | "register">("login");
  const onSwitchType = () => {
    setType(type === "login" ? "register" : "login");
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[450px] bg-white p-10">
        {type === "login" ? (
          <SwitcherText isLogin={true} onClick={onSwitchType}>
            <SignIn onClose={handleClose} />
          </SwitcherText>
        ) : (
          <SwitcherText isLogin={false} onClick={onSwitchType}>
            <SignUp onClose={handleClose} />
          </SwitcherText>
        )}

        <hr />
        <div className="flex gap-2">
          <Button
            variant={"secondary"}
            onClick={() =>
              signIn("github", {
                callbackUrl: "/",
                redirect: true,
              })
            }
            type="button"
            className="h-12 flex-1 gap-2 p-2"
          >
            <img
              src="https://github.githubassets.com/favicons/favicon.svg"
              alt="github-icon"
              className="h-6 w-6"
              loading="eager"
            />
            GitHub
          </Button>

          <Button
            disabled={true}
            
            variant={"secondary"}
            onClick={() =>
              signIn("google", {
                callbackUrl: "/",
                redirect: true,
              })
            }
            type="button"
            className="h-12 flex-1 gap-2 p-2"
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="github-icon"
              className="h-6 w-6"
              loading="eager"
            />
            Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
