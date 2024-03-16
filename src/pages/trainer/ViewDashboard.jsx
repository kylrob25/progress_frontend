import {Box, Button, Grid, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import util, {getLocalUser} from "../../utils/axiosUtil";
import {useNavigate} from "react-router-dom";

const ViewDashboard = () => {
    const navigate = useNavigate()
    const [trainer, setTrainer] = useState(null)

    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)

    const [trainerCost, setTrainerCost] = useState('')
    const [trainerLocation, setTrainerLocation] = useState('')
    const [trainerSpecialization, setTrainerSpecialization] = useState('')

    const [editingTrainer, setEditingTrainer] = useState(false)

    const [requests, setRequests] = useState([])

    const toggleEditForm = () => {
        setEditingTrainer(!editingTrainer);
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
    }

    const fetchUser = async () => {
        try {
            const user = getLocalUser()

            if (user.roles.includes("TRAINER")){
                fetchTrainer()
                return
            }

            navigate("/profile/dashboard")
        } catch (error){
            console.log(error)
        }
    }

    const fetchTrainer = async () =>{
        const user = getLocalUser()
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/userId/${user.id}`)
            if(response) {
                setTrainer(response.data)

                setTrainerCost(response.data.cost);
                setTrainerLocation(response.data.location);
                setTrainerSpecialization(response.data.specialization);

                fetchRequests(response.data.id)
                fetchClients(response.data.id)
            }
        } catch (error){
            console.log(error)
        }
    }

    const fetchClients = async (trainerId) => {
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/${trainerId}/clients`)
            setClients(response.data)
        } catch (error){
            console.log(error)
        }
    }

    const fetchRequests = async (trainerId) => {
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/${trainerId}/requests`)
            setRequests(response.data)
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    const acceptRequest = async (trainerId, requestId) => {
        try {
            await util.post(`http://localhost:8080/api/trainer/${trainerId}/requests/${requestId}`)
            fetchRequests(trainerId)
        } catch (error) {
            console.log(error)
        }
    }

    const denyRequest = async (trainerId, requestId) => {
        try {
            await util.delete(`http://localhost:8080/api/trainer/${trainerId}/requests/${requestId}`)
            fetchRequests(trainerId)
        } catch (error) {
            console.log(error)
        }
    }

    const handleManageClient = async (trainerId, clientId) => {

    }

    useEffect(() => {
        fetchUser()
    }, [])

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
                    {!editingTrainer && (
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

                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h6">Clients</Typography>
                        </Grid>
                    </Grid>

                    {clients.length > 0 ? (
                        <List sx={{ mt: 2 }}>
                            {clients.map((client, index) => (
                                <ListItem
                                    key={client.userId}
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
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>You currently have no clients.</Typography>
                    )}
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Requests</Typography>
                    {requests.length > 0 ? (
                        <List sx={{ mt: 2 }}>
                            {requests.map((request) => (
                                <ListItem
                                    key={request.userId}
                                    secondaryAction={
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ mr: 1 }}
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
                                    <ListItemText primary={request.username} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>No requests at the moment.</Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewDashboard