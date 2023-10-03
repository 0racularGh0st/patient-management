"use client";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react';
import GoogleIcon from '@assets/icons/google.svg'
import { Button } from '@components/ui/button';
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
          <Button
          type="button"
          key={provider.name}
          onClick={() => signIn(provider.id)}
          variant='outline'
         >
            <span  className='mr-2'>
              Sign in with
            </span>
            <Image
              src={GoogleIcon}
              alt='google'
            />
          </Button>
        ))}
        { status === 'loading' && <Spinner />}
       </>)
       : <> </> }
      </>)
}

export default GoogleSignIn;