"use client";
import { useRouter } from 'next/navigation';
import Logo from '@components/Logo'
import { ArrowLeftOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { signOut, useSession } from 'next-auth/react'
import { ModeToggle } from './ui/toggle-mode';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar"

export const Nav = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Auth-based routing lives in proxy.ts (server-side), not here. Keeping
  // it out of this client component is what prevents the focus-refetch flicker.
  const handleSignout = () => {
    signOut().then(() => {
      router.push('/');
    })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ModeToggle />
          {session?.user && (
            <Menubar className="border-none bg-transparent p-0 shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="group cursor-pointer rounded-full border border-border bg-card/60 px-2 py-1 pr-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <UserCircleIcon className="h-5 w-5" />
                  </span>
                  <span className="ml-2 hidden max-w-[160px] truncate sm:inline">{session?.user?.name}</span>
                </MenubarTrigger>
                <MenubarContent align="end" className="z-[99999999]">
                  <MenubarItem onClick={handleSignout} className="cursor-pointer">
                    <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" /> Sign out
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav
