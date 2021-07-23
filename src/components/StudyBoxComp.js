import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";
import "../css/StudyBox.css";
import { Link } from "react-router-dom";

const initialAllRoomData = [
    {
        room_id: 1,
        room_name: "성공하자",
        inppl: 6,
        maxppl: 10,
        room_color: "#E8BBBB",
    },
    {
        room_id: 2,
        room_name: "송이들 드루와아아아아아아아아아아아아",
        inppl: 3,
        maxppl: 10,
        room_color: "#B0DFFB",
    },
    {
        room_id: 3,
        room_name: "방방방",
        inppl: 6,
        maxppl: 10,
        room_color: "#E8BBBB",
    },
    {
        room_id: 4,
        room_name: "ㅎㅇㅎㅇ",
        inppl: 3,
        maxppl: 10,
        room_color: "#B0DFFB",
    },
    {
        room_id: 5,
        room_name: "공부합시다 여러분!!!!",
        inppl: 6,
        maxppl: 10,
        room_color: "#E8BBBB",
    },
    {
        room_id: 6,
        room_name: "공부공부",
        inppl: 3,
        maxppl: 10,
        room_color: "#B0DFFB",
    },
    {
        room_id: 7,
        room_name: "ㅎㅇㅎㅇ",
        inppl: 3,
        maxppl: 10,
        room_color: "#B0DFFB",
    },
    {
        room_id: 8,
        room_name: "아무나 들어오세유 웰컴",
        inppl: 6,
        maxppl: 10,
        room_color: "#E8BBBB",
    },
    {
        room_id: 9,
        room_name: "hello hi",
        inppl: 3,
        maxppl: 10,
        room_color: "#B0DFFB",
    },
];

const initialMyRoomData = [
    {
        room_id: 1,
        room_name: "성공하자",
        inppl: 6,
        maxppl: 10,
        room_color: "#E8BBBB",
    },
    {
        room_id: 2,
        room_name: "송이들 드루와아아",
        inppl: 3,
        maxppl: 10,
        room_color: "#B0DFFB",
    },
];

const MySquare = ({ room_name, inppl, maxppl, room_color }) => {
    const style = {
        backgroundColor: room_color,
    };
    console.log(room_name.length);
    return (
        <div style={style} className="studybox-square">
            <div className="square-roomname">{room_name}</div>
            <div className="square-ppl">
                {inppl}/{maxppl}
            </div>
        </div>
    );
};

const EmptySquare = () => {
    return <div className="studybox-square"></div>;
};

const NewSquare = () => {
    return (
        
        <div className="studybox-newsquare">
            <Link to={"/CreateRoom"}>
                <p>
                    <br />
                    공부방
                    <br />
                    만들기
                </p>
            </Link>
        </div>
        
    );
};

const StudyBox = (allRooms) => {
    console.log(allRooms);
    console.log(Object.keys(allRooms).length);
    console.log(allRooms.whatBox);
    const row1 = () => {
        const result1 = [];
        for (let i = 0; i < 5; i++) {
            if (allRooms[i] !== undefined) {
                result1.push(
                    <MySquare
                        key={i}
                        room_name={allRooms[i].room_name}
                        inppl={allRooms[i].inppl}
                        maxppl={allRooms[i].maxppl}
                        room_color={allRooms[i].room_color}
                    />
                );
            } else {
                result1.push(<EmptySquare />);
            }
        }
        return result1;
    };
    const row2 = () => {
        const result2 = [];
        for (let i = 5; i < 9; i++) {
            if (allRooms[i] !== undefined) {
                result2.push(
                    <MySquare
                        key={i}
                        room_name={allRooms[i].room_name}
                        inppl={allRooms[i].inppl}
                        maxppl={allRooms[i].maxppl}
                        room_color={allRooms[i].room_color}
                    />
                );
            } else {
                result2.push(<EmptySquare />);
            }
        }
        return result2;
    };

    return (
        <div className="studybox-squares">
            <div className="studybox-squres-row">{row1()}</div>
            <div className="studybox-squres-row">
                {row2()}
                <NewSquare />
            </div>
        </div>
    );
};

const StudyBoxComp = () => {
    const [whatBox, setWhatBox] = useState("all"); // all vs my
    const [allRoomData, setAllRoomData] = useState(initialAllRoomData);
    const [myRoomData, setMyRoomData] = useState(initialMyRoomData);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const getAllRoomData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/random_rooms/",
                authContext.state.token
            );
            if (status === 200) {
                await console.log("Get Study Rank :", data.all_room_list);
                await setAllRoomData(
                    data.all_room_list.map((s) => ({
                        room_id: s.room_id,
                        room_name: s.room_name,
                        room_color: s.room_color,
                        inppl: s.inppl,
                        maxppl: s.maxppl,
                    }))
                );
                await console.log("Get complete: ", allRoomData);
            } else {
                await alert("인터넷 연결이 불안정합니다.");
            }
        };
        getAllRoomData();
    }, []);

    useEffect(() => {
        const getMyRoomData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/my_rooms/",
                authContext.state.token
            );
            if (status === 200) {
                await setMyRoomData(
                    data.my_room_list.map((s) => ({
                        room_id: s.room_id,
                        room_name: s.room_name,
                        room_color: s.room_color,
                        inppl: s.inppl,
                        maxppl: s.maxppl,
                    }))
                );
                await console.log("Get complete: ", myRoomData);
            } else {
                await alert("인터넷 연결이 불안정합니다.");
            }
        };
        getMyRoomData();
    }, []);

    return (
        <div>
            <p className="small-title">공부방 들어가기</p>
            <div className="Main-StudyBoxComp">
                <div className="studybox-upper-btns">
                    <div className="what-box">
                        <button
                            className="what-box-btn"
                            onClick={() => {
                                setWhatBox("all");
                            }}
                        >
                            모든 공부방
                        </button>
                        <button
                            className="what-box-btn"
                            onClick={() => {
                                setWhatBox("my");
                            }}
                        >
                            참여한 공부방
                        </button>
                    </div>

                    <div>
                        <Link to={"/studyroom"}>+ 더보기</Link>
                    </div>
                </div>
                <div className="box-list">
                    {whatBox === "all" ? (
                        <StudyBox {...allRoomData} whatBox={whatBox} />
                    ) : (
                        <StudyBox {...myRoomData} whatBox={whatBox} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyBoxComp;
