"use client";
import { signIn, useSession } from 'next-auth/react'
import { useCallback } from 'react';
import GoogleIcon from '@assets/icons/google.svg'
import { Button } from '@components/ui/button';
import Image from 'next/image'

export const GoogleSignIn = () => {
    const { data: session, status } = useSession();

    const Spinner = useCallback(() => (<div
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-muted-foreground"
        role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
        </span>
        </div>), [])

      if (session?.user) return null;

      return (
        status === 'loading' ? (
          <Spinner />
        ) : (
          <Button
            type="button"
            onClick={() => signIn('google')}
            size="lg"
            variant="outline"
            className="elevate gap-3 bg-card text-base"
          >
            <Image src={GoogleIcon} alt="" width={18} height={18} />
            Continue with Google
          </Button>
        )
      )
}

export default GoogleSignIn;
