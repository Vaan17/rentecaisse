import React from 'react';
import styled from 'styled-components';

interface BackgroundLayoutProps {
    children: React.ReactNode;
    backgroundImage: string;
    className?: string;
}

const BackgroundContainer = styled.div<{ $backgroundImage: string }>`
    background-image: url(${props => props.$backgroundImage});
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({
    children,
    backgroundImage,
    className = '',
}) => {
    return (
        <BackgroundContainer $backgroundImage={backgroundImage} className={className}>
            {children}
        </BackgroundContainer>
    );
};

export default BackgroundLayout; 