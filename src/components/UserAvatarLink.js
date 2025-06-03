// /src/components/UserAvatarLink.js
import { Avatar, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Shows: [Avatar] [Box: {username (bold), subtitle (small)}]
 * Links to `/profile/${user._id}` by default.
 * - `subtitle` can be firstName + lastName, date, mutual friends, etc.
 */
const UserAvatarLink = ({ user, subtitle, linkToUser = true, sx = {} ,goto}) => {
    if (!user) return null;
    return (
        <Link
            to={linkToUser ? `/profile/${user._id}` : goto}
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
                <Avatar src={user.picturePath} sx={{ width: 40, height: 40 }} />
                <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {user.username}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Link>
    );
};

export default UserAvatarLink;
