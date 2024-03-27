import React from 'react'
import {
    Box,
    Button,
    CardMedia,
    Collapse,
    Grid,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import util, {getLocalUser} from "../../utils/axiosUtil";
import {useNavigate} from "react-router-dom";
import defaultProfilePicture from '../../assets/images/default_profile_picture.png'

const ViewDashboard = () => {
    const navigate = useNavigate()
    const [trainer, setTrainer] = useState(null)

    const [clients, setClients] = useState([])

    const [selectedClient, setSelectedClient] = useState(null)
    const [clientCalories, setClientCalories] = useState('')
    const [clientWeight, setClientWeight] = useState('')

    const [trainerCost, setTrainerCost] = useState('')
    const [trainerLocation, setTrainerLocation] = useState('')
    const [trainerSpecialization, setTrainerSpecialization] = useState('')
    const [trainerPicture, setTrainerPicture] = useState('')

    const [editingTrainer, setEditingTrainer] = useState(false)

    const [requests, setRequests] = useState([])

    const toggleEditForm = () => {
        setEditingTrainer(!editingTrainer);
    }

    const updateTrainerDetails = async () => {
        const updatedDetails = {
            pictureUrl: trainerPicture,
            cost: trainerCost,
            location: trainerLocation,
            specialization: trainerSpecialization,
        };
        try {
            await util.put(`http://localhost:8080/api/trainer/${trainer.id}`, updatedDetails);
            setEditingTrainer(false);
            await fetchTrainer()
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.error("Error updating trainer details:", error);
        }
    }

    const fetchUser = async () => {
        try {
            const user = getLocalUser()

            if (user.roles.includes("TRAINER")) {
                await fetchTrainer()
                return
            }

            navigate("/profile/dashboard")
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const fetchTrainer = async () => {
        const user = getLocalUser()
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/userId/${user.id}`)
            setTrainer(response.data)

            setTrainerCost(response.data.cost || 0.0);
            setTrainerLocation(response.data.location || "Unknown");
            setTrainerSpecialization(response.data.specialization || "Unknown");
            setTrainerPicture(response.data.pictureUrl || "")

            await fetchRequests(response.data.id)
            await fetchClients(response.data.id)
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const fetchClients = async (trainerId) => {
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/${trainerId}/clients`)
            setClients(response.data)
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const fetchRequests = async (trainerId) => {
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/${trainerId}/requests`)
            setRequests(response.data)
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const acceptRequest = async (trainerId, requestId) => {
        try {
            await util.post(`http://localhost:8080/api/trainer/${trainerId}/requests/${requestId}`)
            await fetchRequests(trainerId)
            await fetchClients(trainerId)
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const denyRequest = async (trainerId, requestId) => {
        try {
            await util.delete(`http://localhost:8080/api/trainer/${trainerId}/requests/${requestId}`)
            await fetchRequests(trainerId)
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const handleManageClient = async (trainerId, clientId) => {
        const selected = clients.find(client => client.id === clientId)
        if (selectedClient && selectedClient.id === clientId) {
            setSelectedClient(null)
        } else {
            setSelectedClient(selected);
            setClientCalories(selected.calories)
            setClientWeight(selected.weight)
        }
    }

    const updateClientDetails = async (trainerId, clientId) => {
        const updatedDetails = {
            weight: clientWeight,
            calories: clientCalories
        }
        try {
            await util.put(`http://localhost:8080/api/client/${clientId}/update`, updatedDetails)
            setSelectedClient(null)
            await fetchClients(trainerId)
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error);
        }
    }

    useEffect(() => {
         fetchUser()
    }, [])

    return (
        <Box sx={{padding: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Button variant="contained">
                    Account Settings
                </Button>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    {!editingTrainer && (
                        <Box>
                            <Typography variant="h6">Current Details</Typography>
                            <Typography variant="body1">Picture:</Typography>
                            <CardMedia
                                component="img"
                                sx={{
                                    height: '140px',
                                    width: '140px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                                image={trainerPicture || defaultProfilePicture}
                            />
                            <Typography variant="body1">Cost: {trainerCost}</Typography>
                            <Typography variant="body1">Location: {trainerLocation}</Typography>
                            <Typography variant="body1">Specialization: {trainerSpecialization}</Typography>
                            <Button variant="contained" onClick={toggleEditForm} sx={{mt: 2}}>
                                Edit Your Details
                            </Button>
                        </Box>
                    )}

                    {editingTrainer && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Picture"
                                    variant="outlined"
                                    fullWidth
                                    value={trainerPicture}
                                    onChange={(e) => setTrainerPicture(e.target.value)}
                                />
                            </Grid>
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

                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h6">Clients</Typography>
                        </Grid>
                    </Grid>

                    {clients.length > 0 ? (
                        <List sx={{mt: 2}}>
                            {clients.map((client) => (
                                <React.Fragment key={client.id}>
                                    <ListItem
                                        secondaryAction={
                                            <Button
                                                variant="contained"
                                                onClick={() => handleManageClient(trainer.id, client.id)}
                                            >
                                                Manage
                                            </Button>
                                        }
                                    >
                                        <ListItemText primary={client.username} />
                                    </ListItem>
                                    <Collapse in={selectedClient && selectedClient.id === client.id}>
                                        <Box sx={{ margin: 1, paddingLeft: 4, paddingRight: 4, border: "1px solid #ccc", borderRadius: "4px" }}>
                                            <Typography variant="h6" sx={{mb: 2}}>Edit Client Details</Typography>
                                            <TextField
                                                label="Weight"
                                                variant="outlined"
                                                fullWidth
                                                value={clientWeight}
                                                onChange={(e) => setClientWeight(e.target.value)}
                                                sx={{ mb: 2 }}
                                            />
                                            <TextField
                                                label="Calories"
                                                variant="outlined"
                                                fullWidth
                                                value={clientCalories}
                                                onChange={(e) => setClientCalories(e.target.value)}
                                                sx={{ mb: 2 }}
                                            />
                                            <Button variant="contained" color="primary" onClick={() => updateClientDetails(trainer.id, client.id)}>
                                                Save Changes
                                            </Button>
                                        </Box>
                                    </Collapse>
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{mt: 2}}>You currently have no clients.</Typography>
                    )}
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Requests</Typography>
                    {requests.length > 0 ? (
                        <List sx={{mt: 2}}>
                            {requests.map((request) => (
                                <ListItem
                                    key={request.userId}
                                    secondaryAction={
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{mr: 1}}
                                                onClick={() => acceptRequest(trainer.id, request.userId)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => denyRequest(trainer.id, request.userId)}
                                            >
                                                Deny
                                            </Button>
                                        </Box>
                                    }
                                >
                                    <ListItemText primary={request.username}/>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{mt: 2}}>No requests at the moment.</Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewDashboard