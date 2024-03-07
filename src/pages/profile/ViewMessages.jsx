import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CardMedia,
    Container,
    Box,
    Button,
    ListItem,
    List,
    Divider, ListItemText
} from "@mui/material";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const ViewMessages = () => {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate()

    const fetchConversations = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const response = await axios.get(`http://localhost:8080/api/conversation/user/${user.id}`);
                const conversationsWithLastMessage = await Promise.all(response.data.map(async (conversation) => {
                    const lastMessageId = conversation.messageIds[conversation.messageIds.length - 1];
                    if (lastMessageId) {
                        const res = await axios.get(`http://localhost:8080/api/message/${lastMessageId}`);
                        const message = res.data;
                        return {
                            ...conversation,
                            lastMessage: message.message,
                            lastTimestamp: message.timestamp
                        };
                    }
                    return conversation
                }));
                setConversations(conversationsWithLastMessage);
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err.message);
        }
    };

    const handleStartConversation = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const response = await axios.post('http://localhost:8080/api/conversation', {
                    participantIds: [user.id],
                    messageIds: [],
                    lastMessageId: -1
                });
                const conversation = response.data
                await axios.put(`http://localhost:8080/api/user/${user.id}/conversation`, conversation.id, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                fetchConversations();
            }
        } catch (err) {
            console.error("Failed to create conversation:", err.message);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    if (!conversations) return <Typography color="error">Loading conversations...</Typography>;

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Conversations
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleStartConversation()} style={{ marginBottom: '20px' }}>
                Start Conversation
            </Button>
            <List>
                {conversations.map((conversation, index) => (
                    <React.Fragment key={conversation.id || index}>
                        <ListItemText
                            primary={`Conversation ${index + 1}`}
                            secondary={
                                conversation.lastMessageId === -1 ?
                                    "No messages in this conversation." :
                                    `Last message at ${new Date(conversation.lastTimestamp).toLocaleString()}: "${conversation.lastMessage}"`
                            }
                        />
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
}

export default ViewMessages;
