import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import {Card, CardContent, Typography, Grid, CardMedia, Container, Box, Button} from "@mui/material";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import ViewUser from "../admin/ViewUser";

const ViewTrainer = () => {
    const { username } = useParams();
    const [trainer, setTrainer] = useState(null);
    const navigate = useNavigate()

    const fetchUser = async() => {
        try {
            const trainerData = await axios.get(`http://localhost:8080/api/trainer/username/${username}`)
            setTrainer(trainerData.data);
            alert(trainer.pictureUrl)
        }catch (err) {
            console.log(err.message);
        }
    };

    const handleContactButton = async(e) => {
        e.preventDefault()

        const user = localStorage.getItem('user')

        if (!user){
            navigate("/login")
        }

        //TODO: Run refresh token
        //TODO: Start conversation
    }

    useEffect(() => {
        fetchUser();
    }, [username]);

    if (!trainer) return <Typography color="error">Loading...</Typography>;

    return (
        <Container sx={{ mt: 8, padding: '20px' }}>
            <Grid container justifyContent="center" sx={{ maxWidth: '100%', margin: '0 auto' }}>
                <Grid item xs={12} md={8} lg={6}>
                    <Card>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 2 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Box sx={{
                                    textAlign: 'center',
                                    mr: 5,
                                }}>
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            height: '140px',
                                            width: '140px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                        }}
                                        image={trainer.pictureUrl}
                                        alt={trainer.username}
                                    />
                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                        {trainer.username}
                                    </Typography>
                                </Box>


                                <Box>
                                    <Typography variant="body1">
                                        Cost: £{trainer.cost}
                                    </Typography>

                                    <Typography variant="body1">
                                        Location: {trainer.location}
                                    </Typography>

                                    <Typography variant="body1">
                                        Specialization: {trainer.specialization}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ alignSelf: 'start' }}>
                                <Button variant="contained" color="primary" onClick={(event) => handleContactButton(event)}>
                                    Contact
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ViewTrainer;
