import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import axiosIntercept from "../utils/axiosIntercept";
import {useNavigate} from "react-router-dom";

const NavbarComponent = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate()

    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState(null)
    const [admin, setAdmin] = useState(false)

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            const response= axios.post("http://localhost:8080/api/auth/logout")

            navigate("/")
            localStorage.removeItem('user')
        } catch (error) {
            alert(error)
        }
    }

    const checkUser = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                setLoggedIn(true)
                setUsername(user.username)

                if (/**user.roles.includes('ADMIN')**/true) {
                    setAdmin(true)
                }
            }
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        setOpen(false);
        checkUser()
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

                {
                    admin ? (
                        <>
                            <ListItem button component={Link} to="/admin/view-users">
                                <ListItemText primary="Users" />
                            </ListItem>
                        </>
                    ) : (
                        <>
                        </>
                    )
                }
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
                        <Button color="inherit" component={Link} to="/messages">Messages</Button>
                        <Button color="inherit" onClick={(event) => handleLogout(event)}>Logout</Button>
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
