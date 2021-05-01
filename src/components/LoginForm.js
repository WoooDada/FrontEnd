import React, { useState } from 'react';
import Logo from './Logo.jpg';
import '../css/Login.css';


function LoginForm({Login}) {
    const [details, setDetails] = useState({email: "", password: ""});

    const submitHandler = e => {
        e.preventDefault();

        Login(details);
    }

    return (
        <form onSubmit={submitHandler}>
            <img src={Logo} width='100'/>
            <h1>Study With Us!!!</h1>
            <div className="form-group">
                <h5>ID</h5>
                <input
                    name="email"
                    placeholder="Input your e-mail"
                    onChange={e => setDetails({...details, email: e.target.value})} value={details.email}
                />
            </div>
            <div className="form-group">
                <h5>Password</h5>
                <input
                    type="password"
                    name="password"
                    placeholder="Input your password"
                    onChange={e => setDetails({...details, password: e.target.value})} value={details.password}
                />
            </div>
            <br></br>
            <button type="submit">Login</button><br /> 
            
        </form>
        
    )
}

export default LoginForm;