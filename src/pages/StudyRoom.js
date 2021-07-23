import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../api";
import { AuthContext } from "../App";
import "../css/StudyRoom.css";

const initTags = [
    { id: 0, krname: "대학생", enname: "college", clicked: false },
    { id: 1, krname: "수능", enname: "sat", clicked: false },
    { id: 2, krname: "공무원", enname: "gongmuwon", clicked: false },
    { id: 3, krname: "취업 및 이직", enname: "employment", clicked: false },
    { id: 4, krname: "자격증", enname: "certificate", clicked: false },
    { id: 5, krname: "어학", enname: "language", clicked: false },
    { id: 6, krname: "기타", enname: "etc", clicked: false },
];

const roomsTemp = [
    {
        room_id: "1",
        room_name: "공부하자",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "2",
        room_name: "공부하자비밀방",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "3",
        room_name: "공부하자2",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "4",
        room_name: "공부하자비밀방2",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "5",
        room_name: "공부하자3",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "6",
        room_name: "공부하자비밀방3",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "7",
        room_name: "공부하자4",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "8",
        room_name: "공부하자비밀방4",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "9",
        room_name: "공부하자5",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "10",
        room_name: "공부하자비밀방5",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "11",
        room_name: "공부하자5",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "12",
        room_name: "공부하자비밀방5",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "13",
        room_name: "공부하자5",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "14",
        room_name: "공부하자비밀방5",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "15",
        room_name: "공부하자5",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "16",
        room_name: "공부하자비밀방5",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
    {
        room_id: "17",
        room_name: "공부하자5",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#E9B2BC",
    },
    {
        room_id: "18",
        room_name: "공부하자비밀방5",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#F8D57E",
    },
];

const TagItem = ({ id, krname, clicked, handleClicked }) => {
    return (
        <div
            className={clicked ? "Tag-Item-Selected" : "Tag-Item-Unselected"}
            onClick={() => handleClicked(id)}
        >
            #{krname}
        </div>
    );
};

const RoomItem = ({ room_data }) => {
    return (
        <li className="Room-Item">
            <div
                className="Box"
                style={{ backgroundColor: room_data.room_color }}
            >
                <b>{room_data.room_name}</b>
                <small>
                    {room_data.inppl}/{room_data.maxppl}
                </small>
            </div>
            <div className="Explanation">
                <b>#{room_data.room_tag}</b>
                <small>{room_data.room_comment}</small>
            </div>
        </li>
    );
};

const StudyRoom = () => {
    const [keyword, setKeyword] = useState("");
    const [tags, setTags] = useState(initTags);
    const [rooms, setRooms] = useState(roomsTemp);
    const authContext = useContext(AuthContext);

    const handleClicked = (id) => {
        const newTags = tags.map((t, i) => {
            if (i === id) {
                return { ...t, clicked: !t.clicked };
            } else return t;
        });

        setTags(newTags);
    };

    const searchByKeyword = async () => {
        // get api
        let params = { all: "T", keyword: keyword };
        console.log(tags.length);
        tags.forEach((t, i) => {
            params[t.enname] = t.clicked ? "T" : "F";
            if (t.clicked) {
                params.all = "F";
            }
        });
        console.log(params);
        // REAL

        // const { status, data } = await getApi(
        //     params,
        //     "/studyroom",
        //     authContext.state.token
        // );
        // if (status === 200) {
        //     console.log(data.data);
        //     await setRooms(data.data);
        // } else {
        //     alert("네트워크 오류");
        // }
    };
    return (
        <div className="StudyRoom">
            <div className="Main-Banner">
                <Link to="/createroom" className="button">
                    공부방 만들기
                </Link>
            </div>
            <div className="Contents-Wrapper">
                <div className="Search-Bar">
                    <input
                        placeholder="검색어를 입력해주세요."
                        name="keyword"
                        onChange={(e) => {
                            setKeyword(e.target.value);
                        }}
                        value={keyword}
                    ></input>
                    <button onClick={searchByKeyword}>검색</button>
                </div>
                <div className="Tag-List">
                    {tags.map((t, i) => (
                        <TagItem
                            id={t.id}
                            key={t.id}
                            krname={t.krname}
                            clicked={t.clicked}
                            handleClicked={handleClicked}
                        ></TagItem>
                    ))}
                </div>
                <ul className="Room-List">
                    {rooms.length ? (
                        rooms.map((r, i) => (
                            <RoomItem key={i} room_data={r}></RoomItem>
                        ))
                    ) : (
                        <span>방이 아직 없어요. 만들어주세요:)</span>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default StudyRoom;
