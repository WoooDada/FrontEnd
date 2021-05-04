import React from "react";
import {
    BadgeComp,
    ConcentGraphComp,
    MonthlyComp,
    WeeklyComp,
} from "../components";

import "../css/Main.css";

const Main = () => {
    return (
        <div className="Main">
            <div className="Main-UpperComp">
                <BadgeComp></BadgeComp>
                <ConcentGraphComp></ConcentGraphComp>
            </div>
            <div className="Main-LowerComp">
                <MonthlyComp></MonthlyComp>
                <WeeklyComp></WeeklyComp>
            </div>
        </div>
    );
};

export default Main;
