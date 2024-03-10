import {Box, Button, Grid, List, ListItem, ListItemText, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getLocalUser} from "../../utils/axiosUtil";

const ViewDashboard = () => {
    const [isTrainer, setIsTrainer] = useState(false)
    const [username, setUsername] = useState('')
    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)

    const fetchUser = async () => {
        try {
            const user = getLocalUser()
            setUsername(user.username)
        } catch (error){
            console.log(error)
        }
    }

    const fetchClients = async () => {

    }

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

            <Typography variant="h6" component="h2">
                Welcome back {username}!
            </Typography>

            {isTrainer ? (
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Clients</Typography>
                            <List component="nav">
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
                        </Grid>
                        <Grid item xs={8}>
                            {selectedClient && (
                                <Box>
                                    <Typography variant="h6">{selectedClient.name}'s Information</Typography>
                                    {/* Display selected client information here */}
                                    <Typography variant="body1">Details...</Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box>
                    <Typography variant="body1">
                        You don't have a trainer yet :( Click the trainers tab to find one!
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default ViewDashboard