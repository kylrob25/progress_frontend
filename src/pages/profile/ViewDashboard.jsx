import {Box, Button, Grid, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import util, {getLocalUser} from "../../utils/axiosUtil";
import {useNavigate} from "react-router-dom";

const ViewDashboard = () => {
    const navigate = useNavigate()
    const [trainer, setTrainer] = useState(null)
    const [username, setUsername] = useState('')
    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)

    const [showTrainerForm, setShowTrainerForm] = useState(false);
    const [trainerCost, setTrainerCost] = useState('');
    const [trainerLocation, setTrainerLocation] = useState('');
    const [trainerSpecialization, setTrainerSpecialization] = useState('');

    const [editingTrainer, setEditingTrainer] = useState(false);

    const [inviteUsername, setInviteUsername] = useState('');

    const toggleEditForm = () => {
        setEditingTrainer(!editingTrainer);
    };

    const toggleTrainerForm = () => {
        setShowTrainerForm(!showTrainerForm)
    }

    const handleInvite = async () => {
        // todo
    };

    const fetchUser = async () => {
        try {
            const user = getLocalUser()
            setUsername(user.username)

            if (user.roles.includes("TRAINER")){
                fetchTrainer()
            }
        } catch (error){
            console.log(error)
        }
    }

    const fetchTrainer = async () =>{
        const user = getLocalUser()
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/userId/${user.id}`)
            setTrainer(response.data)

            setTrainerCost(response.data.cost);
            setTrainerLocation(response.data.location);
            setTrainerSpecialization(response.data.specialization);
        } catch (error){
            console.log(error)
        }
    }

    const fetchClients = async () => {
        try {
            const response = await util.get('http://localhost:8080/api/trainer/{trainerId}/clients')
            setClients(response.data)
        } catch (error){
            console.log(error)
        }
    }

    const updateTrainerDetails = async () => {
        const updatedDetails = {
            cost: trainerCost,
            location: trainerLocation,
            specialization: trainerSpecialization,
        };
        try {
            await util.put(`http://localhost:8080/api/trainer/${trainer.id}`, updatedDetails);
            setEditingTrainer(false);
            fetchTrainer()
        } catch (error) {
            console.error("Error updating trainer details:", error);
            alert('Failed to update trainer details.');
        }
    };


    const submitTrainerForm = async () => {
        const trainerData = {
            userId: getLocalUser().id,
            cost: trainerCost,
            location: trainerLocation,
            specialization: trainerSpecialization,
        };

        try {
            await util.post('http://localhost:8080/api/trainer', trainerData);
            setShowTrainerForm(false);
            fetchTrainer()
        } catch (error) {
            console.error("Error submitting trainer form:", error);
        }
    };


    useEffect(() => {
        fetchUser()
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Button variant="contained">
                    Account Settings
                </Button>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    {trainer && !editingTrainer && (
                        <Box>
                            <Typography variant="h6">Current Details</Typography>
                            <Typography variant="body1">Cost: {trainerCost}</Typography>
                            <Typography variant="body1">Location: {trainerLocation}</Typography>
                            <Typography variant="body1">Specialization: {trainerSpecialization}</Typography>
                            <Button variant="contained" onClick={toggleEditForm} sx={{ mt: 2 }}>
                                Edit Your Details
                            </Button>
                        </Box>
                    )}

                    {editingTrainer && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Cost"
                                    variant="outlined"
                                    fullWidth
                                    value={trainerCost}
                                    onChange={(e) => setTrainerCost(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Location"
                                    variant="outlined"
                                    fullWidth
                                    value={trainerLocation}
                                    onChange={(e) => setTrainerLocation(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Specialization"
                                    variant="outlined"
                                    fullWidth
                                    value={trainerSpecialization}
                                    onChange={(e) => setTrainerSpecialization(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={updateTrainerDetails}>
                                    Update Details
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Grid>

                <Grid item xs={12} sm={8}>
                    {trainer && (
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h6">Clients</Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <TextField
                                            label="Invite Client"
                                            variant="outlined"
                                            size="small"
                                            value={inviteUsername}
                                            onChange={(e) => setInviteUsername(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" onClick={handleInvite} size="small">
                                            Invite Client
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {trainer && clients.length > 0 ? (
                        <List component="nav" sx={{ mt: 2 }}>
                            {clients.map((client, index) => (
                                <ListItem
                                    button
                                    key={client.id}
                                    selected={selectedClient?.id === client.id}
                                    onClick={() => setSelectedClient(client)}
                                >
                                    <ListItemText primary={client.name} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>You currently have no clients.</Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewDashboard