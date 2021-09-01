import React, { useRef, useEffect, useState } from "react";

const Socket = () => {
    const ws = useRef(null);
    // const [ws, setWs] = useState(null);
    // const createWebSocket = () => {
    //     const url = "ws://13.209.194.64:8080/yolo/getmessage/";
    //     let ws = new WebSocket(url);
    //     ws.onopen = () => console.log("ws opened");
    //     ws.onclose = () => console.log("ws closed");
    //     ws.onmessage = (event) => {
    //         const message = JSON.parse(event.data);
    //         console.log("from server: ", message);
    //     };
    //     return ws;
    // };
    useEffect(() => {
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
                ws.current.closed();
            }
        };
    }, []);
    function sendMessage() {
        const msg = { message: "hello from client" };
        if (!ws.current) return;
        console.log("send할 꺼야아아ㅏ", msg);
        console.log(ws.current.send);
        ws.current.send(JSON.stringify(msg));
    }
    return (
        <div>
            <button onClick={sendMessage}>소켓 메시지 보내기</button>
            <p></p>
        </div>
    );
};

export default Socket;
