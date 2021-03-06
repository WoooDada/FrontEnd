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
}) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const [pwd, setPwd] = useState("");
    const [cardType, setCardType] = useState("NORMAL");
    // "NORMAL", "PWDINPUT" λ μ€ νλ

    const emojis = ["π", "β", "π", "π€", "π", "β", "πͺ"];

    const style = {
        backgroundColor: room_color,
    };

    const en2KrRoomTag = (room_tag) => {
        switch (room_tag) {
            case "college":
                return "λνμ";
            case "sat":
                return "μλ₯";
            case "gongmuwon":
                return "κ³΅λ¬΄μ";
            case "employment":
                return "μ·¨μ λ° μ΄μ§";
            case "certificate":
                return "μκ²©μ¦";
            case "language":
                return "μ΄ν";
            default:
                return "κΈ°ν";
        }
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
                    // λΉλ°λ²νΈκ° νλ¦Ό: Linkλ‘ λ°λ‘ /study νμ΄μ§λ‘ λμ΄κ°λ©΄ μλ¨.
                    alert("λΉλ°λ²νΈκ° νλ Έμ΅λλ€. λ€μ μλ ₯ν΄μ£ΌμΈμ!");
                    setPwd("");
                }
            })
            .catch((e) => {
                alert("λ€νΈμν¬ μλ¬");
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
                    alert("μμ₯μΈμμ΄ λ€ μ°Όμ΅λλ€. λ€λ₯Έ λ°©μ μ μν΄μ£ΌμΈμ!");
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
                        <div className="Studycard-roomtag">
                            #{en2KrRoomTag(room_tag)}
                        </div>
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
                            μμ₯
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Studycard;
