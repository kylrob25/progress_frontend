import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container, FormControl,
    Grid, InputLabel, MenuItem, Select,
    TextField,
    Typography,
} from "@mui/material";
import {Link} from 'react-router-dom';
import axios from "axios";
import defaultProfilePicture from '../../assets/images/default_profile_picture.png'

const ViewTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [filterLocation, setFilterLocation] = useState("");
    const [filterSpecialization, setFilterSpecialization] = useState("");
    const [filterCost, setFilterCost] = useState("");

    const fetchTrainers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/trainer');
            setTrainers(response.data);
            setFilteredTrainers(response.data);
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    useEffect(() => {
        const results = trainers.filter(trainer =>
            trainer.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterLocation ? trainer.location === filterLocation : true) &&
            (filterSpecialization ? trainer.specialization === filterSpecialization : true) &&
            (filterCost ? trainer.cost <= filterCost : true)
        );
        setFilteredTrainers(results);
    }, [searchTerm, filterLocation, filterSpecialization, filterCost, trainers]);

    return (
        <Container maxWidth="lg" style={{marginTop: '20px', marginBottom: '20px'}}>
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Search"
                        fullWidth
                        margin="dense"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Location</InputLabel>
                        <Select
                            value={filterLocation}
                            label="Location"
                            onChange={(e) => setFilterLocation(e.target.value)}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="Unknown">Unknown</MenuItem>
                            <MenuItem value="Glasgow">Glasgow</MenuItem>
                            <MenuItem value="Edinburgh">Edinburgh</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Specialization</InputLabel>
                        <Select
                            value={filterSpecialization}
                            label="Specialization"
                            onChange={(e) => setFilterSpecialization(e.target.value)}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="Unknown">Unknown</MenuItem>
                            <MenuItem value="Fat Loss">Fat Loss</MenuItem>
                            <MenuItem value="Strength Training">Strength Training</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Cost Range</InputLabel>
                        <Select
                            value={filterCost}
                            label="Cost Range"
                            onChange={(e) => setFilterCost(e.target.value)}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value={50}>£0 to £50</MenuItem>
                            <MenuItem value={150}>£51 to £150</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                {filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={trainer.id}>
                            <Card style={{width: '100%', height: '100%'}}>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={trainer.pictureUrl || defaultProfilePicture}
                                    alt={trainer.username}
                                />
                                <CardContent>
                                    <Typography variant="h6">{trainer.username}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button component={Link} to={`/trainer/${trainer.username}`} variant="contained"
                                            color="primary">
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
