import React, { useEffect, useState, useContext } from "react";
import {
    XYPlot,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    XAxis,
    YAxis,
} from "react-vis";
import Modal from "react-modal";
import { BsFillSquareFill } from "react-icons/bs";

import "../css/MainGraph.css";
import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";

const initialData = {
    concent: [
        { x: "월", y: 0 },
        { x: "화", y: 0 },
        { x: "수", y: 0 },
        { x: "목", y: 0 },
        { x: "금", y: 0 },
        { x: "토", y: 0 },
        { x: "일", y: 0 },
    ],
    play: [
        { x: "월", y: 0 },
        { x: "화", y: 0 },
        { x: "수", y: 0 },
        { x: "목", y: 0 },
        { x: "금", y: 0 },
        { x: "토", y: 0 },
        { x: "일", y: 0 },
    ],
};
const dowEn2Kr = () => {
    const dow_seq_list = ["월", "화", "수", "목", "금", "토", "일"];
    const right_ans = [];
    let i;
    const left_ans = [];
    const enDow_list = {
        Fri: "금",
        Sun: "일",
        Sat: "토",
        Mon: "월",
        Tue: "화",
        Wed: "수",
        Thu: "목",
    };
    const enDow = new Date().toDateString().split(" ")[0];
    const today = enDow_list[enDow];
    for (i = 0; i < dow_seq_list.length; i++) {
        right_ans.push(dow_seq_list[i]);
        if (dow_seq_list[i] === today) {
            break;
        }
    }
    i++;
    while (i < dow_seq_list.length) {
        left_ans.push(dow_seq_list[i]);
        i++;
    }
    return left_ans.concat(right_ans);
};

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

const modalContentStyles = {
    wrapper: {
        paddingTop: "2vh",
        paddingLeft: "1vh",
    },
    item: {
        display: "flex",
        alignItems: "center",
    },
};

const ConcentGraphComp = () => {
    var subtitle = "";
    const [modalIsOpen, setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = "#E9B2BC";
    }

    function closeModal() {
        setIsOpen(false);
    }
    const [graphData, setGraphData] = useState(initialData);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        const getGraphData = async () => {
            const weekxs = dowEn2Kr();
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/concent_graph",
                authContext.state.token
            );
            if (status === 200) {
                await console.log(data.graph);
                // 무작위 월~일 데이터: 그 날 기준 6일 전까지로 정렬.
                await setGraphData({
                    concent: weekxs.map((x, i) => ({
                        x: x,
                        y: parseInt(
                            data.graph.filter((v, _) => x === v.date)[0]
                                .concent_time
                        ),
                    })),
                    play: weekxs.map((x, i) => ({
                        x: x,
                        y: parseInt(
                            data.graph.filter((v, _) => x === v.date)[0]
                                .play_time
                        ),
                    })),
                });
            } else {
                await alert("인터넷 연결이 불안정합니다.");
            }
        };
        getGraphData();
    }, []);
    return (
        <div className="Main-ConcentGraph-Wrapper">
            <p className="small-title">집중 그래프</p>
            <div className="Main-ConcentGraphComp" onClick={openModal}>
                <XYPlot
                    height={150}
                    width={500}
                    stackBy="y"
                    xType="ordinal"
                    className="graph"
                >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries
                        color="#C4C4C4"
                        barWidth={0.3}
                        data={graphData.concent}
                    />
                    <VerticalBarSeries
                        color="#ffc9c9"
                        opacity={50}
                        barWidth={0.3}
                        data={graphData.play}
                    />
                </XYPlot>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
                    집중 그래프 설명
                </h2>
                <div>
                    집중 그래프는 총 집중시간과 총 딴짓시간이 일일로 표기됩니다.{" "}
                    <br></br>
                    <div style={modalContentStyles.wrapper}>
                        <span
                            style={{
                                ...modalContentStyles.item,
                                marginBottom: "1vh",
                            }}
                        >
                            <BsFillSquareFill color="#ffc9c9" />: 총
                            딴짓시간(단위: 분)
                        </span>
                        <span style={modalContentStyles.item}>
                            <BsFillSquareFill color="#C4C4C4" />: 총
                            집중시간(단위: 분)
                        </span>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ConcentGraphComp;
