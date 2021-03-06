import React, { useState } from "react";
import { useReducer, createContext, useContext } from "react";

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

const Study = ({ match }) => {
    const authContext = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, {
        btnValue: false,
    });
    const [roomInPpl, setRoomInPpl] = useState("-");

    return (
        <BtnContext.Provider value={{ state, dispatch }}>
            <div className="StudyPage">
                <LeftStudyComp
                    match={match.params.roomid}
                    roomInPpl={roomInPpl}
                ></LeftStudyComp>
                <RightStudyComp
                    match={match.params.roomid}
                    setRoomInPpl={setRoomInPpl}
                ></RightStudyComp>
            </div>
        </BtnContext.Provider>
    );
};

export default Study;
