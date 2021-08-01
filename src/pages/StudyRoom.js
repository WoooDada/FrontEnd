import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { BsLockFill } from "react-icons/bs";

import { getApi, postApi } from "../api";
import { AuthContext } from "../App";
import "../css/StudyRoom.css";

// TODO: issue #40 눌렀을 때 한번 더 확인해줘야 함. -> get으로 작성해주기
// TODO: issue #41 roomtag에서 initTags랑 맞는 한글 태그 찾아서 보여주기. 만약 맞는 게 없다면 기타로 들어가야 함.

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
        inppl: "5",
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

const modalStyles = {
    wrapper: {
        margin: "2vh 0 1vh 0",
        display: "flex",
        border: "none",
    },
    input: {
        flex: 10,
        margin: "0 1vh 0 0",
        fontSize: "2vmin",
        border: "none",
        borderBottom: "1px solid #ccc",
    },
    link: {
        flex: 1,
        fontSize: "1.6vmin",
        padding: "1vh",
        // border: "none",
        cursor: "pointer",
        border: "1px solid #e1e5ea",
        backgroundColor: "#e1e5ea",
        textDecoration: "none",
        color: "black",
        textAlign: "center",
        alignContent: "center",
        justifyContent: "center",
    },
    button: {
        flex: 1,
        fontSize: "1.6vmin",
        padding: "1vh",
        border: "none",
        cursor: "pointer",
        border: "1px solid #e1e5ea",
        backgroundColor: "#e1e5ea",
        textDecoration: "none",
        color: "black",
        textAlign: "center",
        alignContent: "center",
        justifyContent: "center",
    },
};

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

const RoomItemChild = ({ room_data, onClick }) => {
    return (
        <div onClick={() => onClick(room_data.room_id)}>
            <div
                className="Box"
                style={{ backgroundColor: room_data.room_color }}
            >
                {room_data.is_secret === false ? (
                    <></>
                ) : (
                    <BsLockFill></BsLockFill>
                )}
                <b>{room_data.room_name}</b>
                <small>
                    {room_data.inppl}/{room_data.maxppl}
                </small>
            </div>
            <div className="Explanation">
                <b>#{room_data.room_tag}</b>
                <small>{room_data.room_comment}</small>
            </div>
        </div>
    );
};

