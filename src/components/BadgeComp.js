import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaMedal } from "react-icons/fa";
import axios from "axios";

import "../css/Main.css";
import { AuthContext } from "../App";

const getBadgeColor = (badge) => {
    switch (badge) {
        case "B":
            return "#cd7f32";
        case "S":
            return "#c0c0c0";
        case "G":
            return "#ffd700";
        case "P":
            return "#ff1493";
        case "D":
            return "#c7e8ff";
        default:
            return "#000000";
    }
};

const BadgeComp = () => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState({ nickname: "", badge_color: "" });
    useEffect(() => {
        const getNickName = async () => {
            // const result = await axios.get(``, params: {uid: authContext.state.uid});
            const { status, data } = {
                status: 200,
                data: { nickname: "우정", badge: "B" },
            };

            if (status === 200) {
                return setUserData({
                    ...data,
                    badge_color: getBadgeColor(data.badge),
                });
            }
        };
        getNickName();
    }, []);
    return (
        <div className="Main-BadgeComp">
            <FaMedal color={userData.badge_color} size="4em" className="icon" />
            <p>{userData.nickname}</p>
            <Link to="/study" className="button">
                바로 공부하러 가기
            </Link>
        </div>
    );
};

export default BadgeComp;
