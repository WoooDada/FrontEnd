import React, { 
    useReducer, 
    useEffect,
    useState,
    useContext,
    createContext,
    useRef,
} from 'react';
import { AuthContext } from "../App";
import '../css/LeftStudy.css';
import { getApi, postApi, putApi, deleteApi } from "../api";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";

const TenMinPlanner = () => {
    return (
        <div className="daily-tenmin">this is ten</div>
    );
};

const DailyContext = createContext(null);

const initialData = {
    dtodos: [],
}
// dummy data
// const initialData = {
//     dtodos: [
//         {
//             id: 1,
//             d_date: '2021-05-20',
//             d_content: '졸작회의',
//             d_check: true,
//             d_tag: '3~5',
//         },
//         {
//             id: 2,
//             d_date: '2021-05-20',
//             d_content: '졸작회의',
//             d_check: false,
//             d_tag: '',
//         },
//     ]
// };

function reducer(state, action) {
    switch (action.type) {
        case 'GET_TODO':
            return action.dtodos.map((d, i) => ({
                id: d.id,
                d_date: d.d_date,
                d_tag: d.d_tag,
                d_content: d.d_content,
                d_check: d.d_check,
            }));
            
        case 'CREATE_TODO':
            return {
                dtodos: state.dtodos.concat(action.dtodo)
            };
        case 'CHECK_TODO':
            return {
                ...state,
                dtodos: state.dtodos.map(dtodo => 
                    dtodo.id === action.id ? {
                         ...dtodo, 
                         d_check: !dtodo.d_check 
                    } : dtodo
                )
            };
        case 'DELETE_TODO':
            return {
                ...state,
                dtodos: state.dtodos.filter(dtodo => dtodo.id !== action.id)
            };
        
        default:
            return state;
    }
}

const PrintToday = () => {
    const today = new Date();
    var strDay = '';
    switch(today.getDay()){
        case 0:    strDay='(일)';
        case 1:    strDay='(월)';
        case 2:    strDay='(화)';
        case 3:    strDay='(수)';
        case 4:    strDay='(목)';
        case 5:    strDay='(금)';
        case 6:    strDay='(토)';
    }
    const result = "".concat(
        today.getFullYear(), '년 ', 
        today.getMonth() + 1, '월 ', 
        today.getDate(), '일 ', 
        strDay);
    return (
        <div>
            {result}
        </div>
    );
};

const DateFormat = () => {
    const today = new Date();
    var todayMonth = '';
    if ((today.getMonth()+1).toString().length == 1) {
        todayMonth = '0' + (today.getMonth()+1).toString();
    } else {
        todayMonth = today.getMonth()+1;
    }
    

    const result = "".concat(
        today.getFullYear(), '-', 
        todayMonth, '-', 
        today.getDate());
        console.log(result);
    return result;
};

const DtodosInput = () => {
    const nextId = useRef(3);
    const dailyContext = useContext(DailyContext);
    const authContext = useContext(AuthContext);
    
    const [inputs, setInputs] = useState({
        tag: '',
        content: '',
    });

    const addBtnHandler = async () => {
        // const { status, data } = await postApi(
        //     {
        //         uid: authContext.state.uid,
        //         d_date: DateFormat(),
        //         d_content: inputs.content,
        //         d_tag: inputs.tag,
        //         d_check: 'F',
        //     },
        //     "/tdl/daily/"
        // );
        // dummy data
        const { status, data } = {
            status: 200,
        };
        if (status === 200) {
            dailyContext.dispatch({
                type: "CREATE_TODO",
                dtodo: {
                    // id: data.d_todo_id,
                    id: nextId.current,
                    d_date: DateFormat(),
                    d_content: inputs.content,
                    d_tag: inputs.tag,
                    d_check: false,
                }
            });
        } else {
            alert("인터넷 연결이 불안정합니다.");
        };

        setInputs({
            tag: '',
            content: '',
        });
        nextId.current += 1;
    };

    return (
        <div className='daily-lower-input'>
            <input
                name='tag'
                style={{width: '30%'}}
                onChange={(e) =>
                    setInputs({ ...inputs, tag: e.target.value })
                }
                value={inputs.tag}
            />
            <input
                name='content'
                style={{width: '60%'}}
                onChange={(e) =>
                    setInputs({ ...inputs, content: e.target.value })
                }
                value={inputs.content}
            />
            <button 
                onClick={addBtnHandler} 
                className="add-button"
                >+</button>
        </div>
    );
};

const DTodosItem = ({ id, d_date, d_content, d_tag, d_check }) => {
    const dailyContext = useContext(DailyContext);
    const authContext = useContext(AuthContext);
    
    const clickCheck = async () => {
        // const { status, data } = await putApi(
        //     {
        //         uid: authContext.state.uid,
        //         d_todo_id: id,
        //         d_content: d_content,
        //         d_tag: d_tag,
        //         d_check: !d_check === false ? "F" : "T",
        //         d_date: d_date,
        //     },
        //     "/tdl/daily/"
        // );
        const { status, data } = {
            status: 200,
        };
        if (status === 200) {
            await dailyContext.dispatch({
                type: 'CHECK_TODO',
                id,
            });
        } else {
            alert("인터넷 연결 불안정");
        }
    };


    const clickDelete = async () => {
        // const { status, data } = await deleteApi(
        //     { 
        //         uid: authContext.state.uid, 
        //         d_todo_id: id 
        //     },
        //     "/tdl/daily/"
        // );
        const { status, data } = {
            status: 200,
        };
        if (status === 200) {
            await dailyContext.dispatch({
                type: 'DELETE_TODO',
                id,
            });
        } else {
            await alert("네트워크 불안정");
        }
    };

    return (
        <div key={id} className='daily-todo-item'>
            <span style={{width: '30%'}}>
                {d_tag}
            </span>
            <span style={{width: '50%'}}>
                {d_content}
            </span>
            {d_check ? (
                <GrCheckboxSelected
                    onClick={clickCheck}
                    className="daily-checkbox"
                />
            ) : (
                <GrCheckbox onClick={clickCheck} className="daily-checkbox" />
            )}
            <span 
                style={{width: '5%'}, {paddingLeft:'1vmin'}, {cursor: 'pointer'}}
                onClick={clickDelete}
                >❌
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
            // await console.log("아아아");
            if (status === 200) {
                await dispatch({
                    type: "GET_TODO",
                    dtodos: data.d_todo_list,
                });
            } else {
                await console.log(status, data);
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        // getDailyData();
    }, []);

    return (
        <div className="daily-comp">
            <PrintToday />
            <div className="daily-study-comp">
                <div className="daily-planner">
                    <div className='daily-todo-upper'>
                        <span style={{width: '30%'}}>
                            시간대
                        </span>
                        <span style={{width: '70%'}}>
                            할 일
                        </span>
                    </div>
                    <DailyContext.Provider value={{ dtodos, dispatch }}>
                        <div>
                            {dtodos.dtodos.map( d => (
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
                <TenMinPlanner />
            </div>
        </div>
    );
};

export default DailyComp;