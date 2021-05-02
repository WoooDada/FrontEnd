import React from "react";
import { Link } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import "../css/Login.css";

const Login = (props) => {
    return (
        <div className="Login-signupBtn">
            <LoginForm history={props.history} />
            <button type="button">
                <Link to="/signup">SignUp</Link>
            </button>
        </div>
    );
};

export default Login;
