import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import "../css/Main.css";
import { AuthContext } from "../App";
import { getApi, postApi, putApi, deleteApi } from "../api";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

const MonthlyComp = () => {
    const authContext = useContext(AuthContext);
    const [mtodos, setMtodos] = useState([
    ]);
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
    const reducer = (state, action) => { // 이벤트 클릭시 버튼 다르게 출력하기 위한 reducer
        switch (action.type) {
            case "eventclick":
                return { isClicked: true, eventId: action.payload };
            case "event-not-click":
                return { isClicked: false, eventId: null };
            default:
                return { isClicked: false, eventId: null };
        }
    };
    const [state, dispatch] = useReducer(reducer, { isClicked: false, eventId: null });
    const [inputs, setInputs] = useState({ // input data from input form
        title: "",
        start: "",
        end: ""
    });
    const { title, start, end } = inputs;
    // GET
    useEffect(() => { 
        const getMtodos = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/tdl/monthly"
            );
            if (status === 200) { 
                // data : [m_todo_id, stt_date, end_date, m_content] 배열 여러개.
                // map으로 각각 setMtodos로 id, start, end, title에 넣어주기
                data.m_todo_list.map((mdata, i) => {
                    setMtodos([
                        ...mtodos,
                        {
                            id: mdata.m_todo_id,
                            start: mdata.stt_date,
                            end: mdata.end_date,
                            title: mdata.m_content,
                        }
                    ]);
                });
            } else {
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        // getMtodos();
    }, []);

    const nextId = useRef(mtodos.length); // length: 마지막 원소의 인덱스 값보다 1 큰 수를 반환
    const onCreate = async (e) => { // 일정 추가 함수
        e.preventDefault();
        const mtodo = { id: nextId.current, title, start, end };
        setMtodos(mtodos.concat(mtodo));
        setInputs({
            title: "",
            start: "",
            end: ""
        });
        nextId.current += 1;
        console.log('created id :', nextId.current);
        console.log(mtodos);
        // POST
        // const { status, data } = await postApi(
        //     { 
        //         uid: authContext.state.uid, 
        //         m_todo_id: nextId.current, 
        //         stt_date: start,
        //         end_date: end,
        //         m_content: title, 
        //     }, '/tdl/monthly');
        // * dummy code
        const { status, data } = {
            status: 200,
            data: { m_todo_id: "1" },
        };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl post fail" },
        // };
        if (status === 200) {
            console.log('mtdl post success');
        } else {
            console.log('mtdl post fail');
        }
        
    };

    const handleDateClick = (arg) => { // 빈 날짜 클릭 시
        dispatch({ type: "event-not-click", payload: "" });
        setInputs({ title: "", start: arg.dateStr, end: arg.dateStr }); // start, end 날짜 모두 클릭한 날짜로
        // (확장) 한번 클릭하면 start, 그 상태로 start 이후의 다른 날짜 클릭하면 end로 입력


    }

    function handleEventClick(eventInfo) {
        // 버튼 : 일정변경, 일정삭제 두 개 나타나는걸로 변경
        const event_title = eventInfo.event.title;
        const event_start = eventInfo.event.start;
        const event_end = eventInfo.event.end;
        const event_id = eventInfo.event.id;
        dispatch({ type: "eventclick", payload: event_id });
        // 이벤트 클릭 시 아래 입력폼에 내용 나타남. 
        const event_dates = dateFormat(event_start, event_end);
        setInputs({
            title: event_title,
            start: event_dates[0],
            end: event_dates[1]
        });
    }

    function handleEventDrop(eventInfo) {
        const event_title = eventInfo.event.title;
        const event_start = eventInfo.event.start;
        const event_end = eventInfo.event.end;
        const event_id = eventInfo.event.id;
        dispatch({ type: "eventclick", payload: event_id });
        // 이벤트 클릭 시 아래 입력폼에 내용 나타남. 
        const event_dates = dateFormat(event_start, event_end);
        setInputs({
            title: event_title,
            start: event_dates[0],
            end: event_dates[1]
        });

        //UPDATE
        // const { status, data } = putApi( 
        //     {
        //         uid: authContext.state.uid,
        //         m_todo_id: state.eventId, 
        //         stt_date: inputs.start, 
        //         end_date: inputs.end, 
        //         m_content: inputs.title,
        //     }, '/mtdl/monthly'
        // );
        // * dummy date
        const { status, data } = {
            status: 200,
            data: { m_todo_id: "1" },
        };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl update fail" },
        // };

        if (status === 200) {
            console.log('mtdl update success');
        } else {
            console.log('mtdl update fail');
        }
        
    }
    // 일정변경(UPDATE) : mtodos배열에서 해당 id의 event 변경해줌
    const handleClickUpdateBtn = async (e) => {
        e.preventDefault();
        dispatch({ type: "event-not-click", payload: "" });
        setMtodos(
            mtodos.map(mtodo =>
                mtodo.id == state.eventId ? { ...mtodo, title: inputs.title, start: inputs.start, end: inputs.end } : mtodo
            )
        );
        setInputs({ title: "", start: "", end: "" }); // 입력폼 빈칸으로
        //UPDATE
        // const { status, data } = putApi( 
        //     {
        //         uid: authContext.state.uid,
        //         m_todo_id: state.eventId, 
        //         stt_date: inputs.start, 
        //         end_date: inputs.end, 
        //         m_content: inputs.title,
        //     }, '/mtdl/monthly'
        // );
        // * dummy data
        const { status, data } = {
            status: 200,
            data: { m_todo_id: "1" },
        };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl update fail" },
        // };

        if (status === 200) {
            console.log('update success');
        } else {
            console.log('mtdl update fail');
        }
    }

    // 일정삭제(DELETE) : mtodos배열에서 해당 id의 event 삭제
    const handleClickDeleteBtn = async (e) => {
        e.preventDefault();
        setInputs({ title: "", start: "", end: "" }); // 입력폼 빈칸으로
        dispatch({ type: "event-not-click", payload: "" });

        setMtodos(mtodos.filter(mtodos => mtodos.id != state.eventId)); // mtodos 배열에 해당 event 삭제

        // DELETE
        // const { status, data } = await deleteApi(
        //     {
        //         uid: authContext.state.uid,
        //         m_todo_id: state.eventId,
        //     }, '/tdl/monthly'
        // );
        // * dummy date
        const { status, data } = {
            status: 200,
            data: { m_todo_id: "2" }
        };
        // const { status, data } = {
        //     status: 400,
        //     data: { message: "mtdl delete fail" },
        // };
        if (status === 200) {
            console.log('mtdl delete success');
        } else {
            console.log('mtdl delete fail');
        }
    }

    function dateFormat(start, end) { // 날짜는 yyyy-mm-dd형식으로 바꿔줌
        var temp1 = start.toString().split(' ');
        var temp2 = 0;
        if (end === null) { // 하루일 경우 end=null이므로 start와 같게 처리
            temp2 = temp1;
        } else {
            temp2 = end.toString().split(' ');
        }
        var s_month = temp1[1]; var s_day = temp1[2]; var s_year = temp1[3];
        var e_month = temp2[1]; var e_day = temp2[2]; var e_year = temp2[3]; 

        var s_date = 0; var e_date = 0;
        s_date = s_year + '-' + monthChange(s_month) + '-' + s_day;
        e_date = e_year + '-' + monthChange(e_month) + '-' + e_day;
        return [s_date.toString(), e_date.toString()]; // 배열로 리턴
    }
    function monthChange(month) {
        var intmonth = '';
        switch (month) {
            case 'Jan': intmonth = '01'; break;
            case 'Feb': intmonth = '02'; break;
            case 'Mar': intmonth = '03'; break;
            case 'Apr': intmonth = '04'; break;
            case 'May': intmonth = '05'; break;
            case 'Jun': intmonth = '06'; break;
            case 'Jul': intmonth = '07'; break;
            case 'Aug': intmonth = '08'; break;
            case 'Sep': intmonth = '09'; break;
            case 'Oct': intmonth = '10'; break;
            case 'Nov': intmonth = '11'; break;
            case 'Dec': intmonth = '12'; break;
        }
        return intmonth;
    }

    return (
        <div className="Main-MonthlyComp">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={mtodos}
                // editable='true' //eventStartEditable(dragging) & eventDurationEditable(기간 늘리기)
                droppable='true'
                eventStartEditable='true'
                selectable='true'
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventBackgroundColor='#C4C4C4'
                eventBorderColor='#C4C4C4'
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
                            <button className="Main-Monthly-changeBtn" onClick={handleClickUpdateBtn}>일정변경</button>
                            <button className="Main-Monthly-deleteBtn" onClick={handleClickDeleteBtn}>일정삭제</button>
                        </>
                    ) : (
                        <button className="Main-Monthly-createBtn" onClick={onCreate}>일정추가</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonthlyComp;

