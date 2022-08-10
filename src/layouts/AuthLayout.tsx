import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const { data } = useSession();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');

    if (data) {
      router.push('/account');
    }
  }, [data, router, setTheme]);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen p-10 space-y-10">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      {children}
    </main>
  );
};

export default AuthLayout;
