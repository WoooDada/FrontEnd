import React, { useContext, useState } from "react";
import "../css/Login.css";
import { AuthContext } from "../App";
import axios from "axios";

import { postApi } from "../api";

function LoginForm({ history }) {
    const [details, setDetails] = useState({ uid: "", password: "" }); // useState 정보 : id, password
    const [loginErrorMsg, setLoginErrorMsg] = useState("");
    const authContext = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();

        // * 실제 데이터 가져오기: 성공(서버 켰을 때만 해야 함.)

        await postApi(details, "/api/login/")
            .then(({ status, data }) => {
                authContext.dispatch({
                    type: "login",
                    token: data.token,
                    uid: details.uid,
                }); // useContext 처리
                localStorage.setItem(
                    "loggedInfo",
                    JSON.stringify({ uid: details.uid, token: data.token })
                );
                history.push("/main"); // 성공 시 main으로 이동
            })
            .catch((e) => {
                alert("로그인 실패");
                console.log(e.response);
                if (
                    e.response &&
                    e.response.data &&
                    e.response.data.message &&
                    e.response.data.message === "uid or pw wrong"
                ) {
                    // id가 없는 경우
                    setLoginErrorMsg("아이디나 비밀번호가 일치하지 않습니다.");
                }
            });

        // * 허구(실험) 데이터
        // const { status, data } = {
        //     status: 200,
        //     data: { uid: "EXAMPLE", token: "haha" },
        // };

        // const { status, data } = {
        //     status: 400,
        //     data: { message: "uid or pw wrong" },
        // };
    };

    return (
        <form className="Login-outer-form" onSubmit={submitHandler}>
            <div className="Login-form-header">
                <h3>로그인</h3>
                <span>지금 바로 공부하러 가요!</span>
            </div>
            <div className="form-group">
                <h5>EMAIL</h5>
                <input
                    name="uid"
                    placeholder="이메일을 적어주세요."
                    onChange={
                        (e) => setDetails({ ...details, uid: e.target.value }) ///useState의 setDetails
                    }
                    value={details.uid} /// useState의 details.uid값
                />
            </div>
            <div className="form-group">
                <h5>PASSWORD</h5>
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호를 적어주세요."
                    onChange={(e) =>
                        setDetails({ ...details, password: e.target.value })
                    }
                    value={details.password}
                />
            </div>
            <p>{loginErrorMsg}</p>
            <br></br>
            <button type="submit">LOG IN</button>
            <br />
        </form>
    );
}

export default LoginForm;
