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
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const BackgroundLayout = ({
    children,
    backgroundImage,
    className = '',
}: BackgroundLayoutProps) => {
    return (
        <BackgroundContainer $backgroundImage={backgroundImage} className={className}>
            {children}
        </BackgroundContainer>
    );
};

export default BackgroundLayout; 