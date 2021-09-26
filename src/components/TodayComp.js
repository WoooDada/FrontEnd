import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { getApi } from "../api";
import { AuthContext } from "../App";

const TodayComp = () => {
    const authContext = useContext(AuthContext);
    const [todayStudy, setTodayStudy] = useState({
        tot_concent_rate: 0,
        tot_concent_time: "0h 00m",
        tot_time: "0h 00m",
    });
    const make2hmForm = (data) => {
        const l = data.split(":");
        return l[0] + "h " + l[1] + "m";
    };
    useEffect(() => {
        const getTodayInfo = async () => {
            console.log("uid: ", authContext.state);
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/today_concent/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    setTodayStudy({
                        tot_concent_rate: data.tot_concent_rate,
                        tot_concent_time: make2hmForm(data.tot_concent_time),
                        tot_time: make2hmForm(data.tot_time),
                    });
                })
                .catch((e) => {
                    console.log(e.response);
                });
        };
        getTodayInfo();
    }, []);
    return (
        <div className="TodayComp">
            <p className="small-title">오늘 당신의 공부량은...</p>
            <p className="stitle">집중도</p>
            <p className="today-percent" style={{ color: "#000000" }}>
                {todayStudy.tot_concent_rate}%
            </p>
            <p className="stitle">공부 시간</p>
            <p className="today-percent" style={{ color: "#5F45FF" }}>
                {todayStudy.tot_concent_time}
            </p>
            <p className="stitle">딴짓 시간</p>
            <p className="today-percent" style={{ color: "#F68059" }}>
                {todayStudy.tot_time}
            </p>
        </div>
    );
};

export default TodayComp;
