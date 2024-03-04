import React, { useState } from "react";
import { Container, Card, CardContent, Typography, TextField, Button, Box, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [forename, setForename] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                username,
                forename,
                surname,
                email,
                password
            })

            navigate("/login")
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
            <Card sx={{ width: '100%', maxWidth: 600, m: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2" gutterBottom className="text-uppercase text-center">
                        Register
                    </Typography>
                    <Typography variant="body2" component="p" className="text-center mb-4">
                        Already have an account? <Link href="/auth/Login" underline="hover">Login</Link>
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            variant="outlined"
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="forename"
                            label="Forename"
                            name="forename"
                            autoComplete="forename"
                            autoFocus
                            variant="outlined"
                            onChange={e => setForename(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="surname"
                            label="Surname"
                            name="surname"
                            autoComplete="surname"
                            autoFocus
                            variant="outlined"
                            onChange={e => setSurname(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
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
                            Register
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
