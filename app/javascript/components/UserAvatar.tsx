import React from 'react';
import { Avatar, CircularProgress } from '@mui/material';
import { useUserImage } from '../hook/useUserImage';

interface UserAvatarProps {
    userId: number;
    userName?: string;
    sx?: any;
    size?: 'small' | 'medium' | 'large';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
    userId, 
    userName = '', 
    sx = {}, 
    size = 'medium' 
}) => {
    const { imageUrl, isLoading, hasError } = useUserImage(userId);

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { width: 32, height: 32 };
            case 'large':
                return { width: 56, height: 56 };
            default:
                return { width: 44, height: 44 };
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    if (isLoading) {
        return (
            <Avatar sx={{ ...getSizeStyles(), ...sx }}>
                <CircularProgress size={size === 'small' ? 16 : 20} />
            </Avatar>
        );
    }

    return (
        <Avatar 
            src={!hasError ? imageUrl || undefined : undefined}
            sx={{ 
                ...getSizeStyles(), 
                ...sx,
                border: '2px solid #e0e0e0'
            }}
        >
            {(hasError || !imageUrl) && getInitials(userName)}
        </Avatar>
    );
};

export default UserAvatar;
