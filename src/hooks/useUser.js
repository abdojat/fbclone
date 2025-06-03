// /src/hooks/useUser.js


import { useState, useEffect } from 'react';
import API from '../api/api';
import { USERS } from '../api/endpoints';

/**
 * Custom hook: returns `{ user, isLoading, error }` for a given userId.
 * - If `options.fetchPictureOnly` is true, it fetches only picturePath.
 * - Otherwise, it fetches the full user object.
 */

export function useUser(userId, { fetchPictureOnly = false } = {}) {
    const [user, setUser] = useState(fetchPictureOnly ? { picturePath: '' } : null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const endpoint = fetchPictureOnly
            ? USERS.getUserPicture(userId)
            : USERS.getUser(userId);

        API.get(endpoint)
            .then((res) => {
                setUser(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error('useUser error', err);
                setError(err);
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId, fetchPictureOnly]);

    return { user, isLoading, error };
}
