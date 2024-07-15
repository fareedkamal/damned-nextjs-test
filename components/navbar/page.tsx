'use client';
import { ChevronDown, Menu, Search, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileNavMenu from './mobile-nav-menu';
import { Box, Collapse, Grow, Paper, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { usePathname } from 'next/navigation';
import SearchBar from './search-bar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { text } from '@/app/styles';
import ShopDropdown from './shop-dropdown';
import Cart from '../cart';

interface NavbarProps {
  style?: Boolean;
}

const Page: React.FC<NavbarProps> = (props) => {
  const [hover, setHover] = useState<boolean>();
  const [openMenu, setOpenMenu] = useState<any>(false);
  const [openSearch, setOpenSearch] = useState<any>(false);
  const isLargeScreen = useMediaQuery('(min-width:640px)');
  const path = usePathname();
  const [navStyle, setNavStyle] = useState<Boolean>(
    path === '/' ? true : false
  );

  useEffect(() => {
    if (isLargeScreen) {
      setOpenMenu(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    setNavStyle(path === '/' ? true : false);
  }, [path]);

  return (
    <div
      className={`flex w-full transition-all duration-300 relative
         ${
           navStyle
             ? 'hover:bg-white hover:text-slate-700 text-white'
             : 'text-slate-700 bg-white border-b border-stone-300'
         }
         `}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <div className='m-auto w-full 2xl:w-[1440px] items-center px-[30px] py-4 flex justify-between'>
        <Link href='/'>
          {navStyle ? (
            hover ? (
              <Image
                src='https://admin.damneddesigns.com/wp-content/uploads/Asset-14.png'
                width={100}
                height={100}
                alt='this is mark'
                className='w-8'
              />
            ) : (
              <Image
                src='https://admin.damneddesigns.com/wp-content/uploads/Asset-12.png'
                width={100}
                height={100}
                alt='this is mark'
                className='w-8'
              />
            )
          ) : (
            <Image
              src='https://admin.damneddesigns.com/wp-content/uploads/Asset-14.png'
              width={100}
              height={100}
              alt='this is mark'
              className='w-8'
            />
          )}
        </Link>
        <div className='flex items-center gap-[20px]'>
          <ShopDropdown />

          <div className='hidden sm:flex items-center gap-[40px]'>
            <Link
              href='/help'
              className='flex items-center hover:text-slate-400'
            >
              HELP
            </Link>
          </div>

          <Menu
            onClick={() => setOpenMenu((prev: any) => !prev)}
            className='block sm:hidden  cursor-pointer h-5 w-5'
          />

          <div className='absolute  top-[40px] w-[90vw] m-auto z-[999] left-0 right-0'>
            <Collapse unmountOnExit in={openMenu}>
              {/* <div className='w-[200px] h-[200px] bg-orange-600'>sscdscsd </div> */}
              <div>
                <MobileNavMenu />
              </div>
            </Collapse>
          </div>

          <SearchBar />
        </div>

        <div className='flex gap-6 items-end'>
          <Cart />
          <Link href='/my-account'>
            <UserCircle className='cursor-pointer h-5 w-5' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
