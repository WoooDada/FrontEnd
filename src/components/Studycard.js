import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";
import "../css/StudyBox.css";
import logo from "../constants/imgs/newlogo.png"
import { AiFillLock } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";

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
                            <AiFillLock style={{color:"#030303", margin:"5px"}}/>
                        </div>
                    ) : (
                        <div style={{color:"#ffffff"}}>.</div>
                    )}
                    <div className="Studycard-image">
                        <img src={logo} style={{ width: "24px" }} />
                    </div>
                    <div className="Studycard-ppl">
                        <BsFillPersonFill />
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
