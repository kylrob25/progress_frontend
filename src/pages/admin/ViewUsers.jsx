import React, {useEffect, useState} from "react";
import {Link as RouterLink} from 'react-router-dom';
import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import util from "../../utils/axiosUtil";

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await util.get('http://localhost:8080/api/user');
            setUsers(response.data);
        } catch (err) {
            console.log(err.message);
            setError("Failed to fetch users. Please try again later.");
        }
    };

    const deleteUser = (userId) => {
        try {
            util.delete(`http://localhost:8080/api/user/${userId}`)
            alert("Deleted user.")
            fetchUsers()
        } catch (error) {
            console.log("Failed to delete user:", error)
            alert("Failed to delete user.")
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container maxWidth="lg" sx={{marginTop: '20px', marginBottom: '20px'}}>
            <Button
                component={RouterLink}
                to="/admin/user/create"
                variant="contained"
                color="primary"
                sx={{marginBottom: '20px'}}>
                Create
            </Button>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Forename</TableCell>
                            <TableCell>Surname</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.forename}</TableCell>
                                <TableCell>{user.surname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button component={RouterLink} to={`/admin/user/${user.id}`} variant="contained"
                                            color="primary" sx={{marginRight: '8px'}}>View</Button>
                                    <Button variant="contained" color="error"
                                            onClick={() => deleteUser(user.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ViewUsers;
