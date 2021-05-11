// TODO 컴포넌트 정리 및 리팩토링(reducer => immer 작성하기)
import React from "react";
import { useState } from "react";
import "../css/Main.css";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { useReducer, createContext, useContext } from "react";

const WeeklyContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_NEW":
            // TODO: post api 작성하기
            return state.map((s, i) => {
                if (s.dow === action.dow) {
                    return {
                        ...s,
                        tasks: s.tasks.concat({
                            // TODO post api로 받은 id로.
                            id: 4,
                            content: action.newTodo,
                            checked: false,
                        }),
                    };
                }
                return s;
            });

        case "UPDATE_CHECK":
            // TODO put api 작성
            return state.map((s, i) => {
                if (s.dow === action.dow) {
                    return {
                        ...s,
                        tasks: s.tasks.map((t, i2) => {
                            if (t.id === action.id) {
                                return { ...t, checked: !t.checked };
                            }
                            return t;
                        }),
                    };
                }
                return s;
            });
        case "UPDATE_CONTENT":
            // TODO put api 작성
            return state.map((s, i) => {
                if (s.dow === action.dow) {
                    return {
                        ...s,
                        tasks: s.tasks.map((t, i2) => {
                            if (t.id === action.id) {
                                return { ...t, content: action.content };
                            }
                            return t;
                        }),
                    };
                }
                return s;
            });

        case "DELETE":
            // TODO delete api 작성
            // delete api 작성
            return state.map((s, i) => {
                if (s.dow === action.dow) {
                    return {
                        ...s,
                        tasks: s.tasks.filter((t, i2) => t.id !== action.id),
                    };
                }
                return s;
            });
    }
};

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

const TaskItem = ({ dow, id, checked, content }) => {
    const weeklyContext = useContext(WeeklyContext);
    const [todo, setTodo] = useState(content);
    const handleCheck = () => {
        weeklyContext.dispatch({ type: "UPDATE_CHECK", id, dow });
    };
    const handleUpdateButton = () => {
        // todo update만.
        weeklyContext.dispatch({
            type: "UPDATE_CONTENT",
            id,
            dow,
            content: todo,
        });
    };
    const handleDeleteButton = () => {
        weeklyContext.dispatch({
            type: "DELETE",
            id,
            dow,
        });
    };
    const handleChange = (e) => {
        setTodo(e.target.value);
    };
    return (
        <div key={id} className="Dow-todos-item">
            {checked ? (
                <GrCheckboxSelected
                    onClick={handleCheck}
                    className="checkbox"
                />
            ) : (
                <GrCheckbox onClick={handleCheck} className="checkbox" />
            )}
            <input value={todo} onChange={handleChange}></input>
            <button onClick={handleDeleteButton}>X</button>
            <button onClick={handleUpdateButton}>V</button>
        </div>
    );
};

const DayOfWeekComp = ({ dow, tasks }) => {
    // dow = day of week(요일)
    const [newTodo, setNewTodo] = useState("");
    const weeklyContext = useContext(WeeklyContext);
    const handleAddButtonClick = () => {
        // TODO: POST 들어가기
        weeklyContext.dispatch({ type: "ADD_NEW", dow, newTodo });
        setNewTodo("");
    };
    const handleNewChange = (e) => {
        setNewTodo(e.target.value);
    };
    return (
        <div className="Dow-wrapper">
            <h4>{dow}</h4>
            <div className="Dow-todos">
                {tasks.map((t, i) => (
                    <TaskItem
                        dow={dow}
                        key={t.id}
                        id={t.id}
                        checked={t.checked}
                        content={t.content}
                    />
                ))}
                <div className="New-input-wrapper">
                    <input
                        value={newTodo}
                        onChange={handleNewChange}
                        className="new-input"
                    ></input>
                    <button
                        onClick={handleAddButtonClick}
                        className="add-button"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

const WeeklyComp = () => {
    const [weeklyData, dispatch] = useReducer(reducer, initialData);
    return (
        <div className="Main-WeeklyComp">
            <h3>주간 일정</h3>
            <div className="Weekly-container">
                <div className="Weekly-wrapper">
                    <WeeklyContext.Provider value={{ weeklyData, dispatch }}>
                        <div className="Weekly-content">
                            {weeklyData.map((d, i) => (
                                <DayOfWeekComp
                                    key={d.dow}
                                    dow={d.dow}
                                    tasks={d.tasks}
                                ></DayOfWeekComp>
                            ))}
                        </div>
                    </WeeklyContext.Provider>
                </div>
            </div>
        </div>
    );
};

export default WeeklyComp;
