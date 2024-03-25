import {useEffect, useState} from "react";
import util, {getLocalUser} from "../../utils/axiosUtil";
import {useNavigate} from "react-router-dom";
import {Box, Button, Grid, Typography} from "@mui/material";

const ViewUserDashboard = () => {
    const navigate = useNavigate()
    const [client, setClient] = useState(null)
    const [trainer, setTrainer] = useState(null)

    const fetchClient = async () => {
        const user = getLocalUser()

        if (user.roles.includes('TRAINER')) {
            navigate("/trainer/dashboard")
            return
        }

        try {
            const response = await util.get(`http://localhost:8080/api/client/userid/${user.id}`)
            setClient(response.data)
            await fetchTrainer(response.data.trainerId)
        } catch (error) {
            console.log(error)
            navigate("/")
            alert("You do not have a trainer.")
        }
    }

    const fetchTrainer = async (trainerId) => {
        try {
            const response = await util.get(`http://localhost:8080/api/trainer/${trainerId}`)
            setTrainer(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPayments = async () => {
        // TODO:
    }

    useEffect(() => {
        fetchClient()
    }, []);

    return (
        <Box sx={{padding: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Button variant="contained">
                    Become a Trainer
                </Button>
                <Button variant="contained">
                    Account Settings
                </Button>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Box>
                            {trainer && (
                                <>
                                    <Typography variant="h6">Your Trainer: {trainer.username}</Typography>
                                    <Typography variant="body1">Cost: {trainer.cost}</Typography>
                                    <Typography variant="body1">Location: {trainer.location}</Typography>
                                    <Typography variant="body1">Specialization: {trainer.specialization}</Typography>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h6">Macros</Typography>
                            <Typography variant="body1">Current Weight: {client.weight}</Typography>
                            <Typography variant="body1">Calories: {client.calories}</Typography>

                            <Typography variant="body1">Carbs: 250g</Typography>
                            <Typography variant="body1">Fat: 45g</Typography>
                            <Typography variant="body1">Protein: 125g</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h6">Payments</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewUserDashboard