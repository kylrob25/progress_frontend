import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem, Checkbox, ListItemText, Button
} from "@mui/material";
import axios from "axios";
import util from "../../utils/axiosUtil";

const EditUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        forename: '',
        surname: '',
        email: '',
        roles: []
    });
    const [initialRoles, setInitialRoles] = useState([]);
    const [allRoles, setAllRoles] = useState([]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
            setUser(response.data);
            setInitialRoles([...response.data.roles]);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/roles`);
            setAllRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchRoles();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRoleChange = (event) => {
        const value = event.target.value;
        setUser(prevState => ({
            ...prevState,
            roles: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault()

        const addedRoles = user.roles.filter(role => !initialRoles.includes(role))
        const removedRoles = initialRoles.filter(role => !user.roles.includes(role))

        try {
            await axios.put(`http://localhost:8080/api/user/${userId}`, user);
        } catch (error){
            console.log(error)
        }

        for (const role of addedRoles) {
            try {
                await util.put(`http://localhost:8080/api/user/${userId}/roles/${role}`)
            } catch (error){
                console.log(error)
            }
        }

        for (const role of removedRoles) {
            try {
                await util.delete(`http://localhost:8080/api/user/${userId}/roles/${role}`)
            } catch (error) {
                console.log(error)
            }
        }

        navigate(`/admin/view-user/${userId}`);
    }

    /*
    const handleSubmit = async (e) => {
        e.preventDefault();

        const hadTrainerRole = initialRoles.includes('TRAINER');
        const nowHasTrainerRole = user.roles.includes('TRAINER');

        if (hadTrainerRole && !nowHasTrainerRole) {
            try {
                await axios.delete(`http://localhost:8080/api/trainer/userId/${userId}`);
                alert('Trainer profile deleted successfully.');
            } catch (error) {
                console.error("Error deleting trainer profile:", error);
                return;
            }
        }

        try {
            await axios.put(`http://localhost:8080/api/user/${userId}`, user);
            navigate(`/admin/view-user/${userId}`);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };
     */

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Card>
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h5">
                                    Edit User
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="error" onClick={() => navigate(`/admin/view-user/${userId}`)}>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                disabled
                            />
                            <TextField
                                label="Forename"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="forename"
                                value={user.forename}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Surname"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="surname"
                                value={user.surname}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-select-label">Roles</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    multiple
                                    value={user.roles}
                                    onChange={handleRoleChange}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 224,
                                                width: 250,
                                            },
                                        },
                                    }}
                                >
                                    {allRoles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            <Checkbox checked={user.roles.indexOf(role) > -1} />
                                            <ListItemText primary={role} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button type="submit" variant="primary">Save Changes</Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default EditUser;
