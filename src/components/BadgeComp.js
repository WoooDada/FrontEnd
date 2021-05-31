import React, { useEffect, useState, useContext } from "react";

import { FaMedal } from "react-icons/fa";

import "../css/Main.css";
import { AuthContext } from "../App";
import { getApi } from "../api";

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
    const [userData, setUserData] = useState({
        nickname: "우정짱",
        badge_color: "#c0c0c0",
    });
    useEffect(() => {
        const getNickName = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/badge_profile"
            );
            if (status === 200) {
                console.log(data);
                await setUserData({
                    nickname: data.nickname,
                    badge_color: getBadgeColor(data.badge),
                });
            } else {
                alert("네트워크 불안정");
            }
        };
        // getNickName();
    }, []);
    return (
        <div>
            <p className="small-title">뱃지</p>
            <div className="Main-BadgeComp">
                <FaMedal
                    color={userData.badge_color}
                    size="4em"
                    className="icon"
                />
                <small>
                    <br />
                    {userData.nickname}
                </small>
            </div>
        </div>
    );
};

export default BadgeComp;
