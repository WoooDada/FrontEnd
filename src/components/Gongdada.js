import React, { useState } from "react";
import {
    ConcentGraphComp,
    RankComp,

} from "../components";
import "../css/Main.css";

const Gongdada = () => {

    return (
        <div className="Main-Gongdada">
            <div className="Gongdada-left">
                <ConcentGraphComp></ConcentGraphComp>
                
            </div>
            <div className="Gongdada-right">
                <RankComp></RankComp>
            </div>
        </div>
    );
};

export default Gongdada;
