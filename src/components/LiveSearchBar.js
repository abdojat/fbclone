// /src/components/LiveSearchBar.js


import { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { USERS } from '../api/endpoints';
import PageLayout from './PageLayout';

const LiveSearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                API.get(USERS.searchUsers(query))
                    .then(res => setResults(res.data))
                    .catch(() => setResults([]));
            } else {
                setResults([]);
            }
        }, 300); // debounce

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <PageLayout>
            <TextField
                label="Search Friends"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query.trim() && (
                results.length > 0 ? (
                    <List>
                        {results.map(user => (
                            <ListItem button key={user._id} onClick={() => navigate(`/profile/${user._id}`)}>
                                <ListItemAvatar>
                                    <Avatar src={user.picturePath} />
                                </ListItemAvatar>
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 2, color: 'gray', fontStyle: 'italic' }}>
                        No users found
                    </Box>
                )
            )}

        </PageLayout>
    );
};

export default LiveSearchBar;
