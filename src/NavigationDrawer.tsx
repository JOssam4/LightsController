import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Container,
  Box,
  Drawer,
  Divider, ListItemButton, ListItemIcon, ListItemText
} from "@mui/material";
import { Close, Home, Timer, Menu } from '@mui/icons-material/'
import { Link } from 'react-router-dom';
import './NavigationDrawer.css';

interface State {
  open: boolean;
}

export default function NavigationDrawer() {
  const [state, setState] = useState<State>({
    open: false,
  });

  function toggleDrawer(openDrawer: boolean) {
    if (state.open) {
      setState({...state, open: false});
    } else {
      setState({...state, open: true});
    }
  }

  return (
    <Box className="nav-root">
      <span className="menu-wrapper">
        <IconButton edge="start" aria-label="open navigation drawer" onClick={() => toggleDrawer(true)}>
          <Menu fontSize="large"/>
        </IconButton>
      </span>

      <Drawer anchor="left"
              open={state.open}
              onClose={() => toggleDrawer(false)}
              PaperProps={{
                sx: {width: 0.8}
              }}>
        <Box>
          <IconButton onClick={() => toggleDrawer(false)}>
            <Close />
          </IconButton>

          <Divider />

          <Box>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton component={Link} to="/timer">
              <ListItemIcon>
                <Timer />
              </ListItemIcon>
              <ListItemText primary="Timer" />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );

}