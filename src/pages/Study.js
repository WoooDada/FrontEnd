import React from "react";
import { useReducer, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { LeftStudyComp, RightStudyComp } from "../components";
import { AuthContext } from "../App";

import "../css/Study.css";
export const BtnContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "btnClick":
            return { btnValue: action.payload };
        default:
            return state;
    }
};

const Study = () => {
    const authContext = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, {
        btnValue: false,
    });
    const postOut = async () => {
        // const { status } = await postApi(
        //     {
        //         uid: authContext.state.uid,
        //         type: "stop",
        //     },
        //     "/study/studybutton/"
        // );
        const { status, data } = {
            // Dummy Dummy
            status: 200,
        };
        if (status === 200) {
            // await console.log("바뀌기전 버튼값:", start);
            // await btnContext.dispatch({ type: "btnClick", payload: !start });
        } else {
            alert("네트워크 에러!");
        }
    };
    return (
        <BtnContext.Provider value={{ state, dispatch }}>
            <div className="StudyPage">
                <div className="StudyComps">
                    <LeftStudyComp></LeftStudyComp>
                    <RightStudyComp></RightStudyComp>
                </div>
                <div className="Study-lowbanner">
                    <small>
                        가슴에 손을 얹고 생각해보세요. 오늘 공부를 마치셨나요?
                    </small>
                    <Link
                        to={"/main"}
                        className="Study-route"
                        onClick={() => postOut()}
                    >
                        {" "}
                        공부방 퇴장하기
                    </Link>
                </div>
            </div>
        </BtnContext.Provider>
    );
};

export default Study;
