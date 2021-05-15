import React from "react";
import { LeftStudyComp, RightStudyComp } from "../components";

import "../css/Study.css";

const Study = () => {
    return (
        <div className="StudyPage">
            <LeftStudyComp></LeftStudyComp>
            <RightStudyComp></RightStudyComp>
        </div>
    );
};

export default Study;
