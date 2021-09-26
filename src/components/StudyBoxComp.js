import React from "react";
import { useState, useEffect, useContext } from "react";
import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";
import "../css/StudyBox.css";
import { Link } from "react-router-dom";
import { Studycard } from ".";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const initialAllRoomData = [
    {
        room_id: 1,
        room_name: "성공하자",
        inppl: 6,
        maxppl: 10,
        room_color: "#9F8FFF",
        is_scret: "F",
        room_tag: "#대학생",
    },
    {
        room_id: 2,
        room_name: "송이들 드루와아아아아아아아아아아아아",
        inppl: 3,
        maxppl: 10,
        room_color: "#FAB39B",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 3,
        room_name: "방방방",
        inppl: 6,
        maxppl: 10,
        room_color: "#9ADDE8",
        is_scret: "F",
        room_tag: "#공무원",
    },
    {
        room_id: 4,
        room_name: "ㅎㅇㅎㅇ",
        inppl: 3,
        maxppl: 10,
        room_color: "#C0C0C0",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 5,
        room_name: "공부합시다 여러분!!!!",
        inppl: 6,
        maxppl: 10,
        room_color: "#C0C0C0",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 6,
        room_name: "공부공부",
        inppl: 3,
        maxppl: 10,
        room_color: "#9ADDE8",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 7,
        room_name: "ㅎㅇㅎㅇ",
        inppl: 3,
        maxppl: 10,
        room_color: "#FAB39B",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 8,
        room_name: "아무나 들어오세유 웰컴",
        inppl: 6,
        maxppl: 10,
        room_color: "#FAB39B",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 9,
        room_name: "hello hi",
        inppl: 3,
        maxppl: 10,
        room_color: "#FAB39B",
        is_scret: "T",
        room_tag: "#수능",
    },
];

const initialMyRoomData = [
    {
        room_id: 1,
        room_name: "성공하자22",
        inppl: 6,
        maxppl: 10,
        room_color: "#FAB39B",
        is_scret: "T",
        room_tag: "#수능",
    },
    {
        room_id: 2,
        room_name: "송이들 드루와아아22",
        inppl: 3,
        maxppl: 10,
        room_color: "#C0C0C0",
        is_scret: "T",
        room_tag: "#수능",
    },
];

const setFontColor = (value) => {
    var allBtn = document.getElementById("all-box-btn");
    var myBtn = document.getElementById("my-box-btn");
    if (value === "all") {
        allBtn.style.color = "#000000";
        myBtn.style.color = "#9893B7";
    } else {
        allBtn.style.color = "#9893B7";
        myBtn.style.color = "#000000";
    }
};

const StudyBoxComp = () => {
    const [whatBox, setWhatBox] = useState("all"); // all vs my
    const [allRoomData, setAllRoomData] = useState(initialAllRoomData);
    const [myRoomData, setMyRoomData] = useState(initialMyRoomData);
    const authContext = useContext(AuthContext);
    const [allIndex, setAllIndex] = useState(0);
    const [myIndex, setMyIndex] = useState(0);

    const StudyBox = (allRooms) => {
        const row1 = () => {
            const result1 = [];
            for (let i = allIndex; i < allIndex + 4; i++) {
                if (allRooms[i] !== undefined) {
                    result1.push(
                        <Studycard
                            key={i}
                            room_id={allRooms[i].room_id}
                            room_name={allRooms[i].room_name}
                            inppl={allRooms[i].inppl}
                            maxppl={allRooms[i].maxppl}
                            room_color={allRooms[i].room_color}
                            is_scret={allRooms[i].is_scret}
                            room_tag={allRooms[i].room_tag}
                            page={"main"}
                        />
                    );
                } else {
                    result1.push();
                }
            }
            return result1;
        };

        return <div className="Studycard-list">{row1()}</div>;
    };

    const clickLeftBtn = (whatBox) => {
        console.log(allIndex, myIndex);
        if (allIndex > 0) {
            setAllIndex(allIndex - 1);
        }
    };

    const clickRightBtn = (whatBox) => {
        console.log(allIndex, myIndex);
        if (allIndex < allRoomData.length - 4) {
            setAllIndex(allIndex + 1);
        }
    };

    useEffect(() => {
        const getAllRoomData = async () => {
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/random_rooms/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    setAllRoomData(
                        data.all_room_list.map((s) => ({
                            room_id: s.room_id,
                            room_name: s.room_name,
                            room_color: s.room_color,
                            inppl: s.inppl,
                            maxppl: s.maxppl,
                            is_scret: s.is_scret,
                            room_tag: s.room_tag,
                        }))
                    );
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        getAllRoomData();
    }, []);

    useEffect(() => {
        const getMyRoomData = async () => {
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/main/my_rooms/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    setMyRoomData(
                        data.my_room_list.map((s) => ({
                            room_id: s.room_id,
                            room_name: s.room_name,
                            room_color: s.room_color,
                            inppl: s.inppl,
                            maxppl: s.maxppl,
                            room_tag: s.room_tag,
                            is_scret: s.is_scret,
                        }))
                    );
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        getMyRoomData();
    }, []);

    return (
        <div className="Main-StudyBoxComp">
            <p className="small-title">공부방 들어가기</p>
            <div className="studybox-upper-btns">
                <div className="what-box">
                    <button
                        className="what-box-btn"
                        id="all-box-btn"
                        style={{ color: "#000000" }}
                        onClick={() => {
                            setWhatBox("all");
                            setAllIndex(0);
                            setMyIndex(0);
                            setFontColor("all");
                        }}
                    >
                        공부방 랜덤 추천
                    </button>
                    <button
                        className="what-box-btn"
                        id="my-box-btn"
                        style={{ color: "#9893B7" }}
                        onClick={() => {
                            setWhatBox("my");
                            setAllIndex(0);
                            setMyIndex(0);
                            setFontColor("my");
                        }}
                    >
                        참여한 공부방
                    </button>
                </div>

                <div className="StudyBox-more">
                    <Link to={"/studyroom"}>+ 더보기</Link>
                </div>
            </div>
            <div className="Studycard-wrapper">
                <RiArrowLeftSLine
                    id="Studybox-leftbtn"
                    size="40px"
                    onClick={(e) => clickLeftBtn(whatBox)}
                    style={{ color: "#9893B7" }}
                />
                {whatBox === "all" ? (
                    <StudyBox {...allRoomData} whatBox={whatBox} />
                ) : (
                    <StudyBox {...myRoomData} whatBox={whatBox} />
                )}
                <RiArrowRightSLine
                    id="Studybox-rightbtn"
                    size="40px"
                    onClick={(e) => clickRightBtn(whatBox)}
                    style={{ color: "#9893B7" }}
                />
            </div>
        </div>
    );
};

export default StudyBoxComp;
