import React from "react";
import SignupForm from "../components/SignupForm";

const Signup = (props) => {
    return (
        <div>
            <SignupForm history={props.history} />
        </div>
    );
};

export default Signup;
