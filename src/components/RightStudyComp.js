import React from "react";
import "../css/Study.css";
import { useRef, useEffect, useState, useCallback } from "react";
import { BtnContext } from "../pages/Study";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { Link, useLocation, useHistory } from "react-router-dom";
import { postApi, getApi, putApi, deleteApi } from "../api";
import { AuthContext } from "../App";
import { useContext } from "react";
import Webcam from "react-webcam";
import logo from "../constants/imgs/newlogo.png";
import useInterval from "@use-it/interval";

// 초 단위
const MODEL_APPLY_TIME = 3;
//////////////////////////////////////////////////////////////////////////////

const RightStudyComp = ({ match }) => {
    const authContext = useContext(AuthContext);
    let room_id;
    const history = useHistory();
    const location = useLocation();
    const webcamRef = useRef(null);
    const yolo_ws = useRef(null);
    const mate_ws = useRef(null);

    const [start, setStart] = useState(false);
    const resultListRef = useRef([]);
    const resultDictRef = useRef({ C: 0, P: 0 });
    const [study_time, setStudy_time] = useState({
        tot_concent_time: "00:00",
        tot_play_time: "00:00",
    });
    const [studymates, setStudymates] = useState([]);

    const initialStudymates = [
        {
            nickname: "친구를 기다려요!",
            concent_rate: "0%",
            concent_time: "-시간 --분",
            play_time: "-시간 --분",
        },
        {
            nickname: "2인",
            concent_rate: "90%",
            concent_time: "2시간 42분",
            play_time: "13분",
        },
        // {
        //     nickname: "3인",
        //     concent_rate: "45%",
        //     concent_time: "1시간 32분",
        //     play_time: "1시간 47분",
        // },
        // {
        //     nickname: "4인",
        //     concent_rate: "90%",
        //     concent_time: "2시간 42분",
        //     play_time: "13분",
        // },
        // {
        //     nickname: "5인",
        //     concent_rate: "90%",
        //     concent_time: "2시간 42분",
        //     play_time: "13분",
        // },
    ];

    const getStudyRate = (resultDict) => {
        /*
            --준비--
            resultDictRef : 딕셔너리 형태
            resultListRef : 리스트 형태 
            --로직--
            학습률: 3초마다 반영해줌
            resultDictRef.length >= 40
                : 누적된 근 40개의 C, P의 비율로 계산(즉, 최근 2분간의 데이터로 계산)
            
            resultDictRef.length < 40
                : 누적된 근 resultDictRef.length개의 C, P의 비율로 계산

            3초마다: 
            resultDictRef.length > 40
                : result에서 1개 shift, resultDictRef 해당 타입 -1
        */
        const studyRate = resultDict.C / (resultDict.P + resultDict.C);
        return studyRate ? String(studyRate * 100).substring(0, 4) : "00.00";
    };

    /* 페이지 진입 시 */
    useEffect(() => {
        room_id = location.pathname.split("/")[2];
        const putIn = async () => {
            console.log(authContext.state.token);
            await postApi(
                {
                    room_id: room_id,
                    type: "ON",
                },
                "/study/room/",
                authContext.state.token
            )
                .then(({ status }) => {
                    if (status === 200) {
                        console.log("잘됨");
                    }
                })
                .catch((e) => {
                    alert("네트워크 에러!");
                });

            // if (status === 200) {
            //     console.log("잘됨");
            // } else {
            //     alert("네트워크 에러!");
            // }
        };
        putIn();
        setStudyMatesArrowColor();
        // * 스터디 메이트 관련 데이터 수신 소켓 연결
        const mate_url = `ws://13.209.194.64:8080/study/study_mate/`;
        mate_ws.current = new WebSocket(mate_url);
        mate_ws.current.onopen = () => {
            console.log("study mate socket opened");
            mate_ws.current.send(
                JSON.stringify({
                    uid: authContext.state.uid,
                    room_id: room_id,
                })
            );
        };
        mate_ws.current.onclose = () => console.log("study mate socket closed");
        mate_ws.current.onmessage = async (event) => {
            // 스터디 메이트 SOCKET(N초 주기)
            const data = JSON.parse(event.data);
            const new_studymates = await data.studymates.map((sm, i) => ({
                nickname: sm.nickname,
                concent_rate: sm.concent_rate,
                concent_time: sm.concent_time,
                play_time: sm.play_time,
            }));
            await setStudy_time({
                tot_concent_time: data.myStatus.concent_time,
                tot_play_time: data.myStatus.play_time,
            });
            await console.log("new_studymates:", new_studymates);
            await setStudymates(new_studymates);
        };

        return () => {
            if (yolo_ws.current && yolo_ws.current.readyState === 1) {
                yolo_ws.current.close(1000, "CLOSE YOLO WS");
            }
            if (mate_ws.current && mate_ws.current.readyState === 1) {
                mate_ws.current.close(1000, "STUDY BUTTON OFF");
            }
            putOut();
        };
    }, []);

    /* 이미지 3초마다 캡처해서 소켓으로 전달 */
    useInterval(() => {
        if (yolo_ws.current && yolo_ws.current.readyState === 1 && start) {
            const imageSrc = webcamRef.current.getScreenshot();
            // console.log(imageSrc);
            const msg = { message: imageSrc };
            yolo_ws.current.send(JSON.stringify(msg));
        } else return;
    }, MODEL_APPLY_TIME * 1000);

    /* 공부 시작하기/ 끝내기 버튼 클릭 시 호출 */
    const toggle = async () => {
        const cur_state = !start;
        await setStart(!start);
        if (cur_state) {
            // * 모델 이미지 전송 소켓 연결
            // TODO onopen, onclose 지우고 url 변경
            const yolo_url = `ws://13.209.194.64:8080/yolo/getmessage/`;
            yolo_ws.current = new WebSocket(yolo_url);
            // 디버깅 위한 코드
            yolo_ws.current.onopen = () => console.log("model ws opened");
            yolo_ws.current.onclose = (event) => {
                console.log(
                    "model ws closed",
                    "\nis clean close?:",
                    event.wasClean,
                    "\nclosed reason:",
                    event.reason
                );
            };
            yolo_ws.current.onmessage = (event) => {
                // 이미지 전달 후 C, P 데이터 받기
                console.log(event.data);
                const { type } = JSON.parse(event.data);
                resultDictRef.current[type] += 1;
                if (resultListRef.current.length > 40) {
                    // 최근 2분보다 더 오래된 타입의 데이터 abandon(버리기)
                    const old_type = resultListRef.current.shift();
                    resultDictRef.current[old_type] -= 1;
                }
            };
        } else if (yolo_ws.current && yolo_ws.current.readyState === 1) {
            // * [공부 끝내기 버튼 클릭 시] 소켓 연결 끊기
            yolo_ws.current.close(1000, "STUDY BUTTON OFF");
        }
    };

    const setStudyMatesArrowColor = () => {
        var leftBtn = document.getElementById("Studymates-leftbtn");
        var rightBtn = document.getElementById("Studymates-rightbtn");
        if (studymates.length > 2 && matesIndex === 0) {
            rightBtn.style.color = "#030303";
        }
        if (matesIndex === 0) {
            leftBtn.style.color = "#E1E5EA";
        }
    };

    const [matesIndex, setMatesIndex] = useState(0); // 좌우 화살표 변환에 필요한 matesIndex
    const StudyMatesBox = ({ data }) => {
        var crNum = data.concent_rate.slice(0, -1); // 집중도 % 떼고 숫자만 가져옴 = crNum
        crNum *= 1;
        return (
            <div className="Studymates-box">
                <div className="SM-box-col1">
                    <img className="SM-box-logo" src={logo} />
                    <div className="SM-box-name">{data.nickname}</div>
                </div>
                <div className="SM-box-col2">
                    <div className={crNum > 50 ? "SM-box-cr-C" : "SM-box-cr-P"}>
                        {data.concent_rate}{" "}
                    </div>
                    <div className="SM-box-ct">
                        공부시간: {data.concent_time}{" "}
                    </div>
                    <div className="SM-box-pt">딴짓시간: {data.play_time}</div>
                </div>
            </div>
        );
    };

    const StudyMatesBox3 = ({ datas }) => {
        // console.log("StudyMatesBox3", datas);
        return (
            <div className="Studymates-box3">
                {studymates.length === 1 ||
                matesIndex === studymates.length - 1 ? (
                    <StudyMatesBox data={datas[matesIndex]} />
                ) : (
                    <div className="Studymates-box3">
                        <StudyMatesBox data={datas[matesIndex]} />
                        <StudyMatesBox data={datas[matesIndex + 1]} />
                    </div>
                )}
            </div>
        );
    };

    const clickMatesLeftBtn = (e) => {
        e.preventDefault();
        var leftBtn = document.getElementById("Studymates-leftbtn");
        var rightBtn = document.getElementById("Studymates-rightbtn");
        // Studymates Index Change
        if (matesIndex !== 0) {
            setMatesIndex(matesIndex - 2);
        }
        // Button Color Change
        if (studymates.length > 2) {
            if (matesIndex <= 1) {
                leftBtn.style.color = "#E1E5EA";
                rightBtn.style.color = "#030303";
            } else {
                leftBtn.style.color = "#030303";
                rightBtn.style.color = "#030303";
            }
        }
    };

    const clickMatesRightBtn = (e) => {
        e.preventDefault();
        var leftBtn = document.getElementById("Studymates-leftbtn");
        var rightBtn = document.getElementById("Studymates-rightbtn");
        // Studymates Index Change
        if (studymates.length > 2) {
            if (matesIndex !== studymates.length - 2) {
                setMatesIndex(matesIndex + 2);
            }
            // Button Color Change
            if (matesIndex >= studymates.length - 3) {
                leftBtn.style.color = "#030303";
                rightBtn.style.color = "#E1E5EA";
            } else {
                leftBtn.style.color = "#030303";
                rightBtn.style.color = "#030303";
            }
        } else {
            leftBtn.style.color = "#E1E5EA";
            rightBtn.style.color = "#E1E5EA";
        }
    };

    const putOut = async () => {
        const { status } = await deleteApi(
            {
                room_id: room_id,
                type: "OFF",
            },
            "/study/room/",
            authContext.state.token
        );

        if (status === 200) {
            console.log("잘됨");
            history.push(`/main`);
        } else {
            alert("네트워크 에러!");
        }
    };

    return (
        <div className="RightComp">
            <div className="VideoComp">
                {/* <p>현재: {isConcentrate()}</p> */}
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    className="CameraComp"
                    videoConstraints={{
                        height: 300,
                        width: 416,
                    }}
                    style={{
                        transform: "scale(-1,1)",
                        width: "100%",
                    }}
                />

                <p className="StudyStatus">
                    <span className="undervideo-span1">
                        현 집중도: {getStudyRate(resultDictRef.current)}%
                        {/* 현 집중도: {getStudyRate({ C: 19, P: 21 })}% */}
                    </span>
                    <span className="undervideo-span2">
                        공부시간: {study_time.tot_concent_time}
                    </span>
                    <span className="undervideo-span3">
                        딴짓시간: {study_time.tot_play_time}
                    </span>
                </p>
                <button
                    onClick={() => {
                        toggle(start);
                    }}
                    className={start ? "EndButton" : "StartButton"}
                >
                    {start ? "공부 끝내기" : "공부 시작하기"}
                </button>
            </div>

            <div className="RightComp-inner">
                <h3 className="RightComp-studymates-title">STUDY MATES</h3>
                <div className="RightComp-studymates">
                    <div className="RightComp-studymates-leftbtn">
                        <RiArrowLeftSLine
                            id="Studymates-leftbtn"
                            size="2rem"
                            onClick={(e) => clickMatesLeftBtn(e)}
                            style={{ color: "#E1E5EA" }}
                        />
                    </div>
                    {studymates.length !== 0 ? (
                        <StudyMatesBox3 datas={studymates} />
                    ) : (
                        <div className={"RightComp-NoFriendText"}>
                            친구를 기다리는 중... 😭
                        </div>
                    )}
                    <div className="RightComp-studymates-rightbtn">
                        <RiArrowRightSLine
                            id="Studymates-rightbtn"
                            size="2rem"
                            onClick={(e) => clickMatesRightBtn(e)}
                            style={{ color: "#E1E5EA" }}
                        />
                    </div>
                </div>
            </div>
            <Link to={"/main"} className="GoOutBtn" onClick={() => putOut()}>
                {" "}
                공부방 퇴장하기
            </Link>
        </div>
    );
};

export default RightStudyComp;
