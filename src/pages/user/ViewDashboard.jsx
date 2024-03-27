import {useEffect, useState} from "react";
import util, {getLocalUser, addRoleToLocalUser} from "../../utils/axiosUtil";
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

    const handleBecomeTrainer = async () => {
        const user = getLocalUser()
        try {
            await util.post('http://localhost:8080/api/trainer', {
                userId: user.id,
                username: user.username,
                cost: 0.0,
                location: "Unknown",
                specialization: "Unknown"
            })

            addRoleToLocalUser('TRAINER')
            navigate("/trainer/dashboard")
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
        fetchClient()
    }, []);

    return (
        <Box sx={{padding: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Box>
                    <Button variant="contained" onClick={() => handleBecomeTrainer()} sx={{ marginRight: 1 }}>
                        Become a Trainer
                    </Button>
                    <Button variant="contained">
                        Account Settings
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Box>
                            {trainer ? (
                                <>
                                    <Typography variant="h6">Your Trainer: {trainer.username}</Typography>
                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Cost:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'green' }}>
                                            {' '}{trainer.cost}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Location:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'green' }}>
                                            {' '}{trainer.location}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Specialization:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'green' }}>
                                            {' '}{trainer.specialization}
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">Trainer</Typography>
                                    <Typography variant="body1">You do not have a trainer :( </Typography>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            {client && (
                                <>
                                    <Typography variant="h6">Information</Typography>
                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Weight:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'green' }}>
                                            {' '}{client.weight}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Calories:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'orange' }}>
                                            {' '}{client.calories}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Carbs:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'blue' }}>
                                            {' '}250g
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Fat:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'blue' }}>
                                            {' '}45g
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                            Protein:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ color: 'blue' }}>
                                            {' '}125g
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            {client && (
                                <>
                                    <Typography variant="h6">Payments</Typography>
                                    <Typography variant="body1">No payments have been made.</Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewUserDashboard