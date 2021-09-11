import React, { useState } from "react";
import {
    TodayComp,
    Gongdada,
    Schedule,
} from "../components";
import "../css/Main.css";

const setBtnColor = (value) => {
    var gongdadaBtn = document.getElementById("menu-gongdada");
    var scheduleBtn = document.getElementById("menu-schedule");
    var gongdadaBack = document.getElementById("menu-gongdada-wrapper");
    var scheduleBack = document.getElementById("menu-schedule-wrapper");
   
    if (value === "gongdada") {
        gongdadaBtn.style.color = "#5F45FF";
        scheduleBtn.style.color = "#9893B7";
        gongdadaBack.style.backgroundColor = "#F5F7FD";
        scheduleBack.style.backgroundColor = "#ffffff";
    } else {
        gongdadaBtn.style.color = "#9893B7";
        scheduleBtn.style.color = "#5F45FF";
        gongdadaBack.style.backgroundColor = "#ffffff";
        scheduleBack.style.backgroundColor = "#F5F7FD";
    }
}

const MainRight = () => {
    const [whichSection2, setWhichSection2] = useState("gongdada");

    return (
        <div className="MainRight">
            <header>
                <TodayComp></TodayComp>
            </header>
            <div className="MainRight-menu">
                <div 
                    id="menu-gongdada-wrapper"
                    style={{backgroundColor: "#F5F7FD"}}
                    onClick={() => {
                        setWhichSection2("gongdada");
                        setBtnColor("gongdada");
                    }}>
                    <span id="menu-gongdada" style={{color: "#5F45FF"}}>Gongdada</span>
                </div>
                <div 
                    id="menu-schedule-wrapper"
                    style={{backgroundColor: "#ffffff"}}
                    onClick={() => {
                        setWhichSection2("schedule");
                        setBtnColor("schedule");
                    }}>
                    <span id="menu-schedule" style={{color: "#9893B7"}}>Schedule</span>
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
