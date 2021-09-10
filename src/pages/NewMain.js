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

const NewMain = () => {
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
        </div>
    )
}

export default NewMain;