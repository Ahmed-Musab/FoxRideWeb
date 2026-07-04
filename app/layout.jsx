import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/tokenUtils';
import { SidebarProvider } from '@/app/context/SidebarContext';
import Providers from '@/app/components/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "FoxRide",
  description: "A car pooling web application",
  icons: {
    icon: '/favIcon1.png',  
  },  
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let initialUser = null;
  let initialRole = null;

  if (token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      initialUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      initialRole = decoded.role;
    }
  }

  return (
    <html lang="en" className={` h-screen antialiased`}>
      <body className="h-screen flex flex-col">
        <AuthProvider initialUser={initialUser} initialRole={initialRole}>
          <SidebarProvider>
            <Providers>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
            </Providers>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

