import Navbar from '@/components/navbar/page';
import './globals.css';
import FooterBar from '@/components/footer/page';
import { SessionProvider } from '@/client/SessionProvider';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/redux/provider';
import { Montserrat } from 'next/font/google';
import { createTheme } from '@mui/material';
import Script from 'next/script';

const font = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Script
        src='https://secure.nmi.com/token/Collect.js'
        data-tokenization-key='5mN8N7-jhr55W-N22pxX-uAW2s9'
      />
      <body className={font.className} suppressHydrationWarning={true}>
        <ReduxProvider>
          <SessionProvider>
            <div className='flex flex-col w-full h-screen'>
              <Navbar />
              <div className='flex-1'>{children}</div>
              <FooterBar />
            </div>
          </SessionProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
