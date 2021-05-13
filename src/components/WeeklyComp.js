// TODO 컴포넌트 정리 및 리팩토링(reducer => immer 작성하기)
// 1. w_date 추가하기
import React from "react";
import { useState } from "react";
import "../css/Main.css";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { useReducer, createContext, useContext } from "react";
import { useEffect } from "react";
import { getApi, postApi, putApi, deleteApi } from "../api";
import { AuthContext } from "../App";

const WeeklyContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "GET_ALL":
            return action.w_todo_list.map((d, i) => ({
                dow: state[i].dow,
                date: d.w_date,
                tasks: d.w_todos.map((t) => ({
                    id: t.w_id,
                    content: t.w_content,
                    checked: t.w_checked,
                })),
            }));

        case "ADD_NEW":
            return state.map((s, i) => {
                if (s.dow === action.dow) {
                    return {
                        ...s,
                        tasks: s.tasks.concat({
                            // TODO post api로 받은 id로.
                            id: action.id,
                            content: action.newTodo,
                            checked: false,
                        }),
                    };
                }
                return s;
            });

        case "UPDATE_CHECK":
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
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: false },
        ],
    },
    {
        dow: "화",
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "수",
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "목",
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "금",
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "토",
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
    {
        dow: "일",
        date: "",
        tasks: [
            { id: 1, content: "설거지", checked: true },
            { id: 2, content: "설거지", checked: true },
            { id: 3, content: "설거지", checked: true },
        ],
    },
];

const reverse = (a, b) => {
    return b - a;
};

const getTheDate = (a, b, now, temp, isReverse) => {
    let arr = [...Array(a).keys()];
    arr = isReverse ? arr.sort(reverse) : arr;

    return arr.map((j) => {
        const dd = isReverse ? -1 * j + b : j;
        return new Date(temp.setDate(now.getDate() + dd))
            .toISOString()
            .substring(0, 10);
    });
};

const calTheDates = () => {
    // output: date string(2021-02-03 꼴)의 배열: 그 주의 월-일까지의 일자
    // 일, 월, 화, 수, 목, 금, 토
    const now = new Date();
    const temp = new Date();
    const i = now.getDay();
    let dates = [];
    if (i !== 0) {
        dates = getTheDate(i - 1, -1, now, temp, true);
        dates.concat(getTheDate(8 - i, 0, now, temp, false));
        // dates = [...Array(i - 1).keys()]
        //     .sort(reverse)
        //     .map((j) =>
        //         new Date(temp.setDate(now.getDate() - j - 1))
        //             .toISOString()
        //             .substring(0, 10)
        //     );
        // dates.concat(
        //     [...Array(8 - i).keys()].map((j) =>
        //         new Date(temp.setDate(now.getDate() + j))
        //             .toISOString()
        //             .substring(0, 10)
        //     )
        // );
    } else {
        dates = getTheDate(7, 0, now, temp, true);
        // dates = [...Array(7).keys()]
        //     .sort(reverse)
        //     .map((j) =>
        //         new Date(now.setDate(now.getDate() - j))
        //             .toISOString()
        //             .substring(0, 10)
        //     );
    }
    return dates;
};

const TaskItem = ({ dow, id, date, checked, content }) => {
    const weeklyContext = useContext(WeeklyContext);
    const authContext = useContext(AuthContext);
    const [todo, setTodo] = useState(content);
    const handleCheck = () => {
        // * 실제 api
        const { status, data } = putApi(
            {
                uid: authContext.state.uid,
                w_todo_id: id,
                w_content: content,
                w_check: !checked === false ? "F" : "T",
                w_date: date,
            },
            "/tdl/weekly"
        );
        if (status === 200) {
            weeklyContext.dispatch({ type: "UPDATE_CHECK", id, dow });
        } else {
            alert("인터넷 연결 불안정");
        }
        // * dummy
        // weeklyContext.dispatch({ type: "UPDATE_CHECK", id, dow });
    };
    const handleUpdateButton = () => {
        // * 실제 api
        const { status, data } = putApi(
            {
                uid: authContext.state.uid,
                w_todo_id: id,
                w_content: todo,
                w_check: checked,
                w_date: date,
            },
            "/tdl/weekly"
        );
        if (status === 200) {
            weeklyContext.dispatch({
                type: "UPDATE_CONTENT",
                id,
                dow,
                content: todo,
            });
        } else {
            alert("인터넷 연결 불안정");
        }
        // * dummy data
        // weeklyContext.dispatch({
        //     type: "UPDATE_CONTENT",
        //     id,
        //     dow,
        //     content: todo,
        // });
    };
    const handleDeleteButton = () => {
        const { status, data } = deleteApi({}, "/tdl/weekly");
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

const DayOfWeekComp = ({ dow, date, tasks }) => {
    // dow = day of week(요일)
    const [newTodo, setNewTodo] = useState("");
    const weeklyContext = useContext(WeeklyContext);
    const authContext = useContext(AuthContext);

    const handleAddButtonClick = async () => {
        // * 실제 쓰이는 코드
        const { status, data } = await postApi(
            {
                uid: authContext.state.uid,
                w_date: date,
                w_content: newTodo,
                w_check: "F",
            },
            "/tdl/weekly"
        );
        if (status === 200) {
            weeklyContext.dispatch({
                type: "ADD_NEW",
                dow,
                newTodo,
                id: data.w_todo_id,
            });
        } else {
            alert("인터넷 연결이 불안정합니다.");
        }
        // dummy code
        // weeklyContext.dispatch({
        //     type: "ADD_NEW",
        //     dow,
        //     newTodo,
        //     id: 4,
        // });
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
                        date={date}
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
    const authContext = useContext(AuthContext);
    useEffect(() => {
        const getWeeklyData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                    dates: calTheDates(),
                },
                "/tdl/weekly"
            );
            await console.log("실패했나 안했나");
            if (status === 200) {
                await console.log(status, data);
                await console.log(data.w_todo_list);
                await dispatch({
                    type: "GET_ALL",
                    w_todo_list: data.w_todo_list,
                });
            } else {
                await console.log(status, data);
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        getWeeklyData();
        console.log("use effect");
    }, []);
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
                                    date={d.date}
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
