"use client";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react';
import GoogleIcon from '@assets/icons/google.svg'

import Image from 'next/image'


export const GoogleSignIn = () => {
    const { data: session, status } = useSession();
    const [providers, setProviders] = useState<any>(null);

    useEffect(() => {
        const updateProviders = async () => {
          const response = await getProviders();
    
          setProviders(response);
        }
        updateProviders();
      }, [])
    const Spinner = useCallback(() => (<div
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-slate-400"
        role="status">
        <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >
            Loading...
        </span>
        </div>), [])

      return (<>
        {!session?.user ?
       (<>
        { status !== 'loading' && providers && Object.values(providers).map((provider: any) => (
          <button
          type="button"
          className='glass_effect px-5 rounded-full h-8 hover:backdrop-blur-lg hover:bg-white font-normal text-base flex justify-center items-center gap-3 transition-colors w-fit'
          key={provider.name}
          onClick={() => signIn(provider.id)}
         >
            <span  className='text-slate-800 text_on_glass font-semibold'>
              Sign in with
            </span>
            <Image
              src={GoogleIcon}
              alt='google'
            />
          </button>
        ))}
        { status === 'loading' && <Spinner />}
       </>)
       : <> </> }
      </>)
}

export default GoogleSignIn;