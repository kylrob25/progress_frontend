import React, {useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import {Button, Card, CardContent, Grid, Typography} from "@mui/material";
import util from "../../utils/axiosUtil";

const ViewUser = () => {
    const {userId} = useParams();
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await util.get(`http://localhost:8080/api/user/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    if (!user) return <Typography color="error">Loading...</Typography>;

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Card>
                    <CardContent>
                        {user.username && (
                            <Typography variant="h5" gutterBottom>
                                {user.username}
                            </Typography>
                        )}
                        {(user.forename || user.surname) && (
                            <Typography variant="body1">
                                Name: {user.forename ? user.forename : ''} {user.surname ? user.surname : ''}
                            </Typography>
                        )}
                        {user.email && (
                            <Typography variant="body1">
                                Email: {user.email}
                            </Typography>
                        )}
                        {user.roles && user.roles.length > 0 && (
                            <Typography variant="body1">
                                Roles: {user.roles.join(', ')}
                            </Typography>
                        )}

                        <Button as={Link} to={`/admin/user/edit/${userId}`} variant="primary">Edit User</Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ViewUser;
