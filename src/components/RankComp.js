import React from "react";
import { useState, useEffect, useContext } from "react";
import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";
import "../css/Rank.css";

const initialStudyData = [
    { rank: 54, nickname: "우정쨩", tot_concent_time: "1:53" },  // 내 순위
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
    {rank: 74, nickname: "우정쨩", tot_concent_rate: "35.12%"},  // 내 순위
    {rank: 1, nickname: "이진헤어", tot_concent_rate: "0.12%"}, 
    {rank: 2, nickname: "닭닭", tot_concent_rate: "1.11%"}, 
    {rank: 3, nickname: "박씨네", tot_concent_rate: "1.12%"}, 
    {rank: 4, nickname: "박신혜", tot_concent_rate: "3.33%"}, 
    {rank: 5, nickname: "이진말고일진", tot_concent_rate: "4.00%"},
    {rank: 6, nickname: "삼진아웃", tot_concent_rate: "4.24%"},
    {rank: 7, nickname: "안녕", tot_concent_rate: "5.15%"},
    {rank: 8, nickname: "나는야", tot_concent_rate: "5.65%"},
    {rank: 9, nickname: "공부중", tot_concent_rate: "6.66%"},
    {rank: 10, nickname: "딴짓중", tot_concent_rate: "7.77%"},
];

const RankItem = ({rank, nickname, tot}) => {
    return (
        <div className="rank-item"> 
            <span className="rank-item1">{rank}</span>
            <span className="rank-item2">{nickname}</span> 
            <span className="rank-item3">{tot}</span>
        </div>
    );
}

const StudyRank = (srank) => {
    const rendering = () => {
        const result = [];
        for (let i=1; i < 11; i++) {
            result.push(
                <RankItem 
                    key={i}
                    rank={srank[i].rank}
                    nickname={srank[i].nickname}
                    tot={srank[i].tot_concent_time} />
            )
        }
        return result;
    }
    return (
        <div className="Rank-study">
            <p>~누가누가 공부를 많이 했나~</p>
            {rendering()}
            <hr/>
            <div>
            <RankItem 
                    key={0}
                    rank={srank[0].rank}
                    nickname={srank[0].nickname}
                    tot={srank[0].tot_concent_time} />
            </div>
        </div>
    )
}

const PlayRank = (prank) => {
    const rendering = () => {
        const result = [];
        for (let i = 1; i < 11; i++) {
            result.push(
                <RankItem
                    key={i}
                    rank={prank[i].rank}
                    nickname={prank[i].nickname}
                    tot={prank[i].tot_concent_rate} />
            )
        }
        return result;
    }
    return (
        <div className="Rank-play">
            <p>~누가누가 딴짓을 많이 했나~</p>
            {rendering()}
            <hr/>
            <div>
            <RankItem 
                    key={0}
                    rank={prank[0].rank}
                    nickname={prank[0].nickname}
                    tot={prank[0].tot_concent_rate} />
            </div>
        </div>
    )
}

const RankComp = () => {
    const authContext = useContext(AuthContext);
    const [studyRankData, setStudyRankData] = useState(initialStudyData);
    const [playRankData, setPlayRankData] = useState(initialPlayData);

    useEffect(() => {
        const getStudyRankData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/studyrank/"
            );
            if (status === 200) {
                await console.log('Get Study Rank :', data.rank_study_list);
                await setStudyRankData(
                    data.rank_study_list.map(s => ({
                        rank: s.rank,
                        nickname: s.nickname,
                        tot_concent_time: s.tot_concent_time,
                    }))
                );
                await console.log("Get complete: ", studyRankData);
            } else {
                await alert("인터넷 연결이 불안정합니다.");
            }
        };
        getStudyRankData();
    }, []);

    useEffect(() => {
        const getPlayRankData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/playrank/"
            );
            if (status === 200) {
                await console.log('Get Play Rank :', data.rank_play_list);
                await setPlayRankData(
                    data.rank_play_list.map(p => ({
                        rank: p.rank,
                        nickname: p.nickname,
                        tot_concent_rate: p.tot_concent_rate,
                    }))
                );
                await console.log("Get complete: ", playRankData);
            } else {
                await alert("인터넷 연결이 불안정합니다.");
            }
        };
        getPlayRankData();
    }, []);

    const [whatRank, setWhatRank] = useState("study");
    return (
        <div>
            <p className="small-title">랭킹</p>
            <div className="Main-RankComp">
                <div className="what-rank">
                    <button className="what-rank-btn"
                        onClick={() => {
                            setWhatRank("study")
                        }}
                    >
                        공부왕
                    </button>
                    <button className="what-rank-btn"
                        onClick={() => {
                            setWhatRank("play")
                        }}
                    >
                        딴짓왕
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
