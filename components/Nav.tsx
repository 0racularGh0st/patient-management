"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState, useEffect, Fragment } from 'react'
import Logo from '@assets/images/patientmgmt.png'
import GoogleIcon from '../assets/icons/google.svg'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ArrowLeftOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
export const Nav = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<any>(null);
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
    const updateProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    }
    updateProviders();
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push('/dashboard')
    }
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, session, router])

  return (
    <nav className='flex justify-between items-center gap-4 w-full py-4 px-3 sm:px-8 backdrop-blur sticky top-0'>
      <Link
        href='/dashboard'
        className='flex justify-center items-center gap-4'
      >
        <Image
          src={Logo}
          alt="Logo"
          height={40}
          width={110}
          style={{ minHeight: '40px', minWidth: '110px', boxShadow: '1px 3px 7px 0px #183c37'}}
          className='px-3 py-1 bg-white rounded-full'
        />
      </Link>
      {!session?.user ?
       (<>
        { status !== 'loading' && providers && Object.values(providers).map((provider: any) => (
          <button
          type="button"
          className='glass_effect px-5 rounded-full h-8 hover:backdrop-blur-lg hover:bg-white font-normal text-base flex justify-center items-center gap-3 transition-colors'
          key={provider.name}
          onClick={() => signIn(provider.id)}
         >
            <span  className='text-slate-800 text_on_glass'>
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
        : 
        (<Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="glass_effect rounded-full hover:bg-slate-100 transition-colors py-1 px-4">
            <div
              className='flex justify-center items-center gap-2'
            >
                <p className="text_main">{session?.user?.name}</p>
                <UserCircleIcon className='text_primary' width={30} height={30} />
                <ChevronDownIcon width={20} height={20} className=""/>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg_primary text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => signOut()}
                  >
                    <ArrowLeftOnRectangleIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    Sign out
                  </button>
                )}
              </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>)
      }
    </nav>
  )
}

export default Nav