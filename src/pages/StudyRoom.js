import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Modal from "react-modal";
import { BsLockFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";

import { getApi, postApi } from "../api";
import { AuthContext } from "../App";
import { Studycard } from "../components";
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
        room_color: "#9F8FFF",
    },
    {
        room_id: "2",
        room_name: "공부하자비밀방이건두줄이지롱",
        inppl: "4",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#FAB39B",
    },
    {
        room_id: "3",
        room_name: "공부하자2",
        inppl: "0",
        maxppl: "5",
        room_tag: "sat",
        room_comment: "수능 공부할 사람만 들어와",
        is_secret: "F",
        room_color: "#9ADDE8",
    },
    {
        room_id: "4",
        room_name: "공부하자비밀방2",
        inppl: "0",
        maxppl: "5",
        room_tag: "college",
        room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
        is_secret: "T",
        room_color: "#C0C0C0",
    },
    // {
    //     room_id: "5",
    //     room_name: "공부하자3",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "sat",
    //     room_comment: "수능 공부할 사람만 들어와",
    //     is_secret: "F",
    //     room_color: "#E9B2BC",
    // },
    // {
    //     room_id: "6",
    //     room_name: "공부하자비밀방3이것도두줄이지롱",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "college",
    //     room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
    //     is_secret: "T",
    //     room_color: "#9F8FFF",
    // },
    // {
    //     room_id: "7",
    //     room_name: "공부하자4",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "sat",
    //     room_comment: "수능 공부할 사람만 들어와",
    //     is_secret: "F",
    //     room_color: "#9F8FFF",
    // },
    // {
    //     room_id: "8",
    //     room_name: "공부하자비밀방4",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "college",
    //     room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
    //     is_secret: "T",
    //     room_color: "#FAB39B",
    // },
    // {
    //     room_id: "9",
    //     room_name: "공부하자3",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "sat",
    //     room_comment: "수능 공부할 사람만 들어와",
    //     is_secret: "F",
    //     room_color: "#E9B2BC",
    // },
    // {
    //     room_id: "10",
    //     room_name: "공부하자비밀방3이것도두줄이지롱",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "college",
    //     room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
    //     is_secret: "T",
    //     room_color: "#9F8FFF",
    // },
    // {
    //     room_id: "11",
    //     room_name: "공부하자4",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "sat",
    //     room_comment: "수능 공부할 사람만 들어와",
    //     is_secret: "F",
    //     room_color: "#9F8FFF",
    // },
    // {
    //     room_id: "12",
    //     room_name: "공부하자비밀방4",
    //     inppl: "0",
    //     maxppl: "5",
    //     room_tag: "college",
    //     room_comment: "쉿 대학생 중에 공부할 사람만 들어와",
    //     is_secret: "T",
    //     room_color: "#FAB39B",
    // },
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
    message: {
        color: "red",
    },
};

const TagItem = ({ id, krname, clicked, handleClicked }) => {
    return (
        <div
            className={clicked ? "Tag-Item-Selected" : "Tag-Item-Unselected"}
            onClick={() => handleClicked(id)}
        >
            {krname}
        </div>
    );
};

