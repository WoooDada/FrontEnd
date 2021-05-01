import React from "react";
import Logo from "../constants/imgs/Logo.jpg";

function SignupForm() {
    return (
        <form>
            <img src={Logo} width="100" alt="logo" />
            <h1>Study With Us!!!</h1>
            <div className="form-group">
                <h5>ID</h5>
                <input name="email" placeholder="Input your e-mail" />
            </div>
            <div className="form-group">
                <h5>Password</h5>
                <input
                    type="password"
                    name="password"
                    placeholder="Input your password"
                />
            </div>
            <div className="form-group">
                <h5>Nickname</h5>
                <input name="nickname" placeholder="Input your nickname" />
            </div>

            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupForm;
