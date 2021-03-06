import React, { useEffect, useState, useContext, useReducer } from "react";
import "../css/Main.css";
import { AuthContext } from "../App";
import { getApi, postApi, putApi, deleteApi } from "../api";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

const MonthlyComp = () => {
    const authContext = useContext(AuthContext);
    const [mtodos, setMtodos] = useState([]);
    // dummy date
    // const [mtodos, setMtodos] = useState([
    //     // mtodos 배열 데이터.
    //     // dummy data
    //     {
    //         id: 1,
    //         title: 'Test1',
    //         start: '2021-05-22',
    //         end: '2021-05-22'
    //     },
    //     {
    //         id: 2,
    //         title: 'Test2',
    //         start: '2021-05-06',
    //         end: '2021-05-09'
    //     }
    // ]);
    const reducer = (state, action) => {
        // 이벤트 클릭시 버튼 다르게 출력하기 위한 reducer
        switch (action.type) {
            case "eventclick":
                return { isClicked: true, eventId: action.payload };
            case "event-not-click":
                return { isClicked: false, eventId: null };
            default:
                return { isClicked: false, eventId: null };
        }
    };
    const [state, dispatch] = useReducer(reducer, {
        isClicked: false,
        eventId: null,
    });
    const [inputs, setInputs] = useState({
        // input data from input form
        title: "",
        start: "",
        end: "",
    });
    const { title, start, end } = inputs;
    // GET
    const getMtodos = async () => {
        await getApi(
            {
                uid: authContext.state.uid,
            },
            "/tdl/monthly/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                if (status === 200) {
                    // data : [m_todo_id, stt_date, end_date, m_content] 배열 여러개.
                    // map으로 각각 setMtodos로 id, start, end, title에 넣어주기
                    setMtodos(
                        data.m_todo_list.map((mdata, i) => ({
                            id: mdata.m_todo_id,
                            start: mdata.stt_date,
                            end: mdata.end_date,
                            title: mdata.m_content,
                        }))
                    );
                }
            })
            .catch((e) => {
                alert("인터넷 연결이 불안정합니다.");
            });
    };
    useEffect(() => {
        getMtodos();
    }, []);

    const onCreate = async (e) => {
        // 일정 추가 함수
        e.preventDefault();
        // POST
        await postApi(
            {
                uid: authContext.state.uid,
                stt_date: start,
                end_date: end,
                m_content: title,
            },
            "/tdl/monthly/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                if (status === 200) {
                    const eventId = data.m_todo_id;
                    const mtodo = { id: eventId, title, start, end };
                    setMtodos(mtodos.concat(mtodo));
                    console.log("mtdl post success");
                }
            })
            .catch((e) => {
                alert("일정 추가 실패. 네트워크를 확인해주세요.");
            });
        setInputs({
            title: "",
            start: "",
            end: "",
        });
    };

    const handleDateClick = (dateInfo) => {
        // 빈 날짜 클릭 시
        dispatch({ type: "event-not-click", payload: "" });

        setInputs({
            title: "",
            start: dateInfo.dateStr,
            end: dateInfo.dateStr,
        });
    };

    const isDateSelected = (dateInfo) => {
        // drag를 통해 여러 date 지정
        dispatch({ type: "event-not-click", payload: "" });
        setInputs({
            title: "",
            start: dateInfo.startStr,
            end: dateInfo.endStr,
        });
    };

    function handleEventClick(eventInfo) {
        // 일정변경, 일정삭제 버튼 두 개 나타남
        const eventId = eventInfo.event.id;
        var event_end = "";
        dispatch({ type: "eventclick", payload: eventId }); // payload로 event 고유 아이디 전달
        // 이벤트 클릭 시 아래 입력폼에 내용 나타남.
        if (eventInfo.event.end === null) {
            event_end = eventInfo.event.startStr;
        } else {
            event_end = eventInfo.event.endStr;
        }
        setInputs({
            title: eventInfo.event.title,
            start: eventInfo.event.startStr,
            end: event_end,
        });
    }

    const handleEventDrop = async (eventInfo) => {
        const eventId = eventInfo.event.id;
        dispatch({ type: "eventclick", payload: eventId }); // payload로 event 고유 아이디 전달
        const newStart = moment(eventInfo.oldEvent.startStr)
            .add(eventInfo.delta.days, "d")
            .format("YYYY-MM-DD");
        var newEnd = "";
        if (eventInfo.oldEvent.end === null) {
            newEnd = moment(eventInfo.oldEvent.startStr)
                .add(eventInfo.delta.days + 1, "d")
                .format("YYYY-MM-DD");
        } else {
            newEnd = moment(eventInfo.oldEvent.endStr)
                .add(eventInfo.delta.days, "d")
                .format("YYYY-MM-DD");
        }

        setInputs({
            title: eventInfo.oldEvent.title,
            start: newStart,
            end: newEnd,
        });

        //UPDATE
        await putApi(
            {
                uid: authContext.state.uid,
                m_todo_id: eventId,
                stt_date: newStart,
                end_date: newEnd,
                m_content: eventInfo.oldEvent.title,
            },
            "/tdl/monthly/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                console.log("mtdl update success");
            })
            .catch((e) => {
                console.log("mtdl update fail");
                alert("월간 일정 수정 실패. 네트워크를 확인해주세요.");
            });
        getMtodos();
    };

    const handleEventResize = async (eventInfo) => {
        const eventId = eventInfo.event.id;
        var newEnd = "";
        if (eventInfo.oldEvent.end === null) {
            newEnd = moment(eventInfo.oldEvent.startStr)
                .add(eventInfo.endDelta.days + 1, "d")
                .format("YYYY-MM-DD");
        } else {
            newEnd = moment(eventInfo.oldEvent.endStr)
                .add(eventInfo.endDelta.days, "d")
                .format("YYYY-MM-DD");
        }

        setInputs({
            title: eventInfo.oldEvent.title,
            start: eventInfo.oldEvent.startStr,
            end: newEnd,
        });
        //UPDATE
        await putApi(
            {
                uid: authContext.state.uid,
                m_todo_id: eventId,
                stt_date: eventInfo.oldEvent.startStr,
                end_date: newEnd,
                m_content: eventInfo.oldEvent.title,
            },
            "/tdl/monthly/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                console.log("mtdl update success");
            })
            .catch((e) => {
                console.log("mtdl update fail");
                alert("월간 일정 수정 실패. 네트워크를 확인해주세요.");
            });
        getMtodos();
    };

    // 일정변경(UPDATE) : mtodos배열에서 해당 id의 event 변경해줌
    const handleClickUpdateBtn = async (e) => {
        e.preventDefault();
        //UPDATE
        await putApi(
            {
                uid: authContext.state.uid,
                m_todo_id: state.eventId,
                stt_date: inputs.start,
                end_date: inputs.end,
                m_content: inputs.title,
            },
            "/tdl/monthly/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                console.log("update success");
            })
            .catch((e) => {
                console.log("mtdl update fail");
                alert("월간 일정 수정 실패. 네트워크를 확인해주세요.");
            });
        getMtodos();
        setInputs({ title: "", start: "", end: "" });
        dispatch({ type: "event-not-click", payload: "" });
    };

    // 일정삭제(DELETE) : mtodos배열에서 해당 id의 event 삭제
    const handleClickDeleteBtn = async (e) => {
        e.preventDefault();
        setMtodos(mtodos.filter(mtodos => mtodos.id !== state.eventId)); // mtodos 배열에 해당 event 삭제
        // DELETE
        await deleteApi(
            {
                uid: authContext.state.uid,
                m_todo_id: state.eventId,
            },
            "/tdl/monthly/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                console.log("mtdl delete success");
            })
            .catch((e) => {
                alert("월간 일정 삭제 실패. 네트워크를 확인해주세요.");
            });
        setInputs({ title: "", start: "", end: "" });
        dispatch({ type: "event-not-click", payload: "" });
        getMtodos();
    };

    return (
        <div className="Main-MonthlyComp">
            <div className="calendar-wrapper">
                <br />
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={mtodos}
                    editable='true' //eventStartEditable(dragging) & eventDurationEditable(기간 늘리기)
                    droppable="true"
                    eventStartEditable="true"
                    eventDurationEditable="true"
                    selectable="true"
                    select={isDateSelected}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    eventBackgroundColor="#5F45FF"
                    eventBorderColor="#5F45FF"
                />
            </div>
            <div className="Main-Monthly-input">
                <form className="Main-Monthly-inputform">
                    <input
                        className="input-title"
                        name="title"
                        onChange={(e) =>
                            setInputs({ ...inputs, title: e.target.value })
                        }
                        value={inputs.title}
                    />
                </form>
                <div className="Main-Monthly-Btns">
                    {state.isClicked ? (
                        <>
                            <button
                                className="Main-Monthly-changeBtn"
                                onClick={handleClickUpdateBtn}
                            >
                                변경
                            </button>
                            <button
                                className="Main-Monthly-deleteBtn"
                                onClick={handleClickDeleteBtn}
                            >
                                삭제
                            </button>
                        </>
                    ) : (
                        <button
                            className="Main-Monthly-createBtn"
                            onClick={onCreate}
                        >
                            일정추가
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonthlyComp;
