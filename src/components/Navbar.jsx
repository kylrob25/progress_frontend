import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from "react-router-dom";

const NavbarComponent = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const handleToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setOpen(false);
    }, [location]);

    const drawerList = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setOpen(false)}
        >
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/admin/view-users">
                    <ListItemText primary="Users" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleToggle}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Progress
                </Typography>

                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
            </Toolbar>
            <Drawer
                anchor={'left'}
                open={open}
                onClose={() => setOpen(false)}
            >
                {drawerList()}
            </Drawer>
        </AppBar>
    );
};

export default NavbarComponent;
