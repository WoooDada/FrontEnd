import React, { useContext, useState } from "react";
import "../css/Login.css";
import Logo from "../constants/imgs/Logo.jpg";
import { AuthContext } from "../App";
import axios from "axios";

function SignupForm({ history }) {
    const [details, setDetails] = useState({
        uid: "",
        password: "",
        nickname: "",
    }); // useState 정보 : id, password, nickname
    const [signupErrorMsg, setSignupErrorMsg] = useState("");
    const authContext = useContext(AuthContext);

    const submitHandler = async(e) => {
        e.preventDefault();

        // * 실제 데이터 가져오기
        // const { status, data } = await axios.post(
        //     "http://13.209.194.64:8080/api/signup",
        //     details,
        //     {
        //         headers: {
        //             "Content-type": "application/json",
        //             Accept: "application/json",
        //         },
        //     }
        // );

        //* 허구(실험) 데이터
        const { status, data } = {
            status: 200,
            data: { uid: "EXAMPLE" },
        };
        // signup 실패하는 경우 : 1. uid 중복 2. nickname 중복
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "uid already exist" },
        // };
        // const { status, data } = { status: 400, data: { message: "nickname already exist" } };

        if (status === 200) {
            // signup 성공 시
            history.push("/login"); // 성공 시 login으로 이동
            alert("회원가입 성공!");
        } else {
            // 실패 시
            // 에러 메시지 송출
            if (data.message === "uid 중복") {
                // uid 중복
                setSignupErrorMsg("이미 가입된 회원입니다.");
            } else if (data.message === "nickname 중복") {
                // nickname 중복
                setSignupErrorMsg(
                    "이미 존재하는 닉네임입니다. 다른 닉네임을 입력해주세요."
                );
            }
        }
    };

    return (
        <form className="Signup-outer-form" onSubmit={submitHandler}>
            <img src={Logo} width="100" alt="logo" />
            <h1>Study With Us!!!</h1>
            <div className="form-group">
                <h5>ID</h5>
                <input
                    name="email"
                    placeholder="Input your e-mail"
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
            <div className="form-group">
                <h5>Nickname</h5>
                <input
                    name="nickname"
                    placeholder="Input your nickname"
                    onChange={(e) =>
                        setDetails({ ...details, nickname: e.target.value })
                    }
                    value={details.nickname}
                />
            </div>
            <p>{signupErrorMsg}</p>
            <br></br>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupForm;
