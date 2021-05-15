import React, {
    useRef,
    useEffect,
    useState,
    useContext,
    useReducer,
} from "react";
import "../css/Main.css";
import { AuthContext } from "../App";
import { getApi, postApi, putApi, deleteApi } from "../api";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { ContinuousColorLegend } from "react-vis";

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
    useEffect(() => {
        const getMtodos = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/tdl/monthly/"
            );
            await console.log("아아아아아ㅏ");
            if (status === 200) {
                // data : [m_todo_id, stt_date, end_date, m_content] 배열 여러개.
                // map으로 각각 setMtodos로 id, start, end, title에 넣어주기
                await console.log(data.m_todo_list);
                await setMtodos(
                    data.m_todo_list.map((mdata, i) => ({
                        id: mdata.m_todo_id,
                        start: mdata.stt_date,
                        end: mdata.end_date,
                        title: mdata.m_content,
                    }))
                );
                await console.log("mtodos:", mtodos);
            } else {
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        getMtodos();
    }, []);

    const onCreate = async (e) => {
        // 일정 추가 함수
        e.preventDefault();
        // POST
        const { status, data } = await postApi(
            {
                uid: authContext.state.uid,
                stt_date: start,
                end_date: end,
                m_content: title,
            },
            "/tdl/monthly/"
        );
        // * dummy code
        // const { status, data } = {
        //     status: 200,
        //     data: { m_todo_id: "1" },
        // };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl post fail" },
        // };
        if (status === 200) {
            const eventId = data.m_todo_id;
            const mtodo = { id: eventId, title, start, end };
            setMtodos(mtodos.concat(mtodo));
            console.log("mtdl post success");
        } else {
            console.log("mtdl post fail");
        }

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

        setMtodos(
            // mtodos 배열에  반영
            mtodos.map((mtodo) =>
                mtodo.id == eventId
                    ? {
                          ...mtodo,
                          title: eventInfo.oldEvent.title,
                          start: newStart,
                          end: newEnd,
                      }
                    : mtodo
            )
        );

        //UPDATE
        const { status, data } = await putApi(
            {
                uid: authContext.state.uid,
                m_todo_id: eventId,
                stt_date: newStart,
                end_date: newEnd,
                m_content: eventInfo.oldEvent.title,
            },
            "/tdl/monthly/"
        );
        // * dummy date
        // const { status, data } = {
        //     status: 200,
        //     data: { m_todo_id: "1" },
        // };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl update fail" },
        // };
        if (status === 200) {
            console.log("mtdl update success");
        } else {
            console.log("mtdl update fail");
        }
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
        setMtodos(
            // mtodos 배열에  반영
            mtodos.map((mtodo) =>
                mtodo.id == eventId
                    ? {
                          ...mtodo,
                          title: eventInfo.oldEvent.title,
                          start: eventInfo.oldEvent.startStr,
                          end: newEnd,
                      }
                    : mtodo
            )
        );
        //UPDATE
        const { status, data } = await putApi(
            {
                uid: authContext.state.uid,
                m_todo_id: eventId,
                stt_date: eventInfo.oldEvent.startStr,
                end_date: newEnd,
                m_content: eventInfo.oldEvent.title,
            },
            "/tdl/monthly/"
        );
        // * dummy date
        // const { status, data } = {
        //     status: 200,
        //     data: { m_todo_id: "1" },
        // };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl update fail" },
        // };
        if (status === 200) {
            console.log("mtdl update success");
        } else {
            console.log("mtdl update fail");
        }
    };

    // 일정변경(UPDATE) : mtodos배열에서 해당 id의 event 변경해줌
    const handleClickUpdateBtn = async (e) => {
        e.preventDefault();

        setMtodos(
            mtodos.map((mtodo) =>
                mtodo.id == state.eventId
                    ? {
                          ...mtodo,
                          title: inputs.title,
                          start: inputs.start,
                          end: inputs.end,
                      }
                    : mtodo
            )
        );

        //UPDATE
        const { status, data } = await putApi(
            {
                uid: authContext.state.uid,
                m_todo_id: state.eventId,
                stt_date: inputs.start,
                end_date: inputs.end,
                m_content: inputs.title,
            },
            "/tdl/monthly/"
        );
        // * dummy data
        // const { status, data } = {
        //     status: 200,
        //     data: { m_todo_id: "1" },
        // };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl update fail" },
        // };

        if (status === 200) {
            console.log("update success");
        } else {
            console.log("mtdl update fail");
        }

        setInputs({ title: "", start: "", end: "" });
        dispatch({ type: "event-not-click", payload: "" });
    };

    // 일정삭제(DELETE) : mtodos배열에서 해당 id의 event 삭제
    const handleClickDeleteBtn = async (e) => {
        e.preventDefault();
        setMtodos(mtodos.filter((mtodos) => mtodos.id != state.eventId)); // mtodos 배열에 해당 event 삭제
        // DELETE
        const { status, data } = await deleteApi(
            {
                uid: authContext.state.uid,
                m_todo_id: state.eventId,
            },
            "/tdl/monthly/"
        );
        // * dummy date
        // const { status, data } = {
        //     status: 200,
        //     data: { m_todo_id: "2" }
        // };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl delete fail" },
        // };
        if (status === 200) {
            console.log("mtdl delete success");
        } else {
            console.log("mtdl delete fail");
        }

        setInputs({ title: "", start: "", end: "" });
        dispatch({ type: "event-not-click", payload: "" });
    };

    return (
        <div className="Main-MonthlyComp">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={mtodos}
                // editable='true' //eventStartEditable(dragging) & eventDurationEditable(기간 늘리기)
                droppable="true"
                eventStartEditable="true"
                eventDurationEditable="true"
                selectable="true"
                select={isDateSelected}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                eventBackgroundColor="#C4C4C4"
                eventBorderColor="#C4C4C4"
            />
            <div className="Main-Monthly-input">
                <form className="Main-Monthly-inputform">
                    <div>
                        <label>내용</label>
                        <input
                            className="input-title"
                            name="title"
                            onChange={(e) =>
                                setInputs({ ...inputs, title: e.target.value })
                            }
                            value={inputs.title}
                        />
                    </div>
                    <div>
                        <label>시작날짜</label>
                        <input
                            type="date"
                            onChange={(e) =>
                                setInputs({ ...inputs, start: e.target.value })
                            }
                            value={inputs.start}
                            name="start"
                        />
                    </div>
                    <div>
                        <label>끝날짜</label>
                        <input
                            type="date"
                            onChange={(e) =>
                                setInputs({ ...inputs, end: e.target.value })
                            }
                            value={inputs.end}
                            name="end"
                        />
                    </div>
                </form>
                <div className="Main-Monthly-Btns">
                    {state.isClicked ? (
                        <>
                            <button
                                className="Main-Monthly-changeBtn"
                                onClick={handleClickUpdateBtn}
                            >
                                일정변경
                            </button>
                            <button
                                className="Main-Monthly-deleteBtn"
                                onClick={handleClickDeleteBtn}
                            >
                                일정삭제
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