const StudyRoom = () => {
    const [keyword, setKeyword] = useState("");
    const [tags, setTags] = useState(initTags);
    const [rooms, setRooms] = useState([]);
    // const [rooms, setRooms] = useState(roomsTemp);
    const [clickedRoomId, setClickedRoomId] = useState(undefined);
    const [password, setPassword] = useState("");
    const authContext = useContext(AuthContext);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isPwdCorrect, setIsPwdCorrect] = useState(true);
    const history = useHistory();

    /* useEffect */
    useEffect(() => {
        const getAllRooms = async () => {
            const params = { all: "T", keyword: keyword };
            await getApi(params, "/studyroom/", authContext.state.token)
                .then(({ status, data }) => {
                    setRooms(data.data);
                })
                .catch((e) => {
                    console.log(e);
                });
            // const { status, data } = {
            //     status: 200,
            //     data: {
            //         data: roomsTemp,
            //     },
            // };
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
        setIsPwdCorrect(false);
    }

    function findRoomName(clickedRoomId) {
        if (clickedRoomId === undefined) {
            return "";
        }
        const clickedRoomName = rooms.filter(
            (r) => r.room_id === clickedRoomId
        )[0].room_name;
        return clickedRoomName;
    }

    /* 스터디페이지 입장 관련 함수들 */
    function openModal(room_id) {
        setClickedRoomId(room_id);
        setIsOpen(true);
    }

    function alertOverflow(room_id) {
        alert("입장인원이 다 찼습니다. 다른 방에 접속해주세요!");
    }

    function isOverflow(clicked_room_id) {
        // TODO 여기서 다시 해당 in_ppl 구해와서 보기
        if (clicked_room_id === undefined) {
            return "";
        }
        const { inppl, maxppl } = rooms.filter(
            (r) => r.room_id === clicked_room_id
        )[0];

        return parseInt(inppl) >= parseInt(maxppl);
    }

    const getisCorrectPwd = async (clicked_room_id) => {
        // * REAL

        await postApi(
            { room_id: clicked_room_id, password },
            "/studyroom/password/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                if (data.correct === "T") {
                    setIsPwdCorrect(true);
                    return true;
                } else {
                    // 비밀번호가 틀림: Link로 바로 /study 페이지로 넘어가면 안됨.
                    setIsPwdCorrect(false);
                    return false;
                }
            })
            .catch((e) => {
                console.log(e);
                return false;
            });

        // * dummy

        // const { status, data } = {
        //     status: 200,
        //     data: {
        //         correct: "T",
        //     },
        // };
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

        await getApi(params, "/studyroom/", authContext.state.token)
            .then(({ status, data }) => {
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
                setRooms(inp_rooms);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="StudyRoomWrapper">
            <div className="StudyRoom">
                <div className="HeaderWrapper">
                    <header>
                        <div className="HeaderTop">
                            <div className="SearchBar">
                                <input
                                    placeholder="Search"
                                    name="keyword"
                                    onChange={(e) => {
                                        setKeyword(e.target.value);
                                    }}
                                    value={keyword}
                                ></input>
                                <button onClick={searchByKeyword}>
                                    <BiSearch color="white"></BiSearch>
                                </button>
                            </div>
                            <Link to="/createroom" className="CreateRoomBtn">
                                CREATE ROOM
                            </Link>
                        </div>
                        <div className="TagList">
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
                    </header>
                </div>
                <ul className="Room-List">
                    {rooms.length ? (
                        rooms.map((r, i) => (
                            <Studycard
                                key={i}
                                room_id={r.room_id}
                                room_name={r.room_name}
                                inppl={r.inppl}
                                maxppl={r.maxppl}
                                room_color={r.room_color}
                                is_scret={r.room_issecret}
                                room_tag={r.room_tag}
                                page={"studyroom"}
                                openModal={openModal}
                                alertOverflow={alertOverflow}
                                setClickedRoomId={setClickedRoomId}
                            ></Studycard>
                        ))
                    ) : (
                        <span>방이 아직 없어요! 만들어주세요:)</span>
                    )}
                </ul>

                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <h3 ref={(_subtitle) => (subtitle = _subtitle)}>
                        "{findRoomName(clickedRoomId)}"에 들어가려면, 비밀번호를
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
                            onClick={async () => {
                                if (
                                    (await getisCorrectPwd(clickedRoomId)) ===
                                    true
                                ) {
                                    if (isOverflow(clickedRoomId) === false) {
                                        history.push(`/study/${clickedRoomId}`);
                                    }
                                }
                                setPassword("");
                            }}
                            style={modalStyles.button}
                        >
                            입장
                        </button>
                    </div>
                    <small style={modalStyles.message}>
                        {isPwdCorrect ? "" : "비밀번호가 틀렸습니다."}
                    </small>
                </Modal>
            </div>
        </div>
    );
};

export default StudyRoom;
