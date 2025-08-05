import { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import { SidebarProps } from '@/types/Utils';
import {useTheme, useMediaQuery} from '@mui/material';

import { useRouter } from 'next/navigation';

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const router = useRouter()
  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };


  const handleLogOut = () => {
    localStorage.removeItem("username");
    router.push('/login')
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md ~ 960px

  return (
    <div>
      {/* Menu button */}
      {!open && (
        <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          position: 'fixed',
          top: 1,
          left: 1,
          zIndex: 1300,
          backgroundColor: '#009688',
          boxShadow: 1,
          p: '2px', // 👈 padding nhỏ lại
          minWidth: 'unset', // tránh giữ size to
          transition: 'background-color 0.2s ease', // mượt hơn
            '&:hover': {
                backgroundColor: '#00796b', // màu đậm hơn khi hover
            },  
          }}
      >
        <MenuIcon sx={{ fontSize: 18 }}/>
      </IconButton>
      )}

      {/* Drawer sidebar */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        variant={'temporary'} 
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#F7E7CE',
            },
          },
        }}
      >
        {/* Nút đóng */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <List >
          <ListItemButton onClick={() => {router.push('/temporal')}} sx={{ gap: 0.5, minHeight: 40 }}>
            <ListItemIcon  sx={{ minWidth: 30 }}> <ChatIcon /> </ListItemIcon>
            <ListItemText primary="Temporal search" slotProps={{
              primary: {
                sx: {
                  fontFamily: ' monospace',
                  fontWeight: 600,
                },
              },
            }}/>
          </ListItemButton>
 
          <ListItemButton onClick={() => router.push('/simple')} sx={{ gap: 0.5, minHeight: 40 }}>
            <ListItemIcon  sx={{ minWidth: 30 }}> <SearchIcon/> </ListItemIcon>
            <ListItemText primary="Simple search" slotProps={{
              primary: {
                sx: {
                  fontFamily: ' monospace',
                  fontWeight: 600,
                },
              },
            }}/>
          </ListItemButton>

          <ListItemButton onClick={() => router.push('/submit')} sx={{ gap: 0.5, minHeight: 40 }}>
            <ListItemIcon  sx={{ minWidth: 30 }}> <SearchIcon/> </ListItemIcon>
            <ListItemText primary="Submit" slotProps={{
              primary: {
                sx: {
                  fontFamily: ' monospace',
                  fontWeight: 600,
                },
              },
            }}/>
          </ListItemButton>

          <ListItemButton onClick={() => router.push('/check')} sx={{ gap: 0.5, minHeight: 40 }}>
            <ListItemIcon  sx={{ minWidth: 30 }}> <SearchIcon/> </ListItemIcon>
            <ListItemText primary="Check" slotProps={{
              primary: {
                sx: {
                  fontFamily: ' monospace',
                  fontWeight: 600,
                },
              },
            }}/>
          </ListItemButton>
                  
          <ListItemButton onClick={handleLogOut} sx={{ gap: 0.5, minHeight: 40 }}>
            <ListItemIcon sx={{ minWidth: 30 }}> <LogoutIcon/> </ListItemIcon>
            <ListItemText primary="Đăng xuất" slotProps={{
              primary: {
                sx: {
                  fontFamily: 'monospace',
                  fontWeight: 600,
                },
              },
            }}/>
          </ListItemButton>
        </List>
      </Drawer>
      
    </div>
  );
}
