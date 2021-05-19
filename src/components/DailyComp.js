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

const TenMinPlanner = () => {
    return (
        <div className="daily-tenmin">this is ten</div>
    );
};

const DailyContext = createContext(null);
const initialData = [
    {
        id: 1,
        d_date: "2021-05-19",
        d_content: "졸작 회의",
        d_check: false,
        d_tag: "3-5"
    },
    {
        id: 2,
        d_date: "2021-05-109",
        d_content: "졸작 회의",
        d_check: true,
        d_tag: ""
    },
];

function reducer(state, action) {
    switch (action.type) {
        case 'GET_TODO':
            return action.d_todo_list.map((d, i) => ({
                id: d.id,
                d_date: d.d_date,
                d_tag: d.d_tag,
                d_content: d.d_content,
                d_check: d.d_check,
            }));
            
        case 'CREATE_TODO':
            return state.map((d, i) => {
                return {
                    ...d,
                    id: action.id,
                    d_date: action.d_date,
                    d_tag: action.d_tag,
                    d_content: action.d_content,
                    d_check: action.d_check,
                }
            });
        case 'CHECK_TODO':
            return {

            };
        case 'DELETE_TODO':
            return {
            };
        
        default:
            return state;
    }
}

const PrintToday = () => {
    const today = new Date();
    const result = "".concat(today.getFullYear(), '년 ', today.getMonth() + 1, '월 ', today.getDate(), '일 ');
    return (
        <div>
            {result}
        </div>
    );
};

const DtodosInput = () => {
    const nextId = useRef(3);
    const dailyContext = useContext(DailyContext);
    const [dailyData, dispatch] = useReducer(reducer, initialData);
    const [inputs, setInputs] = useState({
        tag: "",
        content: "",
    });

    const addBtnHandler = () => {
        
        dailyContext.dispatch({
            type: "CREATE_TODO",
            id: nextId.current,
            d_date: '2021-05-19',
            d_content: inputs.content,
            d_tag: inputs.tag,
            d_check: false,
        });

        setInputs({
            tag: '',
            content: '',
        });

        nextId.current += 1;
    }

    return (
        <div className='daily-lower-input'>
        <div className='daily-todo-input'>
            <input
                name='tag'
                className='daily-todo-input-tag'
                onChange={(e) =>
                    setInputs({ ...inputs, tag: e.target.value })
                }
                value={inputs.tag}
            />
            <input
                name='content'
                className='daily-todo-input-context'
                onChange={(e) =>
                    setInputs({ ...inputs, content: e.target.value })
                }
                value={inputs.content}
            />
            <button onClick={addBtnHandler} className="add-button">+</button>
        </div>
        </div> 
    );
};

const DTodosItem = ({ id, d_date, d_content, d_tag, d_check }) => {
    // const dailyContext = useContext(DailyContext);
    const clickCheck = () => {
        console.log('check');
    }
    const clickDelete = () => {
        console.log('delete');
    }
    return (
        <div className='daily-todo-input'>
            <span className='daily-todo-tag'>{d_tag}</span>
            <span className='daily-todo-content'>{d_content}</span>
            <span 
                className='daily-todo-check'
                onClick={clickCheck}
                >
                {(d_check) ? <span></span>:<span>✔</span>}
            </span>
            <span 
                className='daily-todo-delete'
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
                d_date={d_date}
                d_content={d_content}
                d_tag={d_tag}
                d_check={d_check}
            />
        </div>
    );
};


const DailyComp = () => {
    const [dailyData, dispatch] = useReducer(reducer, initialData);
    console.log(dailyData);


    return (
        <div className="daily-comp">
            <PrintToday />
            <div className="daily-study-comp">
                <div className="daily-planner">
                    <div className='daily-todo-input'>
                        <span className='daily-todo-input-tag'>태그</span>
                        <span className='daily-todo-input-context'>할 일</span>
                    </div>
                    <DailyContext.Provider value={{ dailyData, dispatch }}>
                        <div>
                            {dailyData.map((d, i) => (
                                <DTodosList
                                    key={d.id}
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