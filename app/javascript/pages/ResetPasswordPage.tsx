import React, { useState } from 'react';
import styled from 'styled-components';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import WhiteContainer from '../components/layout/WhiteContainer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';
import { Flex } from '../components/style/flex';

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

const Description = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
`;

const RequirementItem = styled.li<{ isValid: boolean }>`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: ${props => props.isValid ? '#4CAF50' : '#666'};

  &:before {
    content: "${props => props.isValid ? '✓' : '•'}";
    color: ${props => props.isValid ? '#4CAF50' : '#FFD700'};
    font-weight: bold;
  }
`;

const SCard = styled(Card)`
  width: 50%;
  min-width: 300px;
  height: 90%;
  padding: 1em;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`
const SCardContent = styled(CardContent)`
  padding: 0 1em !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  gap: 2em;
`

interface PasswordErrors {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validatePassword = (password: string) => {
    const errors = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (confirmPassword) {
      setConfirmPasswordError(newPassword === confirmPassword ? '' : 'Les mots de passe ne correspondent pas');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(password === newConfirmPassword ? '' : 'Les mots de passe ne correspondent pas');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setPasswordError('Le mot de passe ne respecte pas les exigences de sécurité');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            token,
            password
          }
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion au serveur');
    }
  };

  return (
    <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
      <SCard>
        <SCardContent>
          {!token && (
            <>
              <Flex justifyCenter gap="1em">
                <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                <BrandName>Lien invalide</BrandName>
              </Flex>
              <Description>
                Le lien de réinitialisation de mot de passe est invalide ou a expiré. Veuillez faire une nouvelle demande de réinitialisation.
              </Description>
              <Button onClick={() => navigate('/forgot-password')}>
                Réinitialiser mon mot de passe
              </Button>
            </>
          )}
          {(token && isSubmitted) && (
            <>
              <Flex justifyCenter gap="1em">
                <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                <BrandName>Mot de passe réinitialisé</BrandName>
              </Flex>
              <Description>
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </Description>
              <Button onClick={() => navigate('/login')}>
                Se connecter
              </Button>
            </>
          )}
          {token && !isSubmitted && (
            <>
              <Flex justifyCenter gap="1em">
                <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                <BrandName>Réinitialisation</BrandName>
              </Flex>
              <Description>
                Veuillez choisir un nouveau mot de passe pour votre compte.
              </Description>
              {error && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Nouveau mot de passe*</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="**********"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={passwordError ? 'error' : ''}
                  />
                  {passwordError && <ErrorText>{passwordError}</ErrorText>}
                  <RequirementsList>
                    <RequirementItem isValid={passwordErrors.length}>12 caractères minimum</RequirementItem>
                    <RequirementItem isValid={passwordErrors.uppercase}>Une lettre majuscule</RequirementItem>
                    <RequirementItem isValid={passwordErrors.lowercase}>Une lettre minuscule</RequirementItem>
                    <RequirementItem isValid={passwordErrors.number}>Un chiffre</RequirementItem>
                    <RequirementItem isValid={passwordErrors.special}>Un caractère spécial (!, @, #, $, etc.)</RequirementItem>
                  </RequirementsList>
                </FormGroup>
                <FormGroup>
                  <Label>Confirmer le nouveau mot de passe*</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="**********"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className={confirmPasswordError ? 'error' : ''}
                  />
                  {confirmPasswordError && <ErrorText>{confirmPasswordError}</ErrorText>}
                </FormGroup>
                <Button type="submit">
                  Réinitialiser le mot de passe
                </Button>
              </Form>
            </>
          )}
        </SCardContent>
      </SCard>
    </BackgroundLayout>
  );
};

export default ResetPasswordPage