import React, { useState } from "react";
import {
    MonthlyComp,
    WeeklyComp,
} from "../components";
import "../css/Main.css";

const Schedule = () => {

    return (
        <div className="Main-Schedule">
            <MonthlyComp></MonthlyComp>
            <WeeklyComp></WeeklyComp>
        </div>
    );
};

export default Schedule;
