import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import reactDom from "react-dom";
import "../css/Main.css";
// import { AuthContext } from "../App";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

const MonthlyComp = () => {
    const reducer = (state, action) => { // 이벤트 클릭시 버튼 다르게 출력하기 위한 reducer
        switch (action.type) {
            case "eventclick":
                return { isClicked: true, eventId: action.payload};
            case "event-not-click":
                return { isClicked: false, eventId: null};
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
    const {title, start, end} = inputs;
    const [mtodos, setMtodos] = useState([ // mtodos 배열 데이터. 
        {
            id: 1,
            title: 'Test1',
            start: '2021-05-22',
            end: '2021-05-22'
        },
        {
            id: 2,
            title: 'Test2',
            start: '2021-05-06',
            end: '2021-05-09'
        }
    ]);
    
    const nextId = useRef(3);
    const onCreate = (e) => { // 일정 추가 함수
        e.preventDefault();
        const mtodo = { id: nextId.current, title, start, end };
        setMtodos(mtodos.concat(mtodo));
        setInputs({
            title: "",
            start: "",
            end: ""
        });
        nextId.current += 1;
    };

    const handleDateClick = (arg) => { // bind with an arrow function
        dispatch({ type: "event-not-click", payload: "" });
        setInputs({ title: "", start: "", end: "" }); // 입력폼 빈칸으로
    }
    
    function handleEventClick(eventInfo) { 
        // 버튼 : 일정변경, 일정삭제 두 개 나타나는걸로 변경
        const event_title = eventInfo.event.title;
        const event_start = eventInfo.event.start;
        const event_end = eventInfo.event.end;
        const event_id = eventInfo.event.id;
        console.log(event_id);
        dispatch({ type: "eventclick", payload: event_id });
        // 이벤트 클릭 시 아래 입력폼에 내용 나타남. 
        const event_dates = dateFormat(event_start, event_end);
        setInputs({
            title: event_title,
            start: event_dates[0],
            end: event_dates[1]
        });
    }
    // 일정변경(UPDATE) : mtodos배열에서 해당 id의 event 변경해줌
    const updateEvent = (e) => {
        e.preventDefault();
        dispatch({ type: "event-not-click", payload: "" });
        
        setMtodos(
            mtodos.map(mtodo =>
                mtodo.id == state.eventId ? { ...mtodo, title: inputs.title, start: inputs.start, end: inputs.end } : mtodo
            )
        );

        setInputs({ title: "", start: "", end: "" }); // 입력폼 빈칸으로
    }
    
    // 일정삭제(DELETE) : mtodos배열에서 해당 id의 event 삭제
    const deleteEvent = (e) => {
        e.preventDefault();
        setInputs({ title: "", start: "", end: "" }); // 입력폼 빈칸으로
        dispatch({ type: "event-not-click", payload: "" });

        setMtodos(mtodos.filter(mtodos => mtodos.id != state.eventId)); // mtodos 배열에 해당 event 삭제
        
    }
    
    function dateFormat(start, end){ // 날짜는 yyyy-mm-dd형식으로 바꿔줌
        var temp1 = start.toString().split(' ');
        var temp2 = 0;
        if (end === null) { // 하루일 경우 end=null이므로 start와 같게 처리
            temp2 = temp1;
        } else {
            temp2 = end.toString().split(' ');
        }
        var s_year = temp1[3]; var s_month = temp1[1]; var s_day = temp1[2];
        var e_year = temp2[3]; var e_month = temp2[1]; var e_day = temp2[2];
        
        var s_date = 0; var e_date = 0;
        s_date = s_year+'-'+monthChange(s_month)+'-'+s_day;
        e_date = e_year+'-'+monthChange(e_month)+'-'+e_day;
        return [s_date.toString(), e_date.toString()]; // 배열로 리턴
    }
    function monthChange(month){
        var ss_month = '';
        switch(month){
            case 'Jan': ss_month = '01'; break;
            case 'Feb': ss_month = '02'; break;
            case 'Mar': ss_month = '03'; break; 
            case 'Apr': ss_month = '04'; break;
            case 'May': ss_month = '05'; break;
            case 'Jun': ss_month = '06'; break;
            case 'Jul': ss_month = '07'; break; 
            case 'Aug': ss_month = '08'; break;
            case 'Sep': ss_month = '09'; break;
            case 'Oct': ss_month = '10'; break;
            case 'Nov': ss_month = '11'; break; 
            case 'Dec': ss_month = '12'; break;
        }
        return ss_month;
    }
    
    
    return (
        <div className="Main-MonthlyComp"> 
            <FullCalendar
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView="dayGridMonth"
                events={mtodos}
                editable="true"
                eventStartEditable="true"
                eventDurationEditable="true"
                dateClick={handleDateClick} // 아직 쓸일 X
                // selectable='true'
                eventClick={handleEventClick}
            />

            <form className="Monthly-inputform">
                <div>내용:
                    <input
                        className="input-title"
                        name="title"
                        onChange={(e) =>
                            setInputs({ ...inputs, title: e.target.value })
                        }
                        value={inputs.title}
                    />
                </div>
                <div>시작날짜:
                    <input
                        type="date"
                        onChange={(e) =>
                            setInputs({ ...inputs, start: e.target.value })
                        }
                        value={inputs.start}
                        name="start"
                    />
                </div>
                <div>끝날짜:
                    <input
                        type="date"
                        onChange={(e) =>
                            setInputs({ ...inputs, end: e.target.value })
                        }
                        value={inputs.end}
                        name="end"
                    />
                </div>
                
                {state.isClicked ? (
                    <>
                    <button onClick={updateEvent}>일정변경</button>
                    <button onClick={deleteEvent}>일정삭제</button>
                    </>
                ) : (
                    <button onClick={onCreate}>일정추가</button>
                )}
                
            </form>
        </div>
    );
};

export default MonthlyComp;

