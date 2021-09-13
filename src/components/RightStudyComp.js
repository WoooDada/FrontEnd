import React from "react";
import ml5 from "ml5";
import "../css/Study.css";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useInterval from "@use-it/interval";
import { BtnContext } from "../pages/Study";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { postApi, getApi } from "../api";
import { AuthContext } from "../App";
import { useContext } from "react";
import logo from "../constants/imgs/newlogo.png"

let classifier;

// 초 단위
const MODEL_APPLY_TIME = 0.5;
const POST_RESULT_TIME = 60;
const GET_STUDYMATES = 5;

//////////////////////////////////////////////////////////////////////////////

const RightStudyComp = ({ match }) => {
    // console.log("rightcomp match!", match); // match: room_id

    const authContext = useContext(AuthContext);
    const btnContext = useContext(BtnContext);
    const videoRef = useRef();

    const [start, setStart] = useState(false);
    const [result, setResult] = useState([]);
    const resultlistRef = useRef({ C: 0, P: 0 });
    const [loaded, setLoaded] = useState(false);
    const [study_time, setStudy_time] = useState({
        tot_concent_time: "0:00",
        tot_play_time: "0:00",
    });
    // const [studymates, setStudymates] = useState([]);

    const initialStudymates = [
        {
            nickname: "친구를 기다리는 중...",
            concent_rate: "0%",
            concent_time: "0시간 00분",
            play_time: "0시간 00분",
        },
        // {
        //     nickname: "2인",
        //     concent_rate: "90%",
        //     concent_time: "2시간 42분",
        //     play_time: "13분",
        // },
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
    const [studymates, setStudymates] = useState(initialStudymates);

    useEffect(() => {
        // * 모델 불러오기 및 카메라 연결
        classifier = ml5.imageClassifier("../public/model/model.json", () => {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setLoaded(true);
                });
        });

        const getStudymates = async () => {
            const { status, data } = await getApi(
                {
                    room_id: match,
                },
                "/study/study_mate/",
                authContext.state.token
            );
            // const { status, data } = { // Dummy
            //     status: 200,
            // };
            console.log("status", status);
            await console.log("get study mates");
            await console.log(data);
            if (status === 200) {
                const new_studymates = data.studymates.map((sm, i) => ({
                    nickname: sm.nickname,
                    concent_rate: sm.concent_rate,
                    concent_time: sm.concent_time,
                    play_time: sm.play_time,
                }));
                console.log(new_studymates);
                await setStudymates(new_studymates);
            } else {
                await alert("네트워크 오류");
            }
        };
        getStudymates();
    }, []);

    useEffect(() => {
        const getStudymates = async () => {
            const { status, data } = await getApi(
                {
                    room_id: match,
                },
                "/study/study_mate/",
                authContext.state.token
            );
            // const { status, data } = { // Dummy
            //     status: 200,
            // };
            // console.log("status", status);
            // await console.log("get study mates");
            // await console.log(data);
            if (status === 200) {
                const new_studymates = data.studymates.map((sm, i) => ({
                    nickname: sm.nickname,
                    concent_rate: sm.concent_rate,
                    concent_time: sm.concent_time,
                    play_time: sm.play_time,
                }));
                await console.log("new_studymates:", new_studymates);
                await setStudymates(new_studymates);
            } else {
                await alert("네트워크 오류");
            }
        };
        getStudymates();
        setStudyMatesArrowColor();
    }, []);

    useInterval(() => {
        // * 0.5초마다 모델에 데이터 집어넣고 결과는 results에 저장
        if (classifier && start) {
            classifier.classify(videoRef.current, (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                setResult(results);
                resultlistRef.current[isConcentrate()] += 1;
            });
        }
    }, MODEL_APPLY_TIME * 1000);

    useInterval(() => {
        // * 60초마다 저장된 결과값 중 최대 클래스(집중 or 딴짓)를 서버에 포스트. 이후 저장된 결과값 클리어
        if (classifier && start) {
            // 주석 처리해주기
            const postModelResult = async () => {
                const { status, data } = await postApi(
                    {
                        uid: authContext.state.uid,
                        type:
                            resultlistRef.current["C"] >
                            resultlistRef.current["P"]
                                ? "C"
                                : "P",
                        time: new Date().toString().split(" ")[4].substr(0, 5),
                    },
                    "/study/study_data/",
                    authContext.state.token
                );
                // const { status, data } = { // Dummy Dummy
                //     status: 200,
                // };
                if (status === 200) {
                    await setStudy_time(data);
                    console.log(resultlistRef.current);
                    resultlistRef.current["C"] = 0;
                    resultlistRef.current["P"] = 0;
                } else {
                    await alert("네트워크 오류");
                }
            };
            // TODO post 시 이거 주석 처리 취소하기
            postModelResult();
        }
    }, POST_RESULT_TIME * 1000);

    const toggle = async () => {
        // * start stop POST
        // TODO TEST할 때 꼭 주석 처리 없애기
        const { status } = await postApi(
            {
                uid: authContext.state.uid,
                type: !start ? "start" : "stop",
            },
            "/study/studybutton/",
            authContext.state.token
        );
        // const { status, data } = {
        //     // Dummy Dummy
        //     status: 200,
        // };
        if (status === 200) {
            await console.log("바뀌기전 버튼값:", start);
            await btnContext.dispatch({ type: "btnClick", payload: !start });
            await setStart(!start); // start값 true <-> false 변경
            await setResult([]);
        } else {
            await alert("네트워크 에러!");
        }
    };
    const getClassRate = (ch) => {
        const concents = result.filter((c) => c.label[0] === ch);
        let tot = 0;
        for (let i = 0; i < concents.length; i++) {
            tot += concents[i].confidence;
        }
        return String(tot * 100).substring(0, 4);
    };
    const isConcentrate = () => {
        return getClassRate("C") > getClassRate("P") ? "C" : "P";
    };

    // 1분마다 studymates들 정보 받아오기
    useInterval(() => {
        const getStudymates = async () => {
            const { status, data } = await getApi(
                {
                    room_id: match,
                },
                "/study/study_mate/",
                authContext.state.token
            );
            // const { status, data } = { // Dummy
            //     status: 200,
            // };
            await console.log(data);
            if (status === 200) {
                await setStudymates(
                    data.studymates.map((sm, i) => ({
                        nickname: sm.nickname,
                        concent_rate: sm.concent_rate,
                        concent_time: sm.concent_time,
                        play_time: sm.play_time,
                    }))
                );
            } else {
                await alert("네트워크 오류");
            }
        };
        getStudymates();
        setStudyMatesArrowColor();
    }, GET_STUDYMATES * 1000);

    const setStudyMatesArrowColor = () => {
        var rightBtn = document.getElementById("Studymates-rightbtn");
        if (studymates.length > 3) {
            rightBtn.style.color = "#030303";
        } else {
            rightBtn.style.color = "#E1E5EA";
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
                        {data.concent_rate} </div>
                    <div className="SM-box-ct">
                        공부시간: {data.concent_time}{" "}
                    </div>
                    <div className="SM-box-pt">
                        딴짓시간: {data.play_time}
                    </div>
                </div>
            </div>
            
        );
    };

    const StudyMatesBox3 = ({ datas }) => {
        console.log("StudyMatesBox3", datas);
        return (
            <div className="Studymates-box3">
                {studymates.length === 1 ? (
                    <StudyMatesBox data={datas[matesIndex]} />
                ) : studymates.length === 2 ? (
                    <div className="Studymates-box3">
                        <StudyMatesBox data={datas[matesIndex]} />
                        <StudyMatesBox data={datas[matesIndex + 1]} />
                    </div>
                ) : (
                    <div className="Studymates-box3">
                        <StudyMatesBox data={datas[matesIndex]} />
                        <StudyMatesBox data={datas[matesIndex + 1]} />
                        <StudyMatesBox data={datas[matesIndex + 2]} />
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
            setMatesIndex(matesIndex - 1);
        }
        // Button Color Change
        if (studymates.length > 3) {
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
        if (studymates.length > 3) {
            if (matesIndex !== studymates.length - 3) {
                setMatesIndex(matesIndex + 1);
            }
            // Button Color Change
            if (matesIndex >= studymates.length - 4) {
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

    const postOut = async () => {
        const { status } = await postApi(
            {
                uid: authContext.state.uid,
                type: "stop",
            },
            "/study/studybutton/",
            authContext.state.token
        );
        // const { status, data } = {
        //     // Dummy Dummy
        //     status: 200,
        // };
        if (status === 200) {
            console.log("잘됨");
        } else {
            alert("네트워크 에러!");
        }
    };

    return (
        <div className="RightComp">
            <div className="VideoComp">
                {/* <p>현재: {isConcentrate()}</p> */}
                <video
                    className="CameraComp"
                    ref={videoRef}
                    style={{
                        transform: "scale(-1,1)",
                        width: "100%",
                    }}
                ></video>
                <p className="StudyStatus">
                    <span className="undervideo-span1">
                        현 집중도: {getClassRate("C")}%
                    </span>
                    <span className="undervideo-span2">
                        공부시간: {study_time.tot_concent_time}
                    </span>
                    <span className="undervideo-span3">
                        딴짓시간: {study_time.tot_play_time}
                    </span>
                </p>
                {loaded && (
                    <button
                        onClick={() => toggle()}
                        className={start ? "EndButton" : "StartButton"}
                    >
                        {start ? "공부 끝내기" : "공부 시작하기"}
                    </button>
                )}
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
                    {studymates ? (
                        <StudyMatesBox3 datas={studymates} />
                    ) : (
                        <div>친구가 없어요</div>
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
            <Link to={"/main"} className="GoOutBtn" onClick={() => postOut()}>
                {" "}
                공부방 퇴장하기
            </Link>
        </div>
    );
};

export default RightStudyComp;
