import React from "react";
import { useState, useEffect, useContext } from "react";

import { MonthlyComp, WeeklyComp, DailyComp } from "../components";
import { postApi, getApi } from "../api";
import { AuthContext } from "../App";

import "../css/Study.css";
import TenMinPlanner from "./TenMinPlanner";

import { AiFillLock } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";

const PrintToday = () => {
    const today = new Date();
    var strDay = "";
    switch (today.getDay()) {
        case 0:
            strDay = "(일)";
            break;
        case 1:
            strDay = "(월)";
            break;
        case 2:
            strDay = "(화)";
            break;
        case 3:
            strDay = "(수)";
            break;
        case 4:
            strDay = "(목)";
            break;
        case 5:
            strDay = "(금)";
            break;
        case 6:
            strDay = "(토)";
            break;
        default:
            strDay = "";
            break;
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

const initialRoomData = {
    room_name: "",
    room_tag: "",
    room_manner: "",
    // "홀로로로로로롤 들어오세요 안녕안녕 다들 안녕 공부하자구요 규칙: 1. 아침 10시 기상 2.숙제해오기 3번 어쩌구 지키기 4. 이거 다 안지키면 삼진아웃입니다잉 아셨죠? 아웃이라고요 아웃!!! ",
    in_ppl: 1,
    max_ppl: 5,
};

const LeftStudyComp = ({ match, roomInPpl }) => {
    const [whichSchedule, setWhichSchedule] = useState("daily");
    const [roomData, setRoomData] = useState(initialRoomData);
    const [mannerMore, setMannerMore] = useState(false); // 공부방 에티켓 더보기 버튼
    const RoomTag2Ko = (room_tag) => {
        switch (room_tag) {
            case "language":
                return "어학";
                break;
            case "college":
                return "대학";
                break;
            case "sat":
                return "수능";
                break;
            case "gongmuwon":
                return "공무원";
                break;
            case "employment":
                return "취업 및 이직";
                break;
            case "certificate":
                return "자격증";
                break;
            case "etc":
                return "기타";
                break;
            default:
                return "열공";
                break;
        }
    };

    const authContext = useContext(AuthContext);
    useEffect(() => {
        const getRoomInfo = async () => {
            await getApi(
                {
                    room_id: match,
                },
                "/study/room_info/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log("room_info:", data);
                        setRoomData(data);
                    }
                })
                .catch((e) => {
                    alert("네트워크 불안정");
                });
        };
        getRoomInfo();
    }, [match]);

    const clickManner = () => {
        setMannerMore(!mannerMore);
    };

    return (
        <div className="LeftComp">
            <div className="RoomInfo">
                <div className="Header">
                    <div className="RoomTitle">
                        <h3>{roomData.room_name}</h3>
                        {roomData.room_issecret ? (
                            <AiFillLock className="LockIcon" />
                        ) : null}
                        <h5 style={{ marginLeft: "10px" }}>
                            #{RoomTag2Ko(roomData.room_tag)}
                        </h5>
                    </div>
                    <h5>
                        <span className="RoomPpl">
                            <BsFillPersonFill />
                            {roomInPpl}/{roomData.max_ppl}
                        </span>
                    </h5>
                </div>
                <p onClick={(e) => clickManner()}>
                    {roomData.room_manner !== null &&
                    roomData.room_manner.length > 80
                        ? mannerMore
                            ? roomData.room_manner
                            : roomData.room_manner.substr(0, 79) + "..."
                        : roomData.room_manner}
                </p>
            </div>

            <div className="Planner">
                <div className="Tenmin">
                    <h5>10 minute planner</h5>
                    <TenMinPlanner />
                </div>
                <div className="Schedule">
                    <div className="Header">
                        <h5>
                            <PrintToday />
                        </h5>
                        <div className="Schedule-buttons">
                            {[
                                { kr: "일", en: "daily" },
                                { kr: "주", en: "weekly" },
                                { kr: "월", en: "monthly" },
                            ].map((btnType) => (
                                <button
                                    key={btnType.en}
                                    className={
                                        whichSchedule === btnType.en
                                            ? "SelectedBtn"
                                            : "NotSelectedBtn"
                                    }
                                    onClick={() => {
                                        setWhichSchedule(btnType.en);
                                    }}
                                >
                                    {btnType.en}
                                </button>
                            ))}
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
            </div>
        </div>
    );
};

export default LeftStudyComp;
