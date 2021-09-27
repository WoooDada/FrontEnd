import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";
import { postApi } from "../api";

import { AiFillLock } from "react-icons/ai";
import { BsFillPersonFill, BsLock } from "react-icons/bs";

import "../css/Main.css";
import "../css/StudyBox.css";

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
    const authContext = useContext(AuthContext);
    const [pwd, setPwd] = useState("");
    const [cardType, setCardType] = useState("NORMAL");
    // "NORMAL", "PWDINPUT" 둘 중 하나

    const emojis = ["👍", "✊", "👊", "🤘", "🙏", "✋", "💪"];

    const style = {
        backgroundColor: room_color,
    };

    const onChangePwd = (e) => {
        setPwd(e.target.value);
    };

    const getIsCorrectPwd = async () => {
        // * REAL

        await postApi(
            { room_id, password: pwd },
            "/studyroom/password/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                if (data.correct === "T") {
                    history.push(`/study/${room_id}`);
                } else {
                    // 비밀번호가 틀림: Link로 바로 /study 페이지로 넘어가면 안됨.
                    alert("비밀번호가 틀렸습니다. 다시 입력해주세요!");
                    setPwd("");
                }
            })
            .catch((e) => {
                alert("네트워크 에러");
            });

        // * dummy

        // const { status, data } = {
        //     status: 200,
        //     data: {
        //         correct: "T",
        //     },
        // };
    };

    return (
        <div
            className={page === "main" ? "Studycard" : "Studycard-studyroom"}
            onClick={() => {
                if (inppl >= maxppl) {
                    alert("입장인원이 다 찼습니다. 다른 방에 접속해주세요!");
                } else if (is_scret) {
                    setCardType("PWDINPUT");
                } else {
                    history.push(`/study/${room_id}`);
                }
            }}
        >
            <div>
                <div className="Studycard-upper">
                    <div className={"UpperHeader"}>
                        <AiFillLock
                            color={is_scret ? "#9893B7" : "#ffffff"}
                            style={{
                                marginLeft: "5px",
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
                {cardType === "NORMAL" ? (
                    <div style={style} className="Studycard-lower">
                        <div className="Studycard-roomname">{room_name}</div>
                        <div className="Studycard-roomtag">#{room_tag}</div>
                    </div>
                ) : (
                    <div className="Pwdcard-lower" style={style}>
                        <input
                            name="room_pwd"
                            type="password"
                            placeholder="PASSWORD"
                            onChange={onChangePwd}
                        ></input>
                        <button
                            onClick={() => {
                                getIsCorrectPwd();
                            }}
                        >
                            입장
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Studycard;
