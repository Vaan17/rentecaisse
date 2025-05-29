import React from "react"
import logo from "../../logo.svg"
import "../App.css"
import axios from "axios"
import { useEffect, useState } from "react"
import Counter from "./Counter"

enum VehiculeType {
    car = "voiture",
    truck = "camion",
    motocycle = "moto",
}

interface IVehicule {
    id: number
    type: VehiculeType
    isElectric: boolean
    description?: string
}

const Sandbox = () => {
    const [myText, setMyText] = useState(undefined);
    const myCar = {
        id: 1,
        type: "voiture",
        isElectric: false
    } as IVehicule

    useEffect(() => {
        axios
            .get("/demo2")
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
                <div>Le serveur vous dit : {myText}</div>
                <div>---</div>
                <div>My vehicule is a "{myCar.type}". {myCar.description ?? "(no description available)"}</div>
                <div>---</div>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <Counter />
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

export default Sandbox