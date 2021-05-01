import React from "react";
import { Link } from "react-router-dom";

import Logo from "../constants/imgs/Logo.jpg";

import "../css/Home.css";

const Home = () => {
    return (
        <div className="Home">
            <img src={Logo} width="38%" alt="Logo" />
            <Link to="/main" className="Home-route">
                공부하러 가자!
            </Link>
        </div>
    );
};

export default Home;
