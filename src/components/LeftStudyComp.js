import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MonthlyComp, WeeklyComp, DailyComp } from "../components";

import "../css/Study.css";

const LeftStudyComp = () => {
    const [whichSchedule, setWhichSchedule] = useState("daily");

    return (
        <div className="LeftComp">
            <button
                onClick={() => {
                    setWhichSchedule("daily");
                }}
            >
                daily
            </button>
            <button
                onClick={() => {
                    setWhichSchedule("weekly");
                }}
            >
                weekly
            </button>
            <button
                onClick={() => {
                    setWhichSchedule("monthly");
                }}
            >
                monthly
            </button>
            {whichSchedule === "daily" ? (
                <DailyComp></DailyComp>
            ) : whichSchedule === "weekly" ? (
                <WeeklyComp></WeeklyComp>
            ) : (
                <MonthlyComp></MonthlyComp>
            )}
            {/* <Router>
                <div className="LeftComp-router">
                    <div>
                        <Link to="/tdl/monthly">monthly</Link>
                    </div>
                    <div>.....</div>
                    <div>
                        <Link to="/tdl/weekly">weekly</Link>
                    </div>
                    <div>.....</div>
                    <div>
                        <Link to="/tdl/">daily</Link>
                    </div>
                </div>
                <Route path="/tdl/" component={DailyComp} exact />
                <Route path="/tdl/weekly" component={WeeklyComp} />
                <Route path="/tdl/monthly" component={MonthlyComp} />
            </Router> */}
        </div>
    );
};

export default LeftStudyComp;
