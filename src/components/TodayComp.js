import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";

import { getApi } from "../api";
import { AuthContext } from "../App";

const TodayComp = () => {
    const authContext = useContext(AuthContext);
    const [todayStudy, setTodayStudy] = useState({
        tot_concent_rate: 30,
        tot_concent_time: "5h 30m",
        tot_time: "6h 06m",
    });
    const make2hmForm = (data) => {
        const l = data.split(":");
        return l[0] + "h " + l[1] + "m";
    };
    useEffect(() => {
        const getTodayInfo = async () => {
            console.log("uid: ", authContext.state);
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/today_concent/"
            );
            if (status === 200) {
                await setTodayStudy({
                    tot_concent_rate: data.tot_concent_rate,
                    tot_concent_time: make2hmForm(data.tot_concent_time),
                    tot_time: make2hmForm(data.tot_time),
                });
            } else {
                await alert("네트워크 에러");
            }
        };
        getTodayInfo();
    }, []);
    return (
        <div>
            <p className="small-title">오늘</p>
            <div className="Main-TodayComp">
                <div>
                    <small>집중도</small>
                    <p>{todayStudy.tot_concent_rate}%</p>
                </div>
                <div>
                    <small>집중 시간</small>
                    <p>{todayStudy.tot_concent_time}</p>
                </div>
                <div>
                    <small>총 공부시간</small>
                    <p>{todayStudy.tot_time}</p>
                </div>
            </div>
        </div>
    );
};

export default TodayComp;
