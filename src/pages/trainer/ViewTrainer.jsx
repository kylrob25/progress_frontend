import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Card, CardMedia, Container, Grid, Typography} from "@mui/material";
import util, {getLocalUser} from "../../utils/axiosUtil";
import axios from "axios";

const ViewTrainer = () => {
    const {username} = useParams();
    const [trainer, setTrainer] = useState(null);
    const navigate = useNavigate()

    const fetchUser = async () => {
        try {
            const trainerData = await util.get(`http://localhost:8080/api/trainer/username/${username}`)
            setTrainer(trainerData.data);
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error.message);
        }
    }

    const handleContactButton = async () => {
        const user = getLocalUser()
        if (!user) {
            navigate("/login")
            return
        }

        if (user.id === trainer.userId) {
            alert("Cannot start conversation with yourself.")
            return
        }

        try {
            const response = await axios.post('http://localhost:8080/api/conversation', {
                creatorId: user.id,
                participantIds: [user.id, trainer.userId],
                participantNames: [user.username, trainer.username],
                messageIds: [],
                lastMessageId: -1
            });

            if (response) {
                navigate("/messages")
            }
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const handleRequestButton = async () => {
        const user = getLocalUser()

        if (user.id === trainer.userId) {
            alert("You can't train yourself..")
            return
        }

        try {
            await util.put(`http://localhost:8080/api/trainer/${trainer.id}/requests/${user.id}`)
            alert("Sent training request.")
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser();
    }, [username]);

    if (!trainer) return <Typography color="error">Loading...</Typography>;

    return (
        <Container sx={{mt: 8, padding: '20px'}}>
            <Grid container justifyContent="center" sx={{maxWidth: '100%', margin: '0 auto'}}>
                <Grid item xs={12} md={8} lg={6}>
                    <Card>
                        <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 2}}>
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
                                    <Typography variant="h6" sx={{mt: 1}}>
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

                            <Box sx={{alignSelf: 'start'}}>
                                <Button variant="contained" color="primary" onClick={handleContactButton}>
                                    Contact
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleRequestButton}>
                                    Request
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
