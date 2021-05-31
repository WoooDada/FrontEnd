import React from "react";
import {
    BadgeComp,
    ConcentGraphComp,
    MonthlyComp,
    WeeklyComp,
    TodayComp,
} from "../components";
import { Link } from "react-router-dom";
import "../css/Main.css";

function randomItem() {
    return wise_say[Math.floor(Math.random() * wise_say.length)];
}

const wise_say = [
    "삶이 있는 한 희망은 있다. -키케로",
    "진정으로 웃으려면 고통을 참아야하며, 나아가 고통을 즐길 줄 알아야 한다. -찰리 채플린",
    "피할수 없으면 즐겨라. –로버트 엘리엇",
    "먼저 자신을 비웃어라. 다른 사람이 당신을 비웃기 전에 –엘사 맥스웰",
    "절대 어제를 후회하지 마라. 인생은 오늘의 나 안에 있고 내일은 스스로 만드는 것이다. -L.론허바드",
    "한번의 실패와 영원한 실패를 혼동하지 마라. -F.스콧 핏제랄드",
    "계단을 밟아야 계단 위에 올라설수 있다. -터키속담",
    "행복은 습관이다, 그것을 몸에 지니라. -허버드",
    "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다. -앙드레 말로",
    "성공의 비결은 단 한 가지, 잘할 수 있는 일에 광적으로 집중하는 것이다. -톰 모나건",
];

const Main = () => {
    return (
        <div className="Main">
            <div className="Main-Banner">
                <small>"{randomItem()}"</small>
                <Link to="/study" className="button">
                    공부방 입장하기
                </Link>
            </div>
            <div className="Main-Body">
                <div className="Main-big-wrapper">
                    <h3>공부 현황</h3>
                    <div className="Main-Status">
                        <BadgeComp></BadgeComp>
                        <TodayComp></TodayComp>
                        <ConcentGraphComp></ConcentGraphComp>
                    </div>
                </div>
                <div className="Main-big-wrapper">
                    <h3>스케줄</h3>
                    <div className="Main-Schedule">
                        <MonthlyComp></MonthlyComp>
                        <WeeklyComp></WeeklyComp>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
