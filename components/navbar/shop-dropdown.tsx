import { text } from '@/app/styles';
import { Box, Popover } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ShopDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverHovered, setPopoverHovered] = useState(false);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    if (!popoverHovered) {
      setAnchorEl(null);
    }
  };

  const handlePopoverMouseEnter = () => {
    setPopoverHovered(true);
  };

  const handlePopoverMouseLeave = () => {
    setPopoverHovered(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <Box
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        className='flex items-center  hover:text-slate-400 gap-1 cursor-pointer'
      >
        SHOP
        <ChevronDown className='h-3 w-3' />
      </Box>

      <Popover
        disableScrollLock
        id='mouse-over-popover'
        sx={{
          '.MuiPopover-paper': {
            position: 'fixed',
            width: 'calc(100% - 30px)',
            maxWidth: '1440px',
            m: 'auto !important',
            left: '0px !important',
            right: '0px !important',
            top: '40px !important',
            borderRadius: 0,
            boxShadow: 'none',
            bgcolor: '#918484',
          },
        }}
        slotProps={{
          paper: {
            onMouseEnter: handlePopoverMouseEnter,
            onMouseLeave: handlePopoverMouseLeave,
          },
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
      >
        <div className='p-6 bg-[#918484] flex justify-center gap-4 w-full flex-wrap'>
          <Link
            href='/shop/osiris-chef-knives'
            className={`${text.md} text-white font-medium hover:opacity-50`}
          >
            OSIRIS CHEF KNIFE
          </Link>
          <Link
            href='/shop/pocket-knives'
            className={`${text.md} text-white font-medium hover:opacity-50`}
          >
            POCKET KNIVES
          </Link>
          <Link
            href='/shop/fixed-blade-knives'
            className={`${text.md} text-white font-medium hover:opacity-50`}
          >
            FIXED BLADE KNIVES
          </Link>
          <Link
            href='/shop/edc'
            className={`${text.md} text-white font-medium hover:opacity-50`}
          >
            POCKET ART
          </Link>

          <Link
            href='/shop/sidekick-pry-bars'
            className={`${text.md} text-white font-medium hover:opacity-50`}
          >
            SIDEKICK PRY BARS
          </Link>
        </div>
      </Popover>
    </div>
  );
};

export default ShopDropdown;
