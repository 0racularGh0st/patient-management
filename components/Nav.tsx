"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Logo from '@assets/images/patientmgmt.png'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
export const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<any>(null);
  useEffect(() => {
    const updateProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    }
    updateProviders();
  }, [])
  return (
    <nav className='flex justify-between gap-4 w-full py-4 px-4 bg-white backdrop-blur'>
      <Link
        href='/'
        className='flex justify-center items-center gap-4'
      >
        <Image
          src={Logo}
          alt="Logo"
          height={42}
          width={120}
        />
      </Link>
      {!session?.user ?
       (<>
        { providers && Object.values(providers).map((provider: any) => (
          <button
          type="button"
          className='bg_primary px-5 py-1 rounded-full text-cyan-50 hover:opacity-90 font-medium'
          key={provider.name}
          onClick={() => signIn(provider.id)}
         >
            Sign in
          </button>
        ))}
       </>)
        : 
        (<button
          type="button"
          className='bg_primary px-5 py-1 rounded-full text-cyan-50 hover:opacity-90 font-medium'
         >
            {session.user.name}
          </button>)
      }
    </nav>
  )
}

export default Nav