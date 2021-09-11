import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";
import "../css/StudyBox.css";
import ppl_icon from "../constants/imgs/ppl_icon.png";
import secret_icon from "../constants/imgs/secret_icon.png";
import logo from "../constants/imgs/newlogo.png"

const Studycard = ({ room_id, room_name, inppl, maxppl, room_color, is_scret, room_tag }) => {
    const style = {
        backgroundColor: room_color,
    };
    return (
        <Link to={`/study/${room_id}`}>
            <div className="Studycard">
                <div className="Studycard-upper"> 
                    {is_scret === "T" ? (
                        <div className="Studycard-secret">
                            <img src={secret_icon} style={{padding:"0 3px"}}/>
                        </div>
                    ) : (
                        <div style={{color:"#ffffff"}}>.</div>
                    )}
                    <div className="Studycard-image">
                        <img src={logo} style={{ width: "20px" }} />
                    </div>
                    <div className="Studycard-ppl">
                        <img src={ppl_icon} style={{padding:"0 3px"}}/>
                        {inppl}/{maxppl}
                    </div>
                </div>
                <div style={style} className="Studycard-lower">
                    <div className="Studycard-roomname">{room_name}</div>
                    <div className="Studycard-roomtag">{room_tag}</div>
                </div>
            </div>
        </Link>
    );
};


export default Studycard;
