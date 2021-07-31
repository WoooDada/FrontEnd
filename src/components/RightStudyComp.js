//////////////////////////////////////////////////////////////////////////////
import React, { Component } from "react";
import ml5 from "ml5";
import "../css/Study.css";
import "../css/RightStudy.css";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useInterval from "@use-it/interval";
import { BtnContext } from "../pages/Study";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { FaMedal } from "react-icons/fa";

import { postApi, getApi } from "../api";
import { AuthContext } from "../App";
import { useContext } from "react";
//////////////////////////////////////////////////////////////////////////////
let classifier;

// 초 단위
const MODEL_APPLY_TIME = 0.5;
const POST_RESULT_TIME = 60;
const GET_STUDYMATES = 60;

//////////////////////////////////////////////////////////////////////////////

const RightStudyComp = () => {
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

    const [roomName, setRoomName] = useState("");
    const [roomTag, setRoomTag] = useState("");
    const [roomManner, setRoomManner] = useState("홀로로로로로롤 들어오세요 안녕안녕 다들 안녕 공부하자구요 규칙: 3번 어쩌구 지키기 ");
    const [inppl, setInppl] = useState(0);
    const [maxppl, setMaxppl] = useState(0);

    const studymates = [
        {
            nickname: '1인',
            concent_rate: '45%',
            concent_time: '1시간 32분',
            play_time: '1시간 47분',
        },
        {
            nickname: '2인',
            concent_rate: '90%',
            concent_time: '2시간 42분',
            play_time: '13분',
        },
        {
            nickname: '3인',
            concent_rate: '45%',
            concent_time: '1시간 32분',
            play_time: '1시간 47분',
        },
        {
            nickname: '4인',
            concent_rate: '90%',
            concent_time: '2시간 42분',
            play_time: '13분',
        },
        {
            nickname: '5인',
            concent_rate: '90%',
            concent_time: '2시간 42분',
            play_time: '13분',
        },
    ]


    useEffect(() => {
        // * 모델 불러오기 및 카메라 연결
        classifier = ml5.imageClassifier("./model/model.json", () => {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setLoaded(true);
                });
        });
    }, []);

    useEffect(() => {
        const getRoomInfo = async () => {
            const { status, data } = await getApi(
                {
                    // uid: authContext.state.uid,
                    // room_id 어캐주지
                },
                "/study/room_info/",
                authContext.state.token
            );
            if (status === 200) {
                await console.log(data);
                await setRoomName(data.room_name);
                await setRoomTag(data.room_tag);
                await setRoomManner(data.room_manner);
                await setInppl(data.in_ppl);
                await setMaxppl(data.max_ppl);
            } else {
                alert("네트워크 불안정");
            }
        };
        getRoomInfo();
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

    // 공부방 에티켓 더보기 버튼
    const [mannerMore, setMannerMore] = useState(false);
    const clickManner = () => {
        setMannerMore(!mannerMore);
    }

    useInterval(() => { // 1분마다 studymates들 정보 받아오기
        
        const getStudymates = async () => {
            const { status, data } = await postApi(
                {
                    // room_id 
                },
                "/study/study_mates/",
                authContext.state.token
            );
            // const { status, data } = { // Dummy 
            //     status: 200,
            // };
            if (status === 200) {
                // setStudymates(data.~~) map함수 이용
            } else {
                await alert("네트워크 오류");
            }
        };
        getStudymates();
        
    }, GET_STUDYMATES * 1000);

    const [matesIndex, setMatesIndex] = useState(0);
    const StudyMatesBox = ({ data }) => {
        return (
            <div className="Studymates-box">
                {data.nickname}
                {data.concent_rate} <br />
                공부시간: {data.concent_time}<br />
                딴짓시간: {data.play_time}<br />
            </div>
        )
    }

    const StudyMatesBox3 = ({ datas }) => {
        return (
            <div className="Studymates-box3">
                <StudyMatesBox data={datas[matesIndex]} />
                <StudyMatesBox data={datas[matesIndex + 1]} />
                <StudyMatesBox data={datas[matesIndex + 2]} />
            </div>
        )
    }

    const clickMatesLeftBtn = (e) => {
        e.preventDefault();
        var leftBtn = document.getElementById('Studymates-leftbtn');
        var rightBtn = document.getElementById('Studymates-rightbtn');
        // Studymates Index Change
        if (matesIndex !== 0) {
            setMatesIndex(matesIndex - 1);
        }
        // Button Color Change
        if (matesIndex <= 1) {
            leftBtn.style.color = '#E1E5EA';
            rightBtn.style.color = '#030303';
        } else {
            leftBtn.style.color = '#030303';
            rightBtn.style.color = '#030303';
        }

    }

    const clickMatesRightBtn = (e) => {
        e.preventDefault();
        var leftBtn = document.getElementById('Studymates-leftbtn');
        var rightBtn = document.getElementById('Studymates-rightbtn');
        // Studymates Index Change
        if (matesIndex !== studymates.length - 3) {
            setMatesIndex(matesIndex + 1);
        }
        // Button Color Change
        if (matesIndex >= studymates.length - 4) {
            leftBtn.style.color = '#030303';
            rightBtn.style.color = '#E1E5EA';
        } else {
            leftBtn.style.color = '#030303';
            rightBtn.style.color = '#030303';
        }
    }

    return (
        <div className="RightComp">
            <div className="RightComp-inner">
                <div className="RightComp-roominfo-group1">
                    <div className="RightComp-roominfo-group2">
                        <div className="RightComp-roomname">방이름{roomName}</div>
                        <div className="RightComp-ppl">{inppl}/{maxppl}</div>
                    </div>
                    <div className="RightComp-roomtag">#수능{roomTag}</div>
                </div>

                <p className="RightComp-manner" onClick={(e) => clickManner()}>
                    {
                        roomManner.length > 20 ?
                            (
                                mannerMore ?
                                    roomManner :
                                    roomManner.substr(0, 17) + '...'
                            )
                            :
                            roomManner
                    }
                </p>
            </div>
            <div className="RightComp-inner">
                {/* <p>현재: {isConcentrate()}</p> */}
                <video
                    className="Rstudy-video"
                    ref={videoRef}
                    style={{ transform: "scale(-1,1)" }}
                    width="300"
                    height="200"
                ></video>
                <p className="Rstudy-undervideo">
                    <span className="undervideo-span1">
                        집중: {getClassRate("C")}%
                    </span>
                    <span className="undervideo-span2">
                        공부시간: {study_time.tot_concent_time}
                    </span>
                    <span className="undervideo-span3">
                        딴짓시간: {study_time.tot_play_time}
                    </span>
                </p>
                {loaded && (
                    <button onClick={() => toggle()}>
                        {start ? "STOP" : "START"}
                    </button>
                )}
            </div>

            <div className="RightComp-inner">

                <div>공친이들</div>
                <div className="RightComp-studymates">
                    <div>
                        <RiArrowLeftSLine
                            id='Studymates-leftbtn'
                            size='2rem'
                            onClick={(e) => clickMatesLeftBtn(e)}
                            style={{ color: '#E1E5EA' }} />
                    </div>
                    <StudyMatesBox3 datas={studymates} />
                    <div>
                        <RiArrowRightSLine
                            id='Studymates-rightbtn'
                            size='2rem'
                            onClick={(e) => clickMatesRightBtn(e)}
                            style={{ color: '#030303' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightStudyComp;
