import React from "react";
import LoginForm from "../components/LoginForm";
import "../css/Login.css";
import booksImg from "../constants/imgs/books2.svg";
import { useState } from "react";
import SignupForm from "../components/SignupForm";

const Login = (props) => {
    const [isSignUp, setIsSignUp] = useState(false);
    return (
        <div className="LoginPage">
            <div className="LoginPage-BookImg">
                <p>
                    공부만을 위해;
                    <br /> 공다다
                </p>
                <img src={booksImg} width="360" height="300" alt="북"></img>
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
