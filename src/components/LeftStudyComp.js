import React from "react";
import { useState } from "react";
import { MonthlyComp, WeeklyComp, DailyComp } from "../components";

import "../css/Study.css";

const PrintToday = () => {
    const today = new Date();
    var strDay = "";
    switch (today.getDay()) {
        case 0:
            strDay = "(일)"; break;
        case 1:
            strDay = "(월)"; break;
        case 2:
            strDay = "(화)"; break;
        case 3:
            strDay = "(수)"; break;
        case 4:
            strDay = "(목)"; break;
        case 5:
            strDay = "(금)"; break;
        case 6:
            strDay = "(토)"; break;
    }
    const result = "".concat(
        today.getFullYear(),
        "년 ",
        today.getMonth() + 1,
        "월 ",
        today.getDate(),
        "일 ",
        strDay
    );
    return <div>{result}</div>;
};

const LeftStudyComp = () => {
    const [whichSchedule, setWhichSchedule] = useState("daily");

    return (
        <div className="LeftComp">
            <div className="LeftComp-upper">
                <h3><PrintToday /></h3>
                <div className="LeftComp-buttons">
                    <button className="LeftComp-button"
                        onClick={() => {
                            setWhichSchedule("daily");
                        }}
                    >
                        일
            </button>
                    <button className="LeftComp-button"
                        onClick={() => {
                            setWhichSchedule("weekly");
                        }}
                    >
                        주
            </button>
                    <button className="LeftComp-button"
                        onClick={() => {
                            setWhichSchedule("monthly");
                        }}
                    >
                        월
            </button>
                </div>
                </div>
                {whichSchedule === "daily" ? (
                    <DailyComp></DailyComp>
                ) : whichSchedule === "weekly" ? (
                    <WeeklyComp></WeeklyComp>
                ) : (
                    <MonthlyComp></MonthlyComp>
                )}

            
        </div>
    );
};

export default LeftStudyComp;
