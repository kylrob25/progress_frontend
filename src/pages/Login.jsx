import React, { useState } from "react";
import { Container, Card, CardContent, Typography, TextField, Button, Box, Link } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from '../features/userSlice';
import axios from "axios";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            })

            if (response.ok) {
                // TODO:
                /*
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data))
                }
                 */
            }
        } catch (err) {

        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
            <Card sx={{ width: '100%', maxWidth: 600, m: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2" gutterBottom className="text-uppercase text-center">
                        Login
                    </Typography>
                    <Typography variant="body2" component="p" className="text-center mb-4">
                        Don't have an account? <Link href="/register" underline="hover">Register</Link>
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}>
                            Login
                        </Button>
                    </Box>
                    <Typography variant="body2">
                        This site is protected by reCAPTCHA and the Google <Link href="https://policies.google.com/privacy" underline="hover">Privacy Policy</Link> and <Link href="https://policies.google.com/terms" underline="hover">Terms of Service</Link> apply.
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;
