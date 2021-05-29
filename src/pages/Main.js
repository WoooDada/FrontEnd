import React from "react";
import {
    BadgeComp,
    ConcentGraphComp,
    MonthlyComp,
    WeeklyComp,
    TodayComp,
} from "../components";

import "../css/Main.css";

const Main = () => {
    return (
        <div className="Main">
            <div className="Main-UpperComp">
                <BadgeComp></BadgeComp>
                <TodayComp></TodayComp>
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
