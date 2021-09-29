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
const MODEL_APPLY_TIME = 5;
const GET_MATE_INFO_TIME = 30;
//////////////////////////////////////////////////////////////////////////////

const RightStudyComp = ({ match, setRoomInPpl }) => {
    const authContext = useContext(AuthContext);
    const btnContext = useContext(BtnContext);
    let room_id;
    const history = useHistory();
    const location = useLocation();
    const webcamRef = useRef();

    const [start, setStart] = useState(false);
    const [resultDict, setResultDict] = useState({ C: 0, P: 0 });
    const resultListRef = useRef([]);
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
            resultDict : 딕셔너리 형태
            resultListRef : 리스트 형태 
            --로직--
            학습률: 3초마다 반영해줌
            resultDict.length >= 20
                : 누적된 근 40개의 C, P의 비율로 계산(즉, 최근 2분간의 데이터로 계산)
            
            resultDict.length < 20
                : 누적된 근 resultDict.length개의 C, P의 비율로 계산

            3초마다: 
            resultDict.length > 20
                : result에서 1개 shift, resultDict 해당 타입 -1
        */
        const studyRate = resultDict.C / (resultDict.P + resultDict.C);
        return studyRate ? String(studyRate * 100).substring(0, 4) : "00.0";
    };

    /* 페이지 진입 시 */
    useEffect(() => {
        resultListRef.current = [];

        room_id = location.pathname.split("/")[2];

        /* 공부방 입장 알림 */
        const postRoomIn = async () => {
            console.log("post", room_id);
            await postApi(
                {
                    room_id: room_id,
                    uid: authContext.state.uid,
                },
                "/study/room/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log("/study/room/", status);
                        console.log(data);
                        const new_studymates = data.studymates.map((sm, i) => ({
                            nickname: sm.nickname,
                            concent_rate: sm.concent_rate,
                            concent_time: sm.concent_time,
                            play_time: sm.play_time,
                        }));
                        setStudy_time({
                            tot_concent_time: data.myStatus.concent_time,
                            tot_play_time: data.myStatus.play_time,
                        });
                        setStudymates(new_studymates);
                        setRoomInPpl(data.studymates.length + 1);
                    }
                })
                .catch((e) => {
                    alert("공부방 입장 네트워크 에러!");
                });

            // if (status === 200) {
            //     console.log("잘됨");
            // } else {
            //     alert("네트워크 에러!");
            // }
        };
        postRoomIn();
        setStudyMatesArrowColor();

        return async () => {
            await putOut();
        };
    }, []);

    /* 스터디 메이트 30초마다 GET으로 정보 가져오기 */
    useInterval(() => {
        const getMateInfo = async () => {
            room_id = location.pathname.split("/")[2];
            console.log("get mate info:", room_id);
            await getApi(
                {
                    room_id: room_id,
                    uid: authContext.state.uid,
                },
                "/study/study_mate",
                authContext.state.token
            )
                .then(({ state, data }) => {
                    console.log(data);
                    const new_studymates = data.studymates.map((sm, i) => ({
                        nickname: sm.nickname,
                        concent_rate: sm.concent_rate,
                        concent_time: sm.concent_time,
                        play_time: sm.play_time,
                    }));
                    setStudy_time({
                        tot_concent_time: data.myStatus.concent_time,
                        tot_play_time: data.myStatus.play_time,
                    });
                    setStudymates(new_studymates);
                    setRoomInPpl(data.studymates.length + 1);
                })
                .catch((e) => {
                    alert("네트워크 에러!");
                });
        };
        getMateInfo();
    }, GET_MATE_INFO_TIME * 1000);

    /* 이미지 5초마다 캡처해서 GET REST API으로 전달 */
    const getImgCP = async (msg, token) => {
        await postApi(msg, "/yolo/getmessage/", token)
            .then(({ status, data }) => {
                return { status, data };
            })
            .catch((e) => {
                return { status: 400 };
            });
    };

    useInterval(() => {
        if (start) {
            const imageSrc = webcamRef.current.getScreenshot();
            const msg = { message: imageSrc, uid: authContext.state.uid };
            const getImgCP = async () => {
                await postApi(msg, "/yolo/getmessage/", authContext.state.token)
                    .then(({ status, data }) => {
                        const { type } = data;
                        console.log(type);
                        setResultDict((prev) => {
                            let rst = Object.assign({}, prev);
                            rst[type] = prev[type] + 1;
                            return rst;
                        });
                        resultListRef.current.push(type);
                        if (resultListRef.current.length > 12) {
                            // 최근 1분보다 더 오래된 타입의 데이터 abandon(버리기)
                            const old_type = resultListRef.current.shift();

                            setResultDict((prev) => {
                                let rst = Object.assign({}, prev);
                                rst[old_type] = prev[old_type] - 1;

                                return rst;
                            });
                        }
                    })
                    .catch((e) => {
                        return { status: 400 };
                    });
            };
            getImgCP();
        } else return;
    }, MODEL_APPLY_TIME * 1000);

    /* 공부 시작하기/ 끝내기 버튼 클릭 시 호출 */
    const toggle = async () => {
        const cur_state = !start;
        await btnContext.dispatch({ type: "btnClick", payload: !start });
        await setStart(cur_state);
        if (!cur_state) {
            setResultDict({ C: 0, P: 0 });
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
                        {data.concent_rate.substring(0, 3) === "100"
                            ? "100"
                            : data.concent_rate.substring(0, 4)}
                        {" %"}
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
        await deleteApi(
            {
                room_id: room_id,
                type: "OFF",
            },
            "/study/room/",
            authContext.state.token
        )
            .then(({ status }) => {
                history.push(`/main`);
            })
            .catch((e) => {
                console.log("바로 삭제 안됨");
            });
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
                        현 집중도: {getStudyRate(resultDict)}%
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
