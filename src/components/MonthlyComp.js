import React, { useCallback, useRef } from "react";
import reactDom from "react-dom";
import TUICalendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import "../css/Main.css";

const MonthlyComp = () => {
    const cal = useRef(null);
    const calendarId = 0;

    const onClickSchedule = useCallback((e) => { // 등록된 스케줄 클릭 시
        const { id } = e.schedule;
        const el = cal.current.calendarInst.getElement(id);
    }, []);

    const onBeforeCreateSchedule = useCallback((scheduleData) => { // 스케줄 생성직전
        console.log(scheduleData);

        const schedule = {
            id: String(Math.random()),
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? "allday" : "time",
            dueDateClass: "",
            location: scheduleData.location,
            raw: {
                class: scheduleData.raw["class"]
            },
            state: scheduleData.state
        };

        cal.current.calendarInst.createSchedules([schedule]); // 스케줄 생성-캘린더에 반영
    }, []);

    const onBeforeDeleteSchedule = useCallback((res) => { // 스케줄 삭제 직전
        console.log(res);

        const { id, calendarId } = res.schedule;

        cal.current.calendarInst.deleteSchedule(id, calendarId); // 스케줄 삭제-캘린더에 반영
    }, []);

    const onBeforeUpdateSchedule = useCallback((e) => { // 스케줄 업데이트 직전
        console.log(e);

        const { schedule, changes } = e;

        cal.current.calendarInst.updateSchedule( // 스케줄 업데이트-캘린더에 반영
            schedule.id,
            schedule.calendarId,
            changes
        );
    }, []);

    // function prevBtnClick() {
    //     // calendar.prev();
    // }

    // function nextBtnClick() {
    //     // calendar.next();
    // }
    
    return (
        <div className="Main-MonthlyComp"> 
            MonthlyComp
            {/* <button className="prevBtn" onClick={prevBtnClick}>이전</button>
            <button className="nextBtn" onClick={nextBtnClick}>다음</button> */}
            
            <TUICalendar 
                ref={cal}
                height="600px"
                view="month"
                useCreationPopup={true}
                useDetailPopup={true}
                // template={templates}
                // calendars={calendars}
                // schedules={schedules}
                onClickSchedule={onClickSchedule} 
                onBeforeCreateSchedule={onBeforeCreateSchedule} //post
                onBeforeDeleteSchedule={onBeforeDeleteSchedule} //delete
                onBeforeUpdateSchedule={onBeforeUpdateSchedule} //update
            />
            
        </div>
    );
};

export default MonthlyComp;
