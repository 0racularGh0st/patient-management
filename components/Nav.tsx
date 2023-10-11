"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import Logo from '@assets/images/patientmgmt.png'
import GoogleIcon from '../assets/icons/google.svg'
import {  ArrowLeftOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { ModeToggle } from './ui/toggle-mode';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar"
export const Nav = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const Spinner = () => {
    return (<div
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-slate-400"
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span
      >
    </div>)
  };


  useEffect(() => {
    console.log('status ->', status,)
    console.log('session ->', session)
    if (status === 'authenticated' && session?.user) {
      if(window.location.pathname === '/') {
        router.push('/dashboard');
      }
      return;
    }

    if (status === 'unauthenticated' && !session) {
      if(window.location.pathname !== '/') {
        router.push('/')
      }
    }
  }, [status, session, router])
  const handleSignout = () => {
    signOut().then(() => {
      router.push('/');
    })
  }
  return (
    <nav className='flex justify-between items-center gap-4 w-full py-4 px-3 sm:px-8  sticky top-0 z-[999999] bg-[hsl(var(--background))]'>
    <Image
      src={Logo}
      alt="Logo"
      height={40}
      width={110}
      style={{ minHeight: '40px', minWidth: '110px'}}
      className='px-3 py-1 bg-white rounded-full'
    />
    <div className='flex justify-end items-center gap-4'>
      <ModeToggle />
    {!session?.user ?
       (<>
       </>)
        : 
        (<Menubar>
          <MenubarMenu>
            <MenubarTrigger>{session?.user?.name} <UserCircleIcon className='ml-2 h-5 w-5' /></MenubarTrigger>
            <MenubarContent className='z-[99999999]'>
              <MenubarItem onClick={handleSignout}>
                <ArrowLeftOnRectangleIcon className='mr-2 h-5 w-5' /> Sign out
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>)
      }
    </div>
    </nav>
  )
}

export default Nav