import React, { useState } from "react";
import {
    TodayComp,
    Gongdada,
    Schedule,
} from "../components";
import "../css/Main.css";

const MainRight = () => {
    const [whichSection2, setWhichSection2] = useState("gongdada");

    return (
        <div className="MainRight">
            <header>
                <TodayComp></TodayComp>
            </header>
            <div className="MainRight-menu">
                <div onClick={() => {
                        setWhichSection2("gongdada");
                    }}>
                    <span>Gongdada</span>
                </div>
                <div onClick={() => {
                        setWhichSection2("schedule");
                    }}>
                    <span>Schedule</span>
                </div>
            </div>
            {whichSection2 === "gongdada" ? (
                <Gongdada></Gongdada>
            ) :  (
                <Schedule></Schedule>
            )}
        </div>
    );
};

export default MainRight;
