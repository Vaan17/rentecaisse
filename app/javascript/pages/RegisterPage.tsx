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

const FormContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;

  .mobile-requirements {
    display: none;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;

    .mobile-requirements {
      display: block;
      margin: 1rem 0;
    }

    .desktop-requirements {
      display: none;
    }
  }
`;

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Separator = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: #ddd;
  margin: 0 1rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const RequirementsSection = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 1rem;
  border-radius: 12px;

  @media (max-width: 1024px) {
    margin-top: -1rem;
  }
`;

const RequirementsTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
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

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: #666;

  li {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;

    &:before {
      content: "•";
      color: #FFD700;
      font-weight: bold;
    }
  }
`;

const WarningText = styled.p`
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
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

const PasswordRequirements = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: -0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;

  p {
    margin: 0.25rem 0;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1rem;
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-top: 0.2rem;
  }

  label {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }

  a {
    color: #333;
    text-decoration: underline;
    font-weight: 500;
    
    &:hover {
      color: #FFD700;
    }
  }
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
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

const SignInLink = styled.div`
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

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const newPasswordErrors = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        setPasswordErrors(newPasswordErrors);

        if (password && !Object.values(newPasswordErrors).every(value => value === true)) {
            setPasswordError('Format du mot de passe invalide');
        } else {
            setPasswordError('');
        }
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

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);

        if (confirmPassword) {
            if (confirmPassword !== newPassword) {
                setConfirmPasswordError('Les mots de passe ne correspondent pas');
            } else {
                setConfirmPasswordError('');
            }
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (newConfirmPassword !== password) {
            setConfirmPasswordError('Les mots de passe ne correspondent pas');
        } else {
            setConfirmPasswordError('');
        }
    };

    const isPasswordValid = () => {
        return Object.values(passwordErrors).every(value => value === true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // La logique d'inscription sera implémentée plus tard
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <BackgroundLayout backgroundImage="/images/backgrounds/parking-background.png">
                <WhiteContainer width="min(1200px, 90%)">
                    <Header>
                        <Logo src="/images/logos/logo.png" alt="RenteCaisse Logo" />
                        <BrandName>RENTECAISSE</BrandName>
                    </Header>
                    <Title>Inscription</Title>
                    {error && (
                        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}
                    <FormContainer>
                        <FormSection>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>Email*</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="marcel.picho@gmail.com"
                                        required
                                        className={emailError ? 'error' : ''}
                                    />
                                    {emailError && <ErrorText>{emailError}</ErrorText>}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Mot de passe*</Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="**********"
                                        required
                                        className={!isPasswordValid() && password ? 'error' : ''}
                                    />
                                    {passwordError && <ErrorText>{passwordError}</ErrorText>}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Confirmer le mot de passe*</Label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="**********"
                                        required
                                        className={confirmPasswordError ? 'error' : ''}
                                    />
                                    {confirmPasswordError && <ErrorText>{confirmPasswordError}</ErrorText>}
                                </FormGroup>
                                <div className="mobile-requirements">
                                    <RequirementsSection>
                                        <RequirementsTitle>
                                            Exigences du mot de passe
                                        </RequirementsTitle>
                                        <RequirementsList>
                                            <RequirementItem isValid={passwordErrors.length}>12 caractères minimum</RequirementItem>
                                            <RequirementItem isValid={passwordErrors.uppercase}>Une lettre majuscule</RequirementItem>
                                            <RequirementItem isValid={passwordErrors.lowercase}>Une lettre minuscule</RequirementItem>
                                            <RequirementItem isValid={passwordErrors.number}>Un chiffre</RequirementItem>
                                            <RequirementItem isValid={passwordErrors.special}>Un caractère spécial (!, @, #, $, etc.)</RequirementItem>
                                        </RequirementsList>
                                        <WarningText>
                                            Évitez d'utiliser des mots du dictionnaire, des séquences de caractères (123456) ou des informations personnelles.
                                        </WarningText>
                                    </RequirementsSection>
                                </div>
                                <CheckboxGroup>
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        required
                                    />
                                    <label htmlFor="terms">
                                        En cochant cette case, j'atteste avoir lu et accepté les <a href="/cgu">CGU</a>, <a href="/cgv">CGV</a> et <a href="/mentions-legales">mentions légales</a>.
                                    </label>
                                </CheckboxGroup>
                                <Button type="submit" disabled={!acceptTerms}>
                                    Inscription
                                </Button>
                                <SignInLink>
                                    Vous avez déjà un compte ? <a href="/login">Se connecter</a>
                                </SignInLink>
                            </Form>
                        </FormSection>
                        <Separator />
                        <RequirementsSection className="desktop-requirements">
                            <RequirementsTitle>
                                Exigences du mot de passe
                            </RequirementsTitle>
                            <RequirementsList>
                                <RequirementItem isValid={passwordErrors.length}>12 caractères minimum</RequirementItem>
                                <RequirementItem isValid={passwordErrors.uppercase}>Une lettre majuscule</RequirementItem>
                                <RequirementItem isValid={passwordErrors.lowercase}>Une lettre minuscule</RequirementItem>
                                <RequirementItem isValid={passwordErrors.number}>Un chiffre</RequirementItem>
                                <RequirementItem isValid={passwordErrors.special}>Un caractère spécial (!, @, #, $, etc.)</RequirementItem>
                            </RequirementsList>
                            <WarningText>
                                Évitez d'utiliser des mots du dictionnaire, des séquences de caractères (123456) ou des informations personnelles.
                            </WarningText>
                        </RequirementsSection>
                    </FormContainer>
                </WhiteContainer>
            </BackgroundLayout>
        </>
    );
};

export default RegisterPage; 