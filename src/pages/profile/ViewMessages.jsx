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
    Divider, ListItemText, TextField, Select, MenuItem
} from "@mui/material";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const ViewMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newParticipantUsername, setNewParticipantUsername] = useState('')
    const [displayedMessageLimit, setDisplayedMessageLimit] = useState(5);
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
                            lastMessage: message.text,
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

    useEffect(() => {
        fetchConversations()
    },[])

    const handleStartConversation = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const response = await axios.post('http://localhost:8080/api/conversation', {
                    creatorId: user.id,
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

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setDisplayedMessageLimit(5)
        try {
            const res = await axios.get(`http://localhost:8080/api/conversation/${conversation.id}/messages`);
            const sortedMessages = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMessages(sortedMessages);
        } catch (err) {
            console.error("Failed to fetch messages:", err.message);
        }
    };

    const handleLoadMoreMessages = () => {
        setDisplayedMessageLimit(prevLimit => prevLimit + 5);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            const res = await axios.post(`http://localhost:8080/api/message`, {
                conversationId: selectedConversation.id,
                senderId: user.id,
                text: newMessage,
            });
            const sentMessage = res.data;

            setMessages([...messages, sentMessage]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message:", err.message);
        }
    }

    const handleLeaveConversation = async () => {

    }

    const handleAddParticipant = async () => {
    }

    if (!conversations) return <Typography color="error">Loading conversations...</Typography>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Conversations
            </Typography>
            <Button variant="contained" color="primary" onClick={handleStartConversation} style={{ marginBottom: "20px" }}>
                Start Conversation
            </Button>
            <Grid container spacing={2}>
                {/** Conversation Selection **/}
                <Grid item xs={12} md={3}>
                    <List>
                        {conversations.map((conversation, index) => (
                            <React.Fragment key={index}>
                                <ListItem button onClick={() => handleSelectConversation(conversation)}>
                                    <ListItemText primary={conversation.title} />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </Grid>
                {/** Selected Conversation Selection **/}
                <Grid item xs={12} md={5}>
                    {selectedConversation && (
                        <>
                            <Typography variant="h6">{`Conversation Details`}</Typography>
                            <List>
                                {messages.slice(0, displayedMessageLimit).map((message, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={message.text}
                                            secondary={new Date(message.timestamp).toLocaleString() + " | " + message.senderId}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            {messages.length > displayedMessageLimit && (
                                <Button onClick={handleLoadMoreMessages}>Load More</Button>
                            )}
                            <Box mt={2} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    margin="normal"
                                />
                                <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ margin: "10px", marginLeft: "10px" }}>
                                    Send
                                </Button>
                            </Box>
                        </>
                    )}
                </Grid>
                {/** Participants of selected conversation **/}
                {selectedConversation && (
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6">Participants</Typography>
                        <Box mt={2} display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Add user..."
                                value={newParticipantUsername}
                                onChange={(e) => setNewParticipantUsername(e.target.value)}
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={() => handleAddParticipant(newParticipantUsername)} style={{ marginLeft: "10px" }}>
                                Add
                            </Button>
                        </Box>
                        <List dense>
                            {selectedConversation.participantIds.map((participant, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`User ${participant}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default ViewMessages;
