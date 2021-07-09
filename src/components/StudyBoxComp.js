import React from "react";
import { useState, useEffect, useContext } from "react";
import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";
import "../css/StudyBox.css";

const initialAllRoomData = [
    { room_id: 1, room_name: "성공하자", inppl: 6, maxppl: 10, room_color: "#E8BBBB" },
    { room_id: 2, room_name: "송이들 드루와아아", inppl: 3, maxppl: 10, room_color: "#B0DFFB" },
    { room_id: 3, room_name: "방방방", inppl: 6, maxppl: 10, room_color: "#E8BBBB" },
    { room_id: 4, room_name: "ㅎㅇㅎㅇ", inppl: 3, maxppl: 10, room_color: "#B0DFFB" },
    { room_id: 5, room_name: "공부합시다 여러분", inppl: 6, maxppl: 10, room_color: "#E8BBBB" },
    { room_id: 6, room_name: "공부공부", inppl: 3, maxppl: 10, room_color: "#B0DFFB" },
    { room_id: 7, room_name: "ㅎㅇㅎㅇ", inppl: 3, maxppl: 10, room_color: "#B0DFFB" },
    { room_id: 8, room_name: "공부합시다 여러분", inppl: 6, maxppl: 10, room_color: "#E8BBBB" },
    { room_id: 9, room_name: "공부공부", inppl: 3, maxppl: 10, room_color: "#B0DFFB" },
];

const initialMyRoomData = [
    { room_id: 1, room_name: "성공하자", inppl: 6, maxppl: 10, room_color: "#E8BBBB" },
    { room_id: 2, room_name: "송이들 드루와아아", inppl: 3, maxppl: 10, room_color: "#B0DFFB" },
];

const MySquare = () => {
    return (
        <div className="studybox-square"></div>
    );
}

const NewSquare = () => {
    return (
        <div className="studybox-newsquare">
            <p><br/>공부방<br/>만들기</p>
        </div>
    );
}

const StudyBox = ( allRooms ) => {
    console.log(allRooms);
    console.log(Object.keys(allRooms).length);
    console.log(allRooms.whatBox)
    const rendering1 = () => {
        const result1 = [];
        for (let i = 0; i < 5; i++) {
            result1.push(
                <MySquare />
                // <MySquare
                //     key={i}
                //     room_name={allRooms[i].room_name}
                //     inppl={allRooms[i].inppl}
                //     maxppl={allRooms[i].maxppl}
                //     room_color={allRooms[i].room_color} />
            )
        }
        return result1;
    }
    const rendering2 = () => {
        const result2 = [];
        for (let i = 5; i < 9; i++) {
            result2.push(
                <MySquare />
                // <MySquare
                //     key={i}
                //     room_name={allRooms[i].room_name}
                //     inppl={allRooms[i].inppl}
                //     maxppl={allRooms[i].maxppl}
                //     room_color={allRooms[i].room_color} />
            )
        }
        return result2;
    }
    
    return (
        <div className="studybox-squares">
            <div className="studybox-squres-row">{rendering1()}</div>
            <div className="studybox-squres-row">
                {rendering2()}<NewSquare />
            </div>
        </div>
    );
}


const StudyBoxComp = () => {
    const [whatBox, setWhatBox] = useState("all"); // all vs my
    const [allRoomData, setAllRoomData] = useState(initialAllRoomData);
    const [myRoomData, setMyRoomData] = useState(initialMyRoomData);
    const authContext = useContext(AuthContext);

    return (
        <div>
            <p className="small-title">공부방 들어가기</p>
            <div className="Main-StudyBoxComp">
                <div className="studybox-upper-btns">
                    <div className="what-box">
                        <button className="what-box-btn"
                            onClick={() => {
                                setWhatBox("all")
                            }}
                        >
                            모든 공부방
                        </button>
                        <button className="what-box-btn"
                            onClick={() => {
                                setWhatBox("my")
                            }}
                        >
                            참여한 공부방
                        </button>
                    </div>

                    <div>
                        <button className="more-btn">
                            + 더보기
                        </button>
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
