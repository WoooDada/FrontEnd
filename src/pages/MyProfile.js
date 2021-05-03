import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import axios from "axios";


const MyProfile = (props) => {

    function LogoutBtn({history}) {
        const authContext = useContext(AuthContext); /// useContext
    
        const onClickHandler = (e) => {
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
            // const { status, data } = { status: 400, data: { message: "logout fail" } };
    
            if (status === 200) { // logout 성공
                authContext.dispatch({ type: "logout", payload: "EXAMPLE" });
                history.push("/login"); // logout 성공 시 login창으로 이동
                alert("로그아웃됨");
            } else { // 실패 시
                // 에러 메시지 송출
                if (data.message === "logout fail") { 
                    alert("로그아웃 실패");
                } 
            }
        };
    
        return (
            <button type="submit" onClick={onClickHandler}>Logout</button>
        );
    }

    return (
        <div>
            <h1>MyProfile Page</h1>
            <LogoutBtn history={props.history}></LogoutBtn>
        </div>
    );
};
 
export default MyProfile;
