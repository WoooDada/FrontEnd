import React, { useContext } from "react";
import LoginForm from "../components/LoginForm";
import "../css/Login.css";
import { useState } from "react";
import SignupForm from "../components/SignupForm";
import { AuthContext } from "../App";
import { useEffect } from "react";

const Login = (props) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.dispatch({ type: "onLoginPage" });
        return () => {
            authContext.dispatch({ type: "notOnLoginPage" });
        };
    }, []);
    return (
        <div className="LoginPage">
            <div className="Login-wrapper">
                <div className="Login-LoginBox">
                    {isSignUp ? (
                        <SignupForm setIsSignUp={setIsSignUp}></SignupForm>
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
