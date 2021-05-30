import React from "react";
import LoginForm from "../components/LoginForm";
import "../css/Login.css";
import booksImg from "../constants/imgs/books.png";
import { useState } from "react";
import SignupForm from "../components/SignupForm";

const Login = (props) => {
    const [isSignUp, setIsSignUp] = useState(false);
    return (
        <div className="LoginPage">
            <div className="LoginPage-BookImg">
                <img src={booksImg} width="300" height="360"></img>
            </div>
            <div className="Login-wrapper">
                <div className="Login-LoginBox">
                    {isSignUp ? (
                        <SignupForm></SignupForm>
                    ) : (
                        <>
                            <LoginForm history={props.history} />
                            <button
                                className="Login-signupbtn"
                                onClick={() => setIsSignUp(true)}
                            >
                                SIGN UP
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
