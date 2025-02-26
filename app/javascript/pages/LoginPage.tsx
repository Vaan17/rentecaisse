import React, { useState } from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  justify-content: center;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const BrandName = styled.span`
  font-size: 2.25rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    gap: 1.25rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }

  &.error {
    border-color: #ff4d4d;
    &:focus {
      box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.1);
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const ErrorText = styled.span`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: 'Inter', sans-serif;
`;

const Button = styled.button`
  padding: 1.125rem;
  background-color: #FFD700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%;
  margin-top: 1.5rem;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;

  &:hover {
    background-color: #FFC700;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 12px;
    margin-top: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 1rem;
    border-radius: 10px;
    margin-top: 1rem;
  }
`;

const ForgotPassword = styled.a`
  text-align: right;
  color: #666;
  text-decoration: none;
  font-size: 1.1rem;
  margin-top: -0.75rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: -0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-top: -0.25rem;
  }
`;

const SignUpLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #666;
  font-family: 'Inter', sans-serif;

  a {
    color: #333;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-top: 1.75rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Format d\'email invalide');
    } else {
      setEmailError('');
    }
  };

  // Fonction pour convertir un ArrayBuffer en chaîne hexadécimale
  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Fonction pour hasher le mot de passe en SHA-256
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return arrayBufferToHex(hashBuffer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Format d\'email invalide');
      return;
    }

    try {
      const hashedPassword = await hashPassword(password);

      const formData = {
        user: {
          email,
          password: hashedPassword
        }
      };

      console.log('Tentative de connexion avec:', { email, hashedPassword });

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Statut de la réponse:', response.status);
      const data = await response.json();
      console.log('Données reçues:', data);

      if (data.success) {
        // Sauvegarde du token de session
        localStorage.setItem('sessionToken', data.session_token);
        window.location.href = '/authenticated';
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError('Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
        <WhiteContainer width="min(600px, 90%)">
          <Header>
            <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
            <BrandName>RENTECAISSE</BrandName>
          </Header>
          <Title>Connexion</Title>
          {error && (
            <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email*</Label>
              <Input
                type="email"
                name="email"
                placeholder="marcel.picho@gmail.com"
                value={email}
                onChange={handleEmailChange}
                required
                className={emailError ? 'error' : ''}
              />
              {emailError && <ErrorText>{emailError}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Mot de passe*</Label>
              <Input
                type="password"
                name="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <ForgotPassword href="/forgot-password">Mot de passe oublié ?</ForgotPassword>
            <Button type="submit">
              Connexion
            </Button>
            <SignUpLink>
              Vous n'avez pas de compte ? <a href="/register">S'inscrire</a>
            </SignUpLink>
          </Form>
        </WhiteContainer>
      </BackgroundLayout>
    </>
  );
};

export default LoginPage; 