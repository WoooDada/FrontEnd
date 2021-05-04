import React from "react";
import { Link } from "react-router-dom";
import { FaMedal } from "react-icons/fa";

import "../css/Main.css";

const BadgeComp = () => {
    return (
        <div className="Main-BadgeComp">
            <FaMedal color="gold" size="4em" className="icon" />
            <p>닉네임</p>
            <Link to="/study" className="button">
                바로 공부하러 가기
            </Link>
        </div>
    );
};

export default BadgeComp;
