import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Logo from "../constants/imgs/Logo.jpg";
import { AuthContext } from "../App";

import "../css/Home.css";

const Home = () => {
    const authContext = useContext(AuthContext);
    const path = authContext.state.uid ? "/main" : "/login";
    return (
        <div className="Home">
            <img src={Logo} width="38%" alt="Logo" />

            <Link to={path} className="Home-route">
                공부하러 가자!
            </Link>
        </div>
    );
};

export default Home;
