import React from "react";
import { useState, useEffect, useContext } from "react";
import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";

const initialStudyData = [
    { rank: 54, nickname: "우정쨩", tot_concent_time: "1:53" }, // 내 순위
    { rank: 1, nickname: "이진헤어", tot_concent_time: "14:53" },
    { rank: 2, nickname: "닭닭", tot_concent_time: "11:00" },
    { rank: 3, nickname: "박씨네", tot_concent_time: "10:30" },
    { rank: 4, nickname: "박신혜", tot_concent_time: "9:03" },
    { rank: 5, nickname: "이진말고일진", tot_concent_time: "8:48" },
    { rank: 6, nickname: "삼진아웃", tot_concent_time: "8:40" },
    { rank: 7, nickname: "안녕", tot_concent_time: "5:11" },
    { rank: 8, nickname: "나는야", tot_concent_time: "5:00" },
    { rank: 9, nickname: "공부중", tot_concent_time: "4:44" },
    { rank: 10, nickname: "딴짓중", tot_concent_time: "3:33" },
];

const initialPlayData = [
    { rank: 74, nickname: "우정쨩", tot_concent_rate: "35.12%" }, // 내 순위
    { rank: 1, nickname: "이진헤어", tot_concent_rate: "0.12%" },
    { rank: 2, nickname: "닭닭", tot_concent_rate: "1.11%" },
    { rank: 3, nickname: "박씨네", tot_concent_rate: "1.12%" },
    { rank: 4, nickname: "박신혜", tot_concent_rate: "3.33%" },
    { rank: 5, nickname: "이진말고일진", tot_concent_rate: "4.00%" },
    { rank: 6, nickname: "삼진아웃", tot_concent_rate: "4.24%" },
    { rank: 7, nickname: "안녕", tot_concent_rate: "5.15%" },
    { rank: 8, nickname: "나는야", tot_concent_rate: "5.65%" },
    { rank: 9, nickname: "공부중", tot_concent_rate: "6.66%" },
    { rank: 10, nickname: "딴짓중", tot_concent_rate: "7.77%" },
];

const RankItem = ({ rank, nickname, tot }) => {
    var rankcolor = "#727272";
    switch (rank) {
        case 1:
            rankcolor = "#FFCF23";
            break;
        case 2:
            rankcolor = "#D6D6D6";
            break;
        case 3:
            rankcolor = "#CC9F5C";
            break;
        default:
            rankcolor = "#727272";
            break;
    }
    return (
        <div className="rank-item">
            <div className="rank-item1" style={{ backgroundColor: rankcolor }}>
                {rank}
            </div>
            <span className="rank-item2">{nickname}</span>
            <span className="rank-item3">{tot}</span>
        </div>
    );
};

const StudyRank = (srank) => {
    const rendering = () => {
        const result = [];
        for (let i = 1; i < Object.keys(srank).length; i++) {
            result.push(
                <RankItem
                    key={i}
                    rank={srank[i].rank}
                    nickname={srank[i].nickname}
                    tot={srank[i].tot_concent_time}
                />
            );
        }
        return result;
    };
    return (
        <div className="Rank-study">
            <div className="Rank-header">
                <p>순위</p>
                <p>닉네임</p>
                <p>공부시간</p>
            </div>
            <hr />
            {rendering()}
            <hr />
            <div>
                <RankItem
                    key={srank[0].rank}
                    rank={srank[0].rank}
                    nickname={srank[0].nickname}
                    tot={srank[0].tot_concent_time}
                />
            </div>
        </div>
    );
};

const PlayRank = (prank) => {
    const rendering = () => {
        const result = [];
        for (let i = 1; i < Object.keys(prank).length; i++) {
            result.push(
                <RankItem
                    key={prank[i].rank}
                    rank={prank[i].rank}
                    nickname={prank[i].nickname}
                    tot={prank[i].tot_concent_rate}
                />
            );
        }
        return result;
    };
    return (
        <div className="Rank-play">
            <div className="Rank-header">
                <p>순위</p>
                <p>닉네임</p>
                <p>집중도(%)</p>
            </div>
            <hr />
            {rendering()}
            <hr />
            <div>
                <RankItem
                    key={0}
                    rank={prank[0].rank}
                    nickname={prank[0].nickname}
                    tot={prank[0].tot_concent_rate}
                />
            </div>
        </div>
    );
};

const setBtnColor = (btn) => {
    var studyBtn = document.getElementById("study-rank-btn");
    var playBtn = document.getElementById("play-rank-btn");
    if (btn === "study") {
        studyBtn.style.color = "#000000";
        playBtn.style.color = "#9893B7";
    } else {
        studyBtn.style.color = "#9893B7";
        playBtn.style.color = "#000000";
    }
};

const RankComp = () => {
    const authContext = useContext(AuthContext);
    const [studyRankData, setStudyRankData] = useState([
        { rank: 0, nickname: "-", tot_concent_time: "-:-" },
    ]);
    const [playRankData, setPlayRankData] = useState([
        { rank: 0, nickname: "-", tot_concent_rate: "-:-" },
    ]);

    useEffect(() => {
        const getStudyRankData = async () => {
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/studyrank/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log(data.rank_study_list);
                        setStudyRankData(
                            data.rank_study_list.map((s) => ({
                                rank: s.rank,
                                nickname: s.nickname,
                                tot_concent_time: s.tot_concent_time,
                            }))
                        );
                    }
                })
                .catch((e) => {
                    alert("인터넷 연결이 불안정합니다.");
                });
        };
        getStudyRankData();
    }, []);

    useEffect(() => {
        const getPlayRankData = async () => {
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/playrank/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        setPlayRankData(
                            data.rank_play_list.map((p) => ({
                                rank: p.rank,
                                nickname: p.nickname,
                                tot_concent_rate: p.tot_concent_rate,
                            }))
                        );
                    }
                })
                .catch((e) => {
                    alert("인터넷 연결이 불안정합니다.");
                });
        };
        getPlayRankData();
    }, []);

    const [whatRank, setWhatRank] = useState("study");
    return (
        <div className="Main-RankComp">
            <div className="Rank-wrapper">
                <div className="what-rank">
                    <button
                        className="what-rank-btn"
                        id="study-rank-btn"
                        style={{ color: "#000" }}
                        onClick={() => {
                            setWhatRank("study");
                            setBtnColor("study");
                        }}
                    >
                        공부왕 랭킹
                    </button>
                    <button
                        className="what-rank-btn"
                        id="play-rank-btn"
                        style={{ color: "#9893B7" }}
                        onClick={() => {
                            setWhatRank("play");
                            setBtnColor("play");
                        }}
                    >
                        딴짓왕 랭킹
                    </button>
                </div>
                <div className="rank-list">
                    {whatRank === "study" ? (
                        <StudyRank {...studyRankData} />
                    ) : (
                        <PlayRank {...playRankData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RankComp;
