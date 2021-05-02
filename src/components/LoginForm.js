import React, { useContext, useState } from "react";
import Logo from "../constants/imgs/Logo.jpg";
import "../css/Login.css";
import { AuthContext } from "../App";
import axios from "axios";

function LoginForm({ history }) {
    const [details, setDetails] = useState({ uid: "", password: "" });
    const [loginErrorMsg, setLoginErrorMsg] = useState("");
    const authContext = useContext(AuthContext);

    const submitHandler = (e) => {
        e.preventDefault();

        // * 실제 데이터 가져오기
        // const { status, data } = await axios.post(
        //     "http://localhost:8000/login",
        //     details,
        //     {
        //         headers: {
        //             "Content-type": "application/json",
        //             Accept: "application/json",
        //         },
        //     }
        // );

        // * 허구(실험) 데이터
        const { status, data } = {
            status: 200,
            data: { uid: "EXAMPLE" },
        };
        // const { status, data } = { status: 400, data: { message: "no uid" } };
        // const { status, data } = { status: 400, data: { message: "wrong pw" } };

        if (status === 200) {
            authContext.dispatch({ type: "login", payload: "EXAMPLE" });
            history.push("/main");
        } else {
            // 에러 메시지 송출
            if (data.message === "no uid") {
                setLoginErrorMsg("존재하지 않는 아이디입니다.");
            } else if (data.message === "wrong pw") {
                setLoginErrorMsg("비밀번호가 일치하지 않습니다.");
            }
        }
    };

    return (
        <form className="Login-outer-form" onSubmit={submitHandler}>
            <img src={Logo} width="100" alt="logo" />
            <h1>Study With Us!!!</h1>
            <div className="form-group">
                <h5>ID</h5>
                <input
                    name="uid"
                    placeholder="Input your uid"
                    onChange={(e) =>
                        setDetails({ ...details, uid: e.target.value })
                    }
                    value={details.uid}
                />
            </div>
            <div className="form-group">
                <h5>Password</h5>
                <input
                    type="password"
                    name="password"
                    placeholder="Input your password"
                    onChange={(e) =>
                        setDetails({ ...details, password: e.target.value })
                    }
                    value={details.password}
                />
            </div>
            <p>{loginErrorMsg}</p>
            <br></br>
            <button type="submit">Login</button>
            <br />
        </form>
    );
}

export default LoginForm;
