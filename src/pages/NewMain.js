import React from "react";
import "../css/Main.css";
import { Link } from "react-router-dom";
import {
    BadgeComp,
    MainRight,
} from "../components";
import { Logout, MyProfile, StudyRoom } from ".";
import { useState, useContext } from "react";
import { AuthContext } from "../App";

const setMenuColor = (value) => {
    var mainMenu = document.getElementById('Main-side-main');
    var studyroomMenu = document.getElementById('Main-side-studyroom');
    var profileMenu = document.getElementById('Main-side-profile');
    var logMenu = document.getElementById('Main-side-log');
    switch (value) {
        case 'main':
            mainMenu.style.color = '#5F45FF';
            studyroomMenu.style.color = '#9893B7';
            profileMenu.style.color = '#9893B7';
            logMenu.style.color = '#9893B7';
            break;
        case 'studyroom':
            mainMenu.style.color = '#9893B7';
            studyroomMenu.style.color = '#5F45FF';
            profileMenu.style.color = '#9893B7';
            logMenu.style.color = '#9893B7';
            break;
        case 'profile':
            mainMenu.style.color='#9893B7';
            studyroomMenu.style.color='#9893B7';
            profileMenu.style.color='#5F45FF';
            logMenu.style.color='#9893B7';
            break;
        case 'log':
            mainMenu.style.color='#9893B7';
            studyroomMenu.style.color='#9893B7';
            profileMenu.style.color='#9893B7';
            logMenu.style.color='#5F45FF';
            break;
    }

}

const NewMain = () => {
    const authContext = useContext(AuthContext);
    const [whichSection, setWhichSection] = useState("main");
    
    return (
        <div className='Main'>
            <aside>
                <BadgeComp></BadgeComp>
                <div className='aside-menus'>
                    <p><Link to={'/'}>Home</Link></p>
                    <p 
                    id="Main-side-main"
                    style={{color:'#5F45FF'}}
                    onClick={() => {
                        setWhichSection("main");
                        setMenuColor("main");
                    }}>Main</p>

                    <p 
                    id="Main-side-studyroom"
                    onClick={() => {
                        setWhichSection("studyroom");
                        setMenuColor("studyroom");
                    }}>Studyroom</p>

                    <p 
                    id="Main-side-profile"
                    onClick={() => {
                        setWhichSection("profile");
                        setMenuColor("profile");
                    }}>Profile</p>

                    <p 
                    id="Main-side-log"
                    onClick={() => {
                        setWhichSection("logout");
                        setMenuColor("log");
                    }}>Logout</p>
                </div>
                <div className='aside-bottom'>공다다</div>
            </aside>
            {whichSection === "main" ? (
                <MainRight></MainRight>
            ) : whichSection === "studyroom" ? (
                <StudyRoom></StudyRoom>
            ) : whichSection === "profile" ? (
                <MyProfile></MyProfile>
            ) : (
                <Logout></Logout>
            )}
        </div>
    )
}

export default NewMain;