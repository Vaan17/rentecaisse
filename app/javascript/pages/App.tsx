import React from "react"
import "./App.css"
import { Provider } from "react-redux"
import store from "../../store/store.js"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Sandbox from "./sandbox/Sandbox.js"
import ColorsPage from "./sandbox/ColorsPage.js"
import GlobalStyle from "./app/GlobalStyle.ts"
import styled from "styled-components"
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import RegisterSuccessPage from './RegisterSuccessPage'
import CGVPage from './CGVPage'
import CGUPage from './CGUPage'
import MentionsLegalesPage from './MentionsLegalesPage'
import ConfirmEmailPage from './ConfirmEmailPage'
import FirstConnexionPage from './FirstConnexionPage'
import ForgottenPasswordPage from './ForgottenPasswordPage'
import ResetPasswordPage from './ResetPasswordPage'
import AuthenticatedPage from './AuthenticatedPage'
import CompleteProfil from './CompleteProfil'
import AffectationEntrepriseSite from './AffectationEntrepriseSite'
import StatutAffectationEnAttente from './StatutAffectationEnAttente'
import HomeAuthenticated from './HomeAuthenticated'
import Profile from './Profile'
import Sites from "./sites/Sites.tsx"
import SiteDetails from "./sites/SiteDetails.tsx"
import SideBar from '../components/SideBar'
import TopBar from "../components/TopBar.tsx"

const AppContainer = styled.div`
	width: 100vw;
	height: 100vh;
`;
const ApplicationWrapper = styled.div`
	width: 100%;
	height: calc(100% - var(--top-bar-height));
	display: flex;
`;
const AppSubContainer = styled.div`
	width: 100%;
	height: calc(100% - var(--top-bar-height));
	background-color: var(--secondary50);
	padding: 24px;
	overflow-y: auto;
`

const App = () => {
	return (
		<Provider store={store}>
			<GlobalStyle />
			<BrowserRouter>
				<Routes>
					{/* Routes publiques */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/register-success" element={<RegisterSuccessPage />} />
					<Route path="/forgot-password" element={<ForgottenPasswordPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route path="/cgv" element={<CGVPage />} />
					<Route path="/cgu" element={<CGUPage />} />
					<Route path="/mentions-legales" element={<MentionsLegalesPage />} />
					<Route path="/confirm_email" element={<ConfirmEmailPage />} />
					<Route path="/first-connexion" element={<FirstConnexionPage />} />

					{/* Routes authentifiées (plus de wrapper RequireAuth) */}
					<Route path="/authenticated" element={<AuthenticatedPage />} />
					<Route path="/complete-profil" element={<CompleteProfil />} />
					<Route
						path="/affectation-entreprise"
						element={<AffectationEntrepriseSite />}
					/>
					<Route
						path="/statut-affectation"
						element={<StatutAffectationEnAttente />}
					/>

					{/* Routes principales avec le layout standard */}
					<Route path="/*" element={
						<AppContainer>
							<TopBar />
							<ApplicationWrapper>
								<SideBar />
								<AppSubContainer>
									<Routes>
										<Route path="/home" element={<HomeAuthenticated />} />
										<Route path="/sandbox" element={<Sandbox />} />
										<Route path="/colors" element={<ColorsPage />} />
										<Route path="/sites" element={<Sites />} />
										<Route path="/sites/:id" element={<SiteDetails />} />
										<Route path="*" element={<Navigate to="/home" replace />} />
										<Route path="/profile" element={<Profile />} />
									</Routes>
								</AppSubContainer>
							</ApplicationWrapper>
						</AppContainer>
					} />
				</Routes>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
