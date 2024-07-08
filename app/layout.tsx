// import type { Metadata } from "next";
import Navbar from '@/components/navbar/page';
import './globals.css';
import FooterBar from '@/components/footer/page';
import { GoodProvider } from '@/components/context/GoodContext';
import { SessionProvider } from '@/client/SessionProvider';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/redux/provider';
import Cart from '@/components/cart';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <SessionProvider>
            <Navbar />

            {children}
            <FooterBar />
          </SessionProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
