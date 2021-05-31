import React from "react";
import { useReducer, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { LeftStudyComp, RightStudyComp } from "../components";

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
    const [state, dispatch] = useReducer(reducer, {
        btnValue: false,
    });
    return (
        <BtnContext.Provider value={{state, dispatch}}>
        <div className="StudyPage">
            <div className="StudyComps">
                <LeftStudyComp></LeftStudyComp>
                <RightStudyComp></RightStudyComp>
            </div>
            <div className="Study-lowbanner">
                <small>가슴에 손을 얹고 생각해보세요. 오늘 공부를 마치셨나요?</small>
                <Link to={'/main'} className="Study-route"> 공부방 퇴장하기</Link>
            </div>
        </div>
        </BtnContext.Provider>
    );

}

export default Study;
