import React, { useEffect } from "react"
import "./App.css"
import { Provider, useDispatch } from "react-redux"
import store from "../redux/store.ts"
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
import ForgottenPasswordPage from './ForgottenPasswordPage'
import ResetPasswordPage from './ResetPasswordPage'
import CompleteProfil from './CompleteProfil'
import AffectationEntrepriseSite from './AffectationEntrepriseSite'
import StatutAffectationEnAttente from './StatutAffectationEnAttente'
import Profile from './Profile'
import Sites from "./sites/Sites.tsx"
import SiteDetails from "./sites/SiteDetails.tsx"
import SideBar from '../components/SideBar'
import TopBar from "../components/TopBar.tsx"
import Voitures from "./voitures/Voitures.tsx"
import VoitureDetails from "./voitures/VoitureDetails.tsx"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./errorFallbacks/ErrorFallback.tsx"
import Home from "../components/Home.tsx"
import AdminVoitures from "./admin/AdminVoitures.tsx"
import { ToastContainer } from "react-toastify"
import ReduxSync from "../redux/ReduxSync.tsx"
import CancellationAccountDeletion from './CancellationAccountDeletion'
import AdminSites from "./admin/AdminSites.tsx"
import AdminUtilisateurs from "./admin/AdminUtilisateurs.tsx"
import AdminCles from "./admin/AdminCles.tsx"
import ReservationVoiturePage from './emprunts/ReservationVoiturePage'
import AdminEmprunts from "./admin/AdminEmprunts.tsx"
import Emprunts from "./mes_emprunts/Emprunts.tsx"

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
			<ErrorBoundary
				FallbackComponent={ErrorFallback}
				onError={(error, info) => {
					console.error('Erreur capturée dans ErrorBoundary :', error);
					console.error('Infos :', info);
				}}
			>

				<BrowserRouter>
					<ToastContainer
						position="bottom-left"
						autoClose={5000}
						pauseOnFocusLoss={false}
						theme="colored"
						newestOnTop
					/>
					<Routes>
						{/* Routes publiques */}
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/register-success" element={<RegisterSuccessPage />} />
						<Route path="/forgot-password" element={<ForgottenPasswordPage />} />
						<Route path="/reset-password" element={<ResetPasswordPage />} />
						<Route path="/cgv" element={<CGVPage />} />
						<Route path="/cgu" element={<CGUPage />} />
						{/* <Route path="/mentions_legales" element={<MentionsLegalesPage />} /> */}
						<Route path="/confirm_email" element={<ConfirmEmailPage />} />
						{/* Routes authentifiées (plus de wrapper RequireAuth) */}
						<Route
							path="/cancellation-account"
							element={<CancellationAccountDeletion />}
						/>
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
							<ReduxSync>
								<AppContainer>
									<TopBar />
									<ApplicationWrapper>
										<SideBar />
										<AppSubContainer>
											<Routes>
												{/* Temporaires */}
												<Route path="/sandbox" element={<Sandbox />} />
												<Route path="/colors" element={<ColorsPage />} />
												{/* Routes globales */}
												<Route path="/home" element={<Home />} />
												<Route path="/profile" element={<Profile />} />
												<Route path="/sites" element={<Sites />} />
												<Route path="/sites/:id" element={<SiteDetails />} />
												<Route path="/voitures" element={<Voitures />} />
												<Route path="/voitures/:id" element={<VoitureDetails />} />
												<Route path="/emprunts" element={<ReservationVoiturePage />} />
												<Route path="/emprunts_historique" element={<Emprunts />} />
												{/* Routes admin */}
												<Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
												<Route path="/admin/voitures" element={<AdminVoitures />} />
												<Route path="/admin/sites" element={<AdminSites />} />
												<Route path="/admin/cles" element={<AdminCles />} />
												<Route path="/admin/emprunts" element={<AdminEmprunts />} />
												{/* Fallback */}
												<Route path="*" element={<Navigate to="/home" replace />} />
											</Routes>
										</AppSubContainer>
									</ApplicationWrapper>
								</AppContainer>
							</ReduxSync>
						} />
					</Routes>
				</BrowserRouter>
			</ErrorBoundary>
		</Provider>
	);
};

export default App;
