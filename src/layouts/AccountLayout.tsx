import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Content from '../components/Content/Content';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import menu from '../config/menu';
import { useWorkspace } from '../providers/workspace';

const AccountLayout = ({ children }) => {
  const { data } = useSession();
  const router = useRouter();
  const { workspace } = useWorkspace();

  useEffect(() => {
    if (!data) {
      router.replace('/auth/login');
    }
  }, [data, router]);

  return (
    <main className="relative flex flex-col w-screen h-screen space-x-0 text-gray-800 dark:text-gray-200 md:space-x-5 md:flex-row bg-gray-50 dark:bg-gray-800">
      <Sidebar menu={menu(workspace?.slug)} />
      <Content>
        <Toaster position="bottom-left" toastOptions={{ duration: 10000 }} />
        <Header />
        {children}
      </Content>
    </main>
  );
};

export default AccountLayout;
