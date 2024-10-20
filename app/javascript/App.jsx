import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
	const [myText, setMyText] = useState(undefined);

	useEffect(() => {
		axios
			.get("http://localhost:3000/demo")
			.then((response) => {
				setMyText(response.data);
			})
			.catch((error) => {
				console.error("Il y a eu une erreur avec la requête:", error);
			});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<div>Hourra, ReactJs est compilé par Vite :D</div>
				<div>---</div>
				<div>Le serveur vous dis : {myText}</div>
				<p>
					Edit <code>src/App.jsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
};

export default App;
