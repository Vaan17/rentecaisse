import React from 'react';
import styled from 'styled-components';

interface WhiteContainerProps {
    children: React.ReactNode;
    width?: string;
    height?: string;
    padding?: string;
    rounded?: string;
    className?: string;
}

const Container = styled.div<{
    $width: string;
    $height: string;
    $padding: string;
    $rounded: string;
}>`
    background-color: white;
    width: ${props => props.$width};
    height: ${props => props.$height};
    padding: ${props => props.$padding};
    border-radius: ${props => props.$rounded};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    max-width: 95%;
    
    @media (max-width: 768px) {
        width: 90%;
        padding: 1.5rem;
        margin: 0.5rem;
    }

    @media (max-width: 480px) {
        width: 95%;
        padding: 1rem;
        margin: 0.25rem;
    }
`;

const WhiteContainer: React.FC<WhiteContainerProps> = ({
    children,
    width = '500px',
    height = 'auto',
    padding = '2rem',
    rounded = '20px',
    className = '',
}) => {
    return (
        <Container
            $width={width}
            $height={height}
            $padding={padding}
            $rounded={rounded}
            className={className}
        >
            {children}
        </Container>
    );
};

export default WhiteContainer; 