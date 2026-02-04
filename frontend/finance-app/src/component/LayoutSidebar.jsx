import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

let drawerWidth = 240;

function LayoutSidebar({ sidebar, main }) {
  return (
    <Box sx={{ display: 'flex' }}>
      
      <Toolbar disableGutters />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          zIndex: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {sidebar}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar disableGutters />
        {main}
      </Box>

    </Box>
  );
}


export default LayoutSidebar;