import React from "react";
import LogoutBtn from "../components/LogoutBtn";

const MyProfile = (props) => {
    return (
        <div>
            <h1>MyProfile Page</h1>
            <LogoutBtn history={props.history}></LogoutBtn>
        </div>
    );
};

export default MyProfile;
