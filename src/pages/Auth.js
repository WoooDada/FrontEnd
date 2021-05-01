import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Signup } from '../pages'
import LoginForm from '../components/LoginForm';
import '../css/Login.css';

const Auth = () => {
    const adminUser = { // user example
        email: "woojung@love.com",
	    password: "0000"
    }
    
    const [user, setUser] = useState({email: "", password: ""});

    const Login = details => {
        console.log(details);
        // user example과 일치하면 login success
        if (details.email == adminUser.email && details.password == adminUser.password){
            console.log("login success");
            setUser({
                email: details.email,
                password: details.password
            });
        } else{ //일치하지 않으면 login fail
            console.log("login fail");
        }
    }

    const Logout = () => { // 혹시 몰라서 넣어둔 코드..
        setUser({ email: "", password: ""});
    }

    return (
        <div className="outer-loginform">
            <LoginForm Login={Login} />
            <Link to="/Signup"><button type="button">Sign Up</button></Link>
        </div>
    );
};

export default Auth;
