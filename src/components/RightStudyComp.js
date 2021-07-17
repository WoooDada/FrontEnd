//////////////////////////////////////////////////////////////////////////////
import React, { Component } from "react";
import ml5 from "ml5";
import "../css/Study.css";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useInterval from "@use-it/interval";
import { BtnContext } from "../pages/Study";

import { postApi } from "../api";
import { AuthContext } from "../App";
import { useContext } from "react";
//////////////////////////////////////////////////////////////////////////////
let classifier;

// 초 단위
const MODEL_APPLY_TIME = 0.5;
const POST_RESULT_TIME = 60;

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

    return (
        <div className="RightComp">
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
        </div>
    );
};

export default RightStudyComp;
