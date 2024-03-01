import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const NavbarComponent = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)

    const handleToggle = () => {
        setOpen(!open);
    };

    const getCurrentUser = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user && user.token) {
                const response = await axios.get('http://localhost:8080/api/user/token', {
                    headers: {
                        'Authorization': 'Bearer ' + user.token
                    }
                });

                setLoggedIn(true)
                setUsername(response.data.username)
            }
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        setOpen(false);
        getCurrentUser()
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

                {loggedIn ? (
                    <>
                        <Button color="inherit" component={Link} to="/profile">{username}</Button>
                        <Button color="inherit" component={Link} to="/logout">Logout</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </>
                )}
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
