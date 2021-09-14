import React, { useState } from "react";
import { NewGraphComp, RankComp, StudyBoxComp } from "../components";
import "../css/Main.css";
import ConcentGraphComp from "./ConcentGraphComp";

const Gongdada = () => {
    return (
        <div className="Main-Gongdada">
            <div className="Gongdada-left">
                {/* <ConcentGraphComp /> */}
                <NewGraphComp />
                <StudyBoxComp></StudyBoxComp>
            </div>
            <div className="Gongdada-right">
                <RankComp></RankComp>
            </div>
        </div>
    );
};

export default Gongdada;
