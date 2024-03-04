import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Typography,
    TextField,
    Button, MenuItem, Checkbox, ListItemText, Select, InputLabel, FormControl, Grid, Card, CardContent,
} from "@mui/material";
import { useForm } from "react-hook-form";

const CreateUser = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [allRoles, setAllRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/roles`);
            setAllRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleRoleChange = (event) => {
        setSelectedRoles(event.target.value);
    };

    const onSubmit = (data) => {
        const userData = {
            ...data,
            roles: selectedRoles
        };

        axios.post("http://localhost:8080/api/user", userData)
            .then((response) => {
                navigate("/admin/view-users");
            })
            .catch((error) => {
            });
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (

        <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Card>
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h5">
                                    Create User
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="danger" onClick={() => navigate(`/admin/view-users`)}>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                {...register("username", { required: true })}
                                label="Username"
                                variant="outlined"
                                error={errors.username ? true : false}
                                helperText={errors.forename ? 'Username is required' : ''}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                {...register("forename", { required: true })}
                                label="Forename"
                                variant="outlined"
                                error={errors.forename ? true : false}
                                helperText={errors.forename ? 'Forename is required' : ''}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                {...register("surname", { required: true })}
                                label="Surname"
                                variant="outlined"
                                error={errors.surname ? true : false}
                                helperText={errors.surname ? 'Surname is required' : ''}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                label="Email"
                                variant="outlined"
                                type="email"
                                error={errors.email ? true : false}
                                helperText={errors.email ? 'Invalid email address' : ''}
                                fullWidth
                                margin="normal"
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-select-label">Roles</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    multiple
                                    value={selectedRoles}
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
                                            <Checkbox checked={selectedRoles.indexOf(role) > -1} />
                                            <ListItemText primary={role} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Create User
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CreateUser;