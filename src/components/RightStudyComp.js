import React from "react";
import ml5 from "ml5";
import "../css/Study.css";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useInterval from "@use-it/interval";

let classifier;

const RightStudyComp = () => {
    const videoRef = useRef();
    const [start, setStart] = useState(false);
    const [result, setResult] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
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
        if (classifier && start) {
            classifier.classify(videoRef.current, (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                setResult(results);
            });
        }
    }, 500);
    const toggle = () => {
        setStart(!start);
        setResult([]);
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
        return getClassRate("C") > getClassRate("P") ? "빡집중" : "딴짓중";
    };

    return (
        <div className="RightComp">
            <h4>
                고난에 지는 것은 수치가 아니다.
                <br /> 쾌락에 지는 것이야말로 수치다.
            </h4>
            <div>
                <p>집중: {getClassRate("C")}%</p>
                <p>현재: {isConcentrate()}</p>
                <video
                    ref={videoRef}
                    style={{ transform: "scale(-1,1)" }}
                    width="200"
                    height="150"
                ></video>
                <p>
                    공부시간: 3시간 5분
                    <br />
                    휴식시간: 1시간 13분
                </p>
                {loaded && (
                    <button onClick={() => toggle()}>
                        {start ? "Stop" : "Start"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RightStudyComp;
