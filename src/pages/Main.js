import React from "react";
import {
    BadgeComp,
    ConcentGraphComp,
    MonthlyComp,
    WeeklyComp,
} from "../components";

const Main = () => {
    return (
        <div>
            <BadgeComp></BadgeComp>
            <ConcentGraphComp></ConcentGraphComp>
            <MonthlyComp></MonthlyComp>
            <WeeklyComp></WeeklyComp>
        </div>
    );
};

export default Main;
