import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import util, {getLocalUser} from "../../utils/axiosUtil";

const ViewMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newParticipantUsername, setNewParticipantUsername] = useState('')
    const [displayedMessageLimit, setDisplayedMessageLimit] = useState(5);
    const navigate = useNavigate()

    const fetchConversations = async () => {
        const user = getLocalUser();

        if (!user) {
            navigate("/login")
            return
        }

        // TODO: Handle via a single request
        try {
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
                    }
                }
                return conversation
            }))
            setConversations(conversationsWithLastMessage)
            if (conversationsWithLastMessage.length > 0) {
                await handleSelectConversation(conversationsWithLastMessage[conversationsWithLastMessage.length - 1])
            }
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.error("Failed to fetch conversations:", error.message);
        }
    };

    useEffect(() => {
        fetchConversations()
    }, [])

    const handleStartConversation = async () => {
        const user = getLocalUser()

        if (!user) {
            navigate("/login")
            return
        }

        try {
            await axios.post('http://localhost:8080/api/conversation', {
                creatorId: user.id,
                participantIds: [user.id],
                participantNames: [user.username],
                messageIds: [],
                lastMessageId: -1
            });

            await fetchConversations();
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.error("Failed to create conversation:", error.message);
        }
    };

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setDisplayedMessageLimit(5)
        try {
            const res = await axios.get(`http://localhost:8080/api/conversation/${conversation.id}/messages`);
            const sortedMessages = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMessages(sortedMessages);
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.error("Failed to fetch messages:", error.message);
        }
    };

    const handleLoadMoreMessages = () => {
        setDisplayedMessageLimit(prevLimit => prevLimit + 5);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return

        const user = getLocalUser()

        if (!user) {
            navigate("/login")
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/message`, {
                conversationId: selectedConversation.id,
                senderId: user.id,
                sender: user.username,
                text: newMessage,
            });
            const sentMessage = response.data;

            setMessages([...messages, sentMessage]);
            setNewMessage('');
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.error("Failed to send message:", error.message);
        }
    }

    const handleDeleteMessage = async (messageId) => {
        const user = getLocalUser()

        if (!user) {
            navigate("/login")
            return
        }

        try {
            await util.delete(`http://localhost:8080/api/message/${messageId}`);

            setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.error("Failed to delete message:", error.message);
        }
    };

    const handleLeaveConversation = async (conversationId) => {
        const user = getLocalUser()

        if (!user) {
            navigate("/login")
            return
        }

        try {
            await util.delete(`http://localhost:8080/api/conversation/${conversationId}/leave/${user.id}`)
            await fetchConversations()
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    const handleAddParticipant = async (username) => {
        if (!selectedConversation || !username.trim()) {
            return
        }

        const conversationId = selectedConversation.id

        try {
            await util.put(`http://localhost:8080/api/conversation/${conversationId}/add/${username}`)
            setNewParticipantUsername('')
            await fetchConversations()
        } catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message) {
                alert(error.response.data.message);
            }
            console.log(error)
        }
    }

    if (!conversations) return <Typography color="error">Loading conversations...</Typography>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Conversations
            </Typography>
            <Button variant="contained" color="primary" onClick={handleStartConversation}
                    style={{marginBottom: "20px"}}>
                Start Conversation
            </Button>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <List>
                        {conversations.map((conversation, index) => (
                            <React.Fragment key={index}>
                                <ListItem button onClick={() => handleSelectConversation(conversation)}>
                                    <ListItemText primary={conversation.title}/>
                                    <ListItemSecondaryAction>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLeaveConversation(conversation.id);
                                            }}
                                        >
                                            Leave
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider component="li"/>
                            </React.Fragment>
                        ))}
                    </List>
                </Grid>

                <Grid item xs={12} md={6}>
                    {selectedConversation && (
                        <>
                            <Typography variant="h6">{`Conversation Details`}</Typography>
                            <List>
                                {messages.slice(0, displayedMessageLimit).map((message, index) => (
                                    <ListItem key={index} secondaryAction={
                                        message.senderId === JSON.parse(localStorage.getItem('user')).id && (
                                            <Button edge="end" onClick={() => handleDeleteMessage(message.id)}>
                                                Delete
                                            </Button>
                                        )
                                    }>
                                        <ListItemText
                                            primary={message.text}
                                            secondary={new Date(message.timestamp).toLocaleString() + " | " + message.sender}
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
                                <Button variant="contained" color="primary" onClick={handleSendMessage}
                                        style={{margin: "10px", marginLeft: "10px"}}>
                                    Send
                                </Button>
                            </Box>
                        </>
                    )}
                </Grid>

                {selectedConversation && (
                    <Grid item xs={12} md={3}>
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
                            <Button variant="contained" color="primary"
                                    onClick={() => handleAddParticipant(newParticipantUsername)}
                                    style={{marginLeft: "10px"}}>
                                Add
                            </Button>
                        </Box>
                        <List dense>
                            {selectedConversation.participantNames.map((participant, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`${participant}`}/>
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
