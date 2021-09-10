import React from "react";
import "../css/Main.css";
import {
    BadgeComp,
    ConcentGraphComp,
    MonthlyComp,
    WeeklyComp,
    TodayComp,
    RankComp,
    StudyBoxComp,
} from "../components";
import { useState } from "react";

const NewMain = () => {
    const [whichSection, setWhichSection] = useState("gongdada");
    return (
        <div className='Main'>
            <aside>
                <BadgeComp></BadgeComp>
                <div className='aside-menus'>
                    <p>Home</p>
                    <p>Main</p>
                    <p>Studyroom</p>
                    <p>Profile</p>
                    <p>Logout</p>
                </div>
                <div className='aside-bottom'>공다다</div>
            </aside>

            <header>
                <TodayComp></TodayComp>
            </header>
        </div>
    )
}

export default NewMain;