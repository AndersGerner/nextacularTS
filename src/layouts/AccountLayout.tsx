import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Content from '../components/Content/Content'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import menu from '../config/menu'
import { useWorkspace } from '../providers/workspace'

const AccountLayout = ({ children }) => {
  const { status } = useSession()
  const router = useRouter()
  const { workspace } = useWorkspace()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login')
    }
  }, [router, status])
  if (status === 'loading') return <></>
  return (
    <main className="relative flex flex-col w-screen h-screen space-x-0 text-gray-800 dark:text-gray-200 md:space-x-5 md:flex-row bg-white dark:bg-black">
      <Sidebar menu={menu(workspace?.slug)} />
      <Content>
        <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
        <Header />
        {children}
      </Content>
    </main>
  )
}

export default AccountLayout
