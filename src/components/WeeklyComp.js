import React from "react";
import { useState } from "react";
import "../css/Main.css";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";

const initialData = [
    {
        dow: "월",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: false },
        ],
    },
    {
        dow: "화",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "수",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "목",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "금",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "토",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "일",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
];

const TaskItem = ({ id, checked, content, setWeeklyData }) => {
    const CheckBox = checked ? (
        <GrCheckboxSelected onClick={() => {}} className="checkbox" />
    ) : (
        <GrCheckbox onClick={() => {}} className="checkbox" />
    );
    const handleCheck = () => {
        // ! reduce 써서 checked update
    };
    const handleSubmit = () => {
        // todo update or post
    };
    const [todo, setTodo] = useState(content);
    const handleChange = (e) => {
        setTodo(e.target.value);
    };
    return (
        <div key={id} className="Dow-todos-item">
            {CheckBox}
            <input value={todo} onChange={handleChange}></input>
            <button onClick={handleSubmit}>V</button>
        </div>
    );
};

const DayOfWeekComp = ({ dow, tasks, setWeeklyData }) => {
    // dow = day of week(요일)
    const handleAddClick = () => {};
    return (
        <div className="Dow-wrapper">
            <h4>{dow}</h4>
            <div className="Dow-todos">
                {tasks.map((t, i) => (
                    <TaskItem
                        dow={dow}
                        id={t.id}
                        checked={t.checked}
                        content={t.content}
                        setWeeklyData={setWeeklyData}
                    />
                ))}
                <button onClick={() => {}} className="addbutton">
                    +
                </button>
            </div>
        </div>
    );
};

const WeeklyComp = () => {
    const [weeklyData, setWeeklyData] = useState(initialData);

    return (
        <div className="Main-WeeklyComp">
            <h3>주간 일정</h3>
            <div className="Weekly-container">
                <div className="Weekly-wrapper">
                    <div className="Weekly-content">
                        {weeklyData.map((d, i) => (
                            <DayOfWeekComp
                                key={i}
                                dow={d.dow}
                                tasks={d.tasks}
                                setWeeklyData={setWeeklyData}
                            ></DayOfWeekComp>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyComp;