const RoomItem = ({ room_data, openModal, alertOverflow }) => {
    /* 방 접속 관련 함수들 */
    function isRoomOverflow(room_data) {
        return parseInt(room_data.inppl) === parseInt(room_data.maxppl);
    }

    function isSecretRoom(room_data) {
        return room_data.is_secret === true;
    }
    return (
        <li className="Room-Item">
            {isRoomOverflow(room_data) ? (
                // 방 인원이 가득 찬 경우 못 들어감.
                <RoomItemChild
                    room_data={room_data}
                    onClick={alertOverflow}
                ></RoomItemChild>
            ) : isSecretRoom(room_data) ? (
                // 비밀방이면 모달로 비밀번호 입력하고 들어감
                <RoomItemChild
                    room_data={room_data}
                    onClick={openModal}
                ></RoomItemChild>
            ) : (
                // 비밀방이 아니면 모달 없이 들어갈 수 있음.
                <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/study/${room_data.room_id}`}
                    // onClick={() => onClick(room_data.room_id)}
                >
                    <RoomItemChild
                        room_data={room_data}
                        onClick={(i) => {}}
                    ></RoomItemChild>
                </Link>
            )}
        </li>
    );
};

const StudyRoom = () => {
    const [keyword, setKeyword] = useState("");
    const [tags, setTags] = useState(initTags);
    // const [rooms, setRooms] = useState([]);
    const [rooms, setRooms] = useState(roomsTemp);
    const [clickedRoomId, setClickedRoomId] = useState(-1);
    const [password, setPassword] = useState("");
    const authContext = useContext(AuthContext);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isPwdCorrect, setIsPwdCorrect] = useState(false);

    /* useEffect */
    useEffect(() => {
        const getAllRooms = async () => {
            const params = { all: "T", keyword: keyword };
            const { status, data } = await getApi(
                params,
                "/studyroom/",
                authContext.state.token
            );

            if (status === 200) {
                console.log(data.data);
                const inp_rooms = data.data.map((d) => {
                    var room_tag = "기타";
                    switch (d.room_tag) {
                        case "college":
                            room_tag = "대학생";
                            break;
                        case "sat":
                            room_tag = "수능";
                            break;
                        case "gongmuwon":
                            room_tag = "공무원";
                            break;
                        case "employment":
                            room_tag = "취업 및 이직";
                            break;
                        case "certificate":
                            room_tag = "자격증";
                            break;
                        case "language":
                            room_tag = "어학";
                            break;
                        default:
                            room_tag = "기타";
                            break;
                    }
                    return {
                        ...d,
                        room_tag: room_tag,
                    };
                });
                await setRooms(inp_rooms);
            } else {
                alert("네트워크 오류");
            }
        };
        getAllRooms();
    }, []);

    /* modal 관련 함수들 */
    var subtitle = "";

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = "#000";
    }

    function closeModal() {
        setIsOpen(false);
    }

    function findRoomName(clickedRoomId) {
        const { room_name } = rooms.filter((r) => r.room_id === clickedRoomId);
        return room_name;
    }

    /* 스터디페이지 입장 관련 함수들 */
    function openModal(room_id) {
        setClickedRoomId(room_id);
        setIsOpen(true);
    }

    function alertOverflow(room_id) {
        alert("입장인원이 다 찼습니다. 다른 방에 접속해주세요!");
    }

    const getisCorrectPwd = async () => {
        // REAL

        const { status, data } = await postApi(
            { room_id: clickedRoomId, password },
            "/studyroom/password/",
            authContext.state.token
        );

        // dummy

        // const { status, data } = {
        //     status: 200,
        //     data: {
        //         correct: "T",
        //     },
        // };
        await console.log(status);
        if (status === 200) {
            console.log(data.correct);
            if (data.correct === "F") {
                // 비밀번호가 틀림: Link로 바로 /study 페이지로 넘어가면 안됨.
                await alert("비밀번호가 틀렸어요!");
                await setIsPwdCorrect(false);
            } else {
                await setIsPwdCorrect(true);
            }
        } else {
            alert("네트워크 오류");
        }

        // dummy
        // console.log({ room_id: clickedRoomId, password });
    };

    /* 검색 관련 함수들 */

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

        const { status, data } = await getApi(
            params,
            "/studyroom/",
            authContext.state.token
        );
        if (status === 200) {
            console.log(data.data);
            await setRooms(data.data);
        } else {
            alert("네트워크 오류");
        }
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
                            <RoomItem
                                key={i}
                                room_data={r}
                                openModal={openModal}
                                alertOverflow={alertOverflow}
                            ></RoomItem>
                        ))
                    ) : (
                        <span>방이 아직 없어요! 만들어주세요:)</span>
                    )}
                </ul>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <h3 ref={(_subtitle) => (subtitle = _subtitle)}>
                    {findRoomName(clickedRoomId)}번방에 들어가려면, 비밀번호를
                    입력해주세요!
                </h3>
                <div
                    className="Modal-PassWord-Wrapper"
                    style={modalStyles.wrapper}
                >
                    <input
                        placeholder="비밀번호를 입력해주세요."
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        value={password}
                        style={modalStyles.input}
                        type="password"
                    ></input>
                    <button
                        onClick={getisCorrectPwd}
                        style={modalStyles.button}
                    >
                        확인
                    </button>
                    {isPwdCorrect ? (
                        <Link 
                            to={`/study/${clickedRoomId}`}
                            // to={`/study/01`}
                            onClick={() => closeModal()}>
                            <button style={modalStyles.link}>입장</button>
                        </Link>
                    ) : (
                        <button
                            style={modalStyles.button}
                            onClick={() => {
                                alert("비밀번호를 확인해주세요.");
                            }}
                        >
                            입장
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default StudyRoom;
