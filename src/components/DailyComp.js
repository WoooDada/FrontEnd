import React, {
    useReducer,
    useEffect,
    useState,
    useContext,
    createContext,
    useRef,
} from "react";
import { AuthContext } from "../App";
import "../css/LeftStudy.css";
import { getApi, postApi, putApi, deleteApi } from "../api";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import TenMinPlanner from "./TenMinPlanner";

const DailyContext = createContext(null);

const initialData = [
    // {
    //     id: 1,
    //     d_date: "2021-05-20",
    //     d_content: "졸작회의",
    //     d_check: true,
    //     d_tag: "3~5",
    // },
    // {
    //     id: 2,
    //     d_date: "2021-05-20",
    //     d_content: "졸작회의",
    //     d_check: false,
    //     d_tag: "",
    // },
];

function reducer(state, action) {
    switch (action.type) {
        case "GET_TODO":
            return action.dtodos.map((d, i) => ({
                // id: d.id,
                id: d.d_todo_id,
                d_date: d.d_date,
                d_tag: d.d_tag,
                d_content: d.d_content,
                d_check: d.d_check,
            }));

        case "CREATE_TODO":
            return state.concat(action.dtodo);

        case "CHECK_TODO":
            return state.map((dtodo) =>
                dtodo.id === action.id
                    ? {
                          ...dtodo,
                          d_check: !dtodo.d_check,
                      }
                    : dtodo
            );

        case "DELETE_TODO":
            return state.filter((dtodo) => dtodo.id !== action.id);

        default:
            return state;
    }
}

const DateFormat = () => {
    const today = new Date();
    var todayMonth = "";
    if ((today.getMonth() + 1).toString().length == 1) {
        todayMonth = "0" + (today.getMonth() + 1).toString();
    } else {
        todayMonth = today.getMonth() + 1;
    }
    var todayDate = "";
    if (today.getDate().toString().length == 1) {
        todayDate = "0" + today.getDate().toString();
    } else {
        todayDate = today.getDate();
    }
    console.log(todayDate);
    const result = "".concat(
        today.getFullYear(),
        "-",
        todayMonth,
        "-",
        todayDate
    );
    return result;
};

const DtodosInput = () => {
    const nextId = useRef(3);
    const dailyContext = useContext(DailyContext);
    const authContext = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        tag: "",
        content: "",
    });

    var newtag = null;
    var newcontent = null;
    const addBtnHandler = async () => {
        if (inputs.tag === "") {
            newtag = null;
        } else {
            newtag = inputs.tag;
        }
        if (inputs.content === "") {
            newcontent = null;
        } else {
            newcontent = inputs.content;
        }
        const { status, data } = await postApi(
            {
                uid: authContext.state.uid,
                d_date: DateFormat(),
                d_content: newcontent,
                d_tag: newtag,
                d_check: "F",
            },
            "/tdl/daily/"
        );
        // dummy data
        // const { status, data } = {
        //     status: 200,
        // };
        console.log("CREATE_TODO = POST입니다");
        if (status === 200) {
            dailyContext.dispatch({
                type: "CREATE_TODO",
                dtodo: {
                    id: data.d_todo_id,
                    // id: nextId.current,
                    d_date: DateFormat(),
                    d_content: inputs.content,
                    d_tag: inputs.tag,
                    d_check: false,
                },
            });
        } else {
            alert("인터넷 연결이 불안정합니다.");
        }

        setInputs({
            tag: "",
            content: "",
        });
        nextId.current += 1;
    };

    return (
        <div className="daily-lower-input">
            <input
                name="tag"
                style={{ width: "30%" }}
                onChange={(e) => setInputs({ ...inputs, tag: e.target.value })}
                value={inputs.tag}
            />
            <input
                name="content"
                style={{ width: "60%" }}
                onChange={(e) =>
                    setInputs({ ...inputs, content: e.target.value })
                }
                value={inputs.content}
            />
            <button onClick={addBtnHandler} className="add-button">
                +
            </button>
        </div>
    );
};

const DTodosItem = ({ id, d_date, d_content, d_tag, d_check }) => {
    const dailyContext = useContext(DailyContext);
    const authContext = useContext(AuthContext);

    const clickCheck = async () => {
        const { status, data } = await putApi(
            {
                uid: authContext.state.uid,
                d_todo_id: id,
                d_content: d_content,
                d_tag: d_tag,
                d_check: !d_check === false ? "F" : "T",
                d_date: d_date,
            },
            "/tdl/daily/"
        );
        // const { status, data } = {
        //     status: 200,
        // };
        console.log("이거슨 CHECK");
        if (status === 200) {
            await dailyContext.dispatch({
                type: "CHECK_TODO",
                id,
            });
        } else {
            alert("인터넷 연결 불안정");
        }
    };

    const clickDelete = async () => {
        const { status, data } = await deleteApi(
            {
                uid: authContext.state.uid,
                d_todo_id: id,
            },
            "/tdl/daily/"
        );
        // const { status, data } = {
        //     status: 200,
        // };
        console.log("DELETE입니다우우우");
        if (status === 200) {
            await dailyContext.dispatch({
                type: "DELETE_TODO",
                id,
            });
        } else {
            await alert("네트워크 불안정");
        }
    };

    return (
        <div key={id} className="daily-todo-item">
            <span style={{ width: "30%" }} className="daily-todo-item-tag">
                {d_tag}
            </span>
            <span style={{ width: "60%" }}>{d_content}</span>
            {d_check ? (
                <GrCheckboxSelected
                    onClick={clickCheck}
                    className="daily-checkbox-true"
                />
            ) : (
                <GrCheckbox
                    onClick={clickCheck}
                    className="daily-checkbox-false"
                />
            )}
            <span className="daily-todo-item-x" onClick={clickDelete}>
                X
            </span>
        </div>
    );
};

const DTodosList = ({ id, d_date, d_content, d_tag, d_check }) => {
    // const dailyContext = useContext(DailyContext);

    return (
        <div>
            <DTodosItem
                key={id}
                id={id}
                d_date={d_date}
                d_content={d_content}
                d_tag={d_tag}
                d_check={d_check}
            />
        </div>
    );
};

const DailyComp = () => {
    const [dtodos, dispatch] = useReducer(reducer, initialData);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const getDailyData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                    d_date: DateFormat(),
                },
                "/tdl/daily/"
            );
            await console.log("GET아아아");
            if (status === 200) {
                await dispatch({
                    type: "GET_TODO",
                    dtodos: data.d_todo_list,
                });
                await console.log(data.d_todo_list);
            } else {
                await console.log(status, data);
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        getDailyData();
    }, []);

    return (
        <div className="daily-comp">
            <div className="daily-study-comp">
                <div className="daily-planner">
                    <div className="daily-todo-upper">
                        <div className="daily-todo-upper-tag">
                            <span>시간대</span>
                        </div>
                        <div className="daily-todo-upper-content">
                            <span>할 일</span>
                        </div>
                    </div>
                    <div className="daily-todo-wrapper">
                        <DailyContext.Provider value={{ dtodos, dispatch }}>
                            <div>
                                {dtodos.map((d) => (
                                    <DTodosList
                                        key={d.id}
                                        id={d.id}
                                        d_date={d.d_date}
                                        d_content={d.d_content}
                                        d_tag={d.d_tag}
                                        d_check={d.d_check}
                                    ></DTodosList>
                                ))}
                                <DtodosInput />
                            </div>
                        </DailyContext.Provider>
                    </div>
                </div>
                <TenMinPlanner />
            </div>
        </div>
    );
};

export default DailyComp;
