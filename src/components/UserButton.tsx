"use client";

import useAuth from "@/hooks/auth";
import { Button } from "./ui/button";
import { members } from "@wix/members";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {
  Check,
  LogInIcon,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface UserButtonProps {
  loggedInMember: members.Member | null;
  className?: string;
}

export default function UserButton({
  loggedInMember,
  className
}: UserButtonProps) {
  const {
    login,
    logout
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={className}
          size="icon"
          variant="ghost"
        >
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 min-w-44">
        {
          loggedInMember && (
            <>
              <DropdownMenuLabel>
                Current user:{" "}
                {loggedInMember.contact?.firstName || loggedInMember.loginEmail}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                  <UserIcon className="mr-2 size-4" />
                  User Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </>
          )
        }
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                System default
                {
                  theme === "system" && <Check className="ms-2 size-4" />
                }
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                Light
                {
                  theme === "light" && <Check className="ms-2 size-4" />
                }
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                Dark
                {
                  theme === "mode" && <Check className="ms-2 size-4" />
                }
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {
          loggedInMember ? (
            <DropdownMenuItem onClick={() => logout()}>
              <LogOutIcon className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => login()}>
              <LogInIcon className="mr-2 size-4" />
              Login
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

