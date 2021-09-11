import React from "react";
import "../css/Main.css";
import { Link } from "react-router-dom";
import {
    BadgeComp,
    Studyroom,
    MainRight,
} from "../components";
import { Logout, MyProfile } from ".";
import { useState, useContext } from "react";
import { AuthContext } from "../App";

const NewMain = () => {
    const authContext = useContext(AuthContext);
    const [whichSection, setWhichSection] = useState("main");
    
    return (
        <div className='Main'>
            <aside>
                <BadgeComp></BadgeComp>
                <div className='aside-menus'>
                    <p><Link to={'/'}>Home</Link></p>
                    <p onClick={() => {
                        setWhichSection("main");
                    }}>Main</p>

                    <p onClick={() => {
                        setWhichSection("studyroom");
                    }}>Studyroom</p>

                    <p onClick={() => {
                        setWhichSection("profile");
                    }}>Profile</p>

                    <p onClick={() => {
                        setWhichSection("logout");
                    }}>Logout</p>
                </div>
                <div className='aside-bottom'>공다다</div>
            </aside>
            {whichSection === "main" ? (
                <MainRight></MainRight>
            ) : whichSection === "studyroom" ? (
                <Studyroom></Studyroom>
            ) : whichSection === "profile" ? (
                <MyProfile></MyProfile>
            ) : (
                <Logout></Logout>
            )}
        </div>
    )
}

export default NewMain;