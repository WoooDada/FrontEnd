import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";

const Socket = () => {
    const ws = useRef(null);
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    useEffect(() => {
        console.log("여기는 소켓");
        // * 웹 소켓 연결하기
        const url = "ws://13.209.194.64:8080/yolo/getmessage/";
        ws.current = new WebSocket(url);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("from server: !!!!!!!!!!!!!!", message);
        };
        // setWs(createWebSocket());
        return () => {
            if (ws.current) {
                ws.current = null;
            }
        };
    }, []);
    function sendMessage() {
        const msg = { message: imgSrc, nickname: "우정짱" };
        if (!ws.current) return;
        console.log("send할 꺼야아아ㅏ", msg);
        // console.log(ws.current.send);
        ws.current.send(JSON.stringify(msg));
    }
    return (
        <div>
            <button onClick={sendMessage}>소켓 메시지 보내기</button>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
            />
            <button onClick={capture}>Capture photo</button>
            {imgSrc && <img src={imgSrc} />}
            <p>여기는 소켓 페이지</p>
        </div>
    );
};

export default Socket;
