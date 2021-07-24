import React, { useContext } from "react";
import { AuthContext } from "../App";
import { MyProfileForm } from "../components";

import "../css/MyProfile.css";

const MyProfile = () => {
    

    return (
        <div>
            <MyProfileForm></MyProfileForm>
        </div>
    )
};

export default MyProfile;
