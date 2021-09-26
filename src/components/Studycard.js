import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "../css/Main.css";
import "../css/StudyBox.css";
import logo from "../constants/imgs/newlogo.png";
import { AiFillLock } from "react-icons/ai";
import { BsFillPersonFill, BsLock } from "react-icons/bs";

const Studycard = ({
    room_id,
    room_name,
    inppl,
    maxppl,
    room_color,
    is_scret,
    room_tag,
    page,
    openModal,

    alertOverflow,
    setClickedRoomId,
}) => {
    const history = useHistory();

    const emojis = ["👍", "✊", "👊", "🤘", "🙏", "✋", "💪"];

    const style = {
        backgroundColor: room_color,
    };

    return (
        <div
            className={page === "main" ? "Studycard" : "Studycard-studyroom"}
            onClick={() => {
                if (inppl >= maxppl) {
                    alert("입장인원이 다 찼습니다. 다른 방에 접속해주세요!");
                } else if (is_scret === "T") {
                    openModal(room_id);
                } else {
                    history.push(`/study/${room_id}`);
                }
            }}
        >
            <div className="Studycard-upper">
                <div className={"UpperHeader"}>
                    <AiFillLock
                        color={is_scret === "T" ? "#9893B7" : "#ffffff"}
                        style={{
                            margin: "5px 0 0 5px",
                            // backgroundColor: "aqua",
                        }}
                    />
                    <div className="Studycard-ppl">
                        <BsFillPersonFill color="#9893B7" />
                        <div>
                            {inppl}/{maxppl}
                        </div>
                    </div>
                </div>

                <div className="Studycard-emoji">
                    {emojis[room_id % emojis.length]}
                </div>
            </div>
            <div style={style} className="Studycard-lower">
                <div className="Studycard-roomname">{room_name}</div>
                <div className="Studycard-roomtag">#{room_tag}</div>
            </div>
        </div>
    );
};

export default Studycard;
