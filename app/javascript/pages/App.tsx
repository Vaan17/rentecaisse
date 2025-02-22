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

const AppContainer = styled.div`
	width: 100vw;
	height: 100vh;
`
const ApplicationWrapper = styled.div`
	width: 100vw;
	height: calc(100vh - 64px);
	display: flex;
`
const AppSubContainer = styled.div`
	width: 100%;
	padding: 1.5em;
	background-color: #f0f0f0;
	overflow: auto;
`

const App = () => {
	return (
		<Provider store={store}>
			<GlobalStyle />
			<BrowserRouter>
				<Routes>
					{/* Route de login isolée */}
					<Route path="/login" element={<LoginPage />} />

					{/* Routes principales avec le layout standard */}
					<Route path="/*" element={
						<AppContainer>
							{/* STATIC TOPBAR */}
							<div style={{ width: "100%", height: "64px", backgroundColor: "#1b1b1b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "5em" }}>
								<a href="/home" style={{ color: "#fff", textDecoration: "none" }}>HOME</a>
								<a href="/colors" style={{ color: "#fff", textDecoration: "none" }}>CHARTE GRAPHIQUE</a>
								<a href="/sandbox" style={{ color: "#fff", textDecoration: "none" }}>SANDBOX</a>
								<a href="/login" style={{ color: "#fff", textDecoration: "none" }}>CONNEXION</a>
							</div>
							<ApplicationWrapper>
								{/* STATIC SIDEBAR */}
								<div style={{ width: "350px", height: "100%", backgroundColor: "#616161", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }} />
								<AppSubContainer>
									<Routes>
										<Route path="/home" element={<div style={{ width: "100%", height: "100%" }}>Home page is comming soon...</div>} />
										<Route path="/sandbox" element={<Sandbox />} />
										<Route path="/colors" element={<ColorsPage />} />
										<Route path="*" element={<Navigate to="/home" replace />} />
									</Routes>
								</AppSubContainer>
							</ApplicationWrapper>
						</AppContainer>
					} />
				</Routes>
			</BrowserRouter>
		</Provider>
	)
}

export default App;