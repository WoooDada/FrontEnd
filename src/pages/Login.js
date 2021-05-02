import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../css/Login.css";

const Login = () => {
    const adminUser = {
        // user example
        email: "woojung@love.com",
        password: "0000",
    };

    const [user, setUser] = useState({ email: "", password: "" });

    const LoginFunc = (details) => {
        console.log(details);
        // user example과 일치하면 login success
        if (
            details.email === adminUser.email &&
            details.password === adminUser.password
        ) {
            console.log("login success");
            setUser({
                email: details.email,
                password: details.password,
            });
        } else {
            //일치하지 않으면 login fail
            console.log("login fail");
        }
    };

    const LogoutFunc = () => {
        // 혹시 몰라서 넣어둔 코드..
        setUser({ email: "", password: "" });
    };

    return (
        <div className="Login-signupBtn">
            <LoginForm Login={LoginFunc} />
            <button type="button">
                <Link to="/signup">SignUp</Link>
            </button>
        </div>
    );
};

export default Login;
