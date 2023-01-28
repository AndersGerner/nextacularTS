import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Hero = () => {
  const { status: sessionStatus } = useSession()
  const [showMenu, setMenuVisibility] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('landing', { keyPrefix: 'hero' })

  const toggleMenu = () => setMenuVisibility(!showMenu)

  const toggleTheme = (event) => {
    event.preventDefault()
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="w-full py-10">
      <div className="relative flex flex-col px-10 mx-auto space-y-5 md:w-3/4">
        <header className="flex items-center justify-between space-x-3">
          <Link href="/" className="text-2xl font-bold dark:text-white">
            {t('projectName')}
          </Link>
          <button className="md:hidden" onClick={toggleMenu}>
            {!showMenu ? (
              <Bars3Icon className="w-8 h-8" />
            ) : (
              <XCircleIcon className="w-8 h-8" />
            )}
          </button>
          <div
            className={[
              'items-center justify-center md:flex-row md:flex md:relative md:bg-transparent md:shadow-none md:top-0 md:backdrop-blur-none md:space-x-3',
              showMenu
                ? 'absolute z-50 flex flex-col py-5 space-x-0 rounded shadow-xl md:py-0 left-8 right-8 bg-white top-24 space-y-3 md:space-y-0 px-5'
                : 'hidden',
            ].join(' ')}
          >
            <nav className="flex flex-col w-full space-x-0 space-y-3 text-center md:space-y-0 md:space-x-3 md:flex-row">
              <Link
                href=""
                className="px-5 py-2 rounded cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800 dark:text-white"
              >
                Guides
              </Link>
              <Link
                href=""
                className="px-5 py-2 rounded cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800 dark:text-white"
              >
                Pricing
              </Link>
              <Link
                href=""
                className="px-5 py-2 rounded cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800 dark:text-white"
              >
                Blog
              </Link>
            </nav>

            <Link
              href={
                sessionStatus === 'authenticated' ? '/account' : '/auth/login'
              }
              className="w-full px-6 py-2 text-center text-white bg-blue-600 rounded shadow hover:bg-blue-700"
            >
              {sessionStatus === 'authenticated' ? 'Go to Dashboard' : 'Login'}
            </Link>
            <button
              className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-gray-100 hover:dark:bg-gray-800 dark:text-white group"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center pt-10 mx-auto md:w-3/5">
          <h1 className="text-6xl font-extrabold text-center">
            <span className="block dark:text-white">Build SaaS platforms</span>
            <span className="block text-blue-600">like never before</span>
          </h1>
          <p className="mt-5 text-center text-gray-600 dark:text-gray-200">
            Quickly build landing pages that will help you get results fast
          </p>
        </div>
        <div className="flex items-center justify-center space-x-5">
          <Link
            href="/auth/login"
            className="px-10 py-3 text-center text-white bg-blue-600 rounded shadow hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/auth/login"
            className="px-10 py-3 text-center text-blue-600 rounded shadow hover:bg-blue-50"
          >
            Live Demo
          </Link>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['header'])),
  },
})

export default Hero
