import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../constants/imgs/Logo.jpg";
import { AuthContext } from "../App";

import "../css/Home.css";

const Home = () => {
    const authContext = useContext(AuthContext);
    // authContext.state.uid 존재하면 /main, 존재하지않으면 /login으로. 
    const path = authContext.state.uid ? "/main" : "/login"; 
    return (
        <div className="Home">
            <div className="Home-banner">
                <p className="Home-banner-only">
                    공부만을 위해:<br></br> 공다다
                </p>
                상단 picture
                <Link to={path} className="Home-route">
                    공부하러 가자!
                </Link>
            </div>


            <img src={Logo} width="38%" alt="Logo" />

            
        </div>
    );
};

export default Home;
