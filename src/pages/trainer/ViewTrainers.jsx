import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    CardMedia,
    TextField,
    Container,
} from "@mui/material";
import { Link } from 'react-router-dom';
import axios from "axios";

const ViewTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    const fetchTrainers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/trainer');
            setTrainers(response.data);
            setFilteredTrainers(response.data);
        } catch (err) {
            console.log(err.message);
            setError("Failed to fetch trainers. Please try again later.");
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    useEffect(() => {
        const results = trainers.filter(trainer =>
            trainer.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTrainers(results);
    }, [searchTerm, trainers]);

    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <TextField
                label="Search"
                fullWidth
                margin="dense"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            <Grid container spacing={3}>
                {filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={trainer.id}>
                            <Card style={{ width: '100%', height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={trainer.pictureUrl}
                                    alt={trainer.username}
                                />
                                <CardContent>
                                    <Typography variant="h6">{trainer.username}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button component={Link} to={`/trainer/${trainer.username}`} variant="contained" color="primary">
                                        View
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No trainers found.</Typography>
                )}
            </Grid>
        </Container>
    );
};

export default ViewTrainers;
