import { useState, useEffect } from 'react';
import axiosSecured from '../services/apiService';

interface UseUserImageReturn {
    imageUrl: string | null;
    isLoading: boolean;
    hasError: boolean;
}

export const useUserImage = (userId: number | undefined): UseUserImageReturn => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!userId) {
            setImageUrl(null);
            setIsLoading(false);
            setHasError(false);
            return;
        }

        const fetchUserImage = async () => {
            setIsLoading(true);
            setHasError(false);

            try {
                const response = await axiosSecured.get(`/api/users/profile-image?user_id=${userId}`);

                if (response.status === 200) {
                    const data = response.data;
                    if (data.success) {
                        const binaryData = atob(data.image_data);
                        const bytes = new Uint8Array(binaryData.length);
                        for (let i = 0; i < binaryData.length; i++) {
                            bytes[i] = binaryData.charCodeAt(i);
                        }
                        const blob = new Blob([bytes], { type: data.content_type });
                        const url = URL.createObjectURL(blob);
                        setImageUrl(url);
                    } else {
                        setHasError(true);
                        setImageUrl(null);
                    }
                } else {
                    setHasError(true);
                    setImageUrl(null);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'image utilisateur:", error);
                setHasError(true);
                setImageUrl(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserImage();

        // Cleanup function pour libérer l'URL de l'objet blob
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [userId]);

    // Cleanup effect pour libérer l'URL quand le composant se démonte
    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    return {
        imageUrl,
        isLoading,
        hasError
    };
};

export default useUserImage;
