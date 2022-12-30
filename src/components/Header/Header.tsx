import { Menu, Transition } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

const Header = () => {
  const { data } = useSession()
  const { theme, setTheme } = useTheme()

  const logOut = () => {
    const result = confirm('Are you sure you want to logout?')

    if (result) {
      signOut({ callbackUrl: '/' })
    }
  }

  const toggleTheme = (event) => {
    event.preventDefault()
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getUserImage = () => {
    if (data && data.user.image) {
      return data.user.image
    } else {
      return require('../../../public/images/user-image.webp')
    }
  }

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <h5 className="font-bold text-gray-800 dark:text-gray-200">
          {data && data.user && (
            <span>{data.user.name || data.user.email}</span>
          )}
        </h5>
      </div>
      <Menu as="div" className="ml-4 relative flex-shrink-0">
        <div>
          <Menu.Button className="bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
            <span className="sr-only">Open user menu</span>
            <Image
              className="rounded-full"
              width={35}
              height={35}
              alt=""
              src={getUserImage()}
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white dark:bg-neutral-900 divide-y divide-gray-100 dark:divide-gray-700 rounded shadow-xl">
            <div className="p-2">
              <Menu.Item>
                <Link
                  href="/account/settings"
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 dark:hover:text-white group"
                >
                  <span>Account</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href="/account/billing"
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 dark:hover:text-white group"
                >
                  <span>Billing</span>
                </Link>
              </Menu.Item>
            </div>
            <div className="p-2">
              <Menu.Item>
                <Link
                  href="/"
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 dark:hover:text-white group"
                >
                  <span>Landing Page</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <button
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 dark:hover:text-white group"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <>
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </Menu.Item>
            </div>
            <div className="p-2">
              <Menu.Item>
                <button
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 dark:hover:text-white group"
                  onClick={logOut}
                >
                  <span>Logout</span>
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default Header
