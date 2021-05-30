import React, { useContext } from "react";
import { AuthContext } from "../App";

import "../css/MyProfile.css";

const MyProfile = (props) => {
    function LogoutBtn({ history }) {
        const authContext = useContext(AuthContext); /// useContext

        const onClickHandler = (e) => {
            e.preventDefault();
            // logout 성공
            authContext.dispatch({ type: "logout" });
            history.push("/login"); // logout 성공 시 login창으로 이동
            alert("로그아웃!");
        };

        return (
            <button
                type="submit"
                onClick={onClickHandler}
                className="logoutbtn"
            >
                LOG OUT
            </button>
        );
    }

    return (
        <div className="MyProfilePage">
            <div className="Profile-wrapper">
                <h3>로그아웃</h3>
                <span>정말.. 이대로 가시는 건가요..? </span>
                <div className="Profile-button-wrapper">
                    <LogoutBtn history={props.history}></LogoutBtn>
                    <button
                        onClick={() => {
                            props.history.push("/main");
                        }}
                        className="gobackbtn"
                    >
                        GO BACK TO MAIN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
