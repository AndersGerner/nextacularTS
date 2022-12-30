import { signIn, useSession } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import isEmail from 'validator/lib/isEmail'
import Meta from '../../components/Meta/Meta'
import ErrorToast from '../../components/Toasts/ErrorToast'
import SuccessToast from '../../components/Toasts/SuccessToast'
import AuthLayout from '../../layouts/AuthLayout'

const SignIn: React.FC = () => {
  const { status } = useSession()
  const [email, setEmail] = useState('')
  const [isSubmitting, setSubmittingState] = useState(false)
  const validate = isEmail(email)

  const handleEmailChange = (event) => setEmail(event.target.value)

  const signInWithEmail = async (event) => {
    event.preventDefault()
    setSubmittingState(true)
    const response = await signIn('email', { email, redirect: false })

    if (response.error === null) {
      toast.custom(
        () => (
          <SuccessToast
            text={`Please check your email (${email}) for the login link.`}
          />
        ),
        {
          position: 'top-right',
        }
      )
      setEmail('')
    } else {
      setSubmittingState(false)
      console.log('ERROR ', response.error)
      toast.custom(() => <ErrorToast text={response.error} />, {
        position: 'top-right',
      })
    }

    setSubmittingState(false)
  }

  const signInWithSocial = (socialId) => {
    signIn(socialId)
  }

  return (
    <AuthLayout>
      <Meta
        title="NextJS SaaS Boilerplate | Login"
        description="A boilerplate for your NextJS SaaS projects."
      />
      <div className="min-h-full md:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image
              className="rounded-full"
              height={50}
              width={50}
              src={require('../../../public/images/default-logo.jpeg')}
              alt="Workflow"
            />
          </div>

          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              start your 14-day free trial
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-neutral-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    placeholder="user@email.com"
                    onChange={handleEmailChange}
                    className="w-full px-3 py-2 h-9 border rounded text-sm focus:outline-none focus:border-gray-800 dark:bg-black dark:border-gray-700 dark:focus:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading' || !validate || isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={signInWithEmail}
                >
                  {status === 'loading'
                    ? 'Checking session...'
                    : isSubmitting
                    ? 'Sending link...'
                    : 'Send Magic Link'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    className="w-full inline-flex justify-center py-2 px-4 border dark:border-gray-800 rounded-md shadow-sm bg-white hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-sm font-medium text-gray-500 "
                    disabled={status === 'loading'}
                    onClick={() => signInWithSocial('google')}
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <FaGoogle size={18} />
                  </button>
                </div>

                <div>
                  <button
                    className="w-full inline-flex justify-center py-2 px-4 border dark:border-gray-800 rounded-md shadow-sm bg-white hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-sm font-medium text-gray-500 "
                    disabled={status === 'loading'}
                    onClick={() => signInWithSocial('github')}
                  >
                    <span className="sr-only">Sign in with Github</span>
                    <FaGithub size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignIn
