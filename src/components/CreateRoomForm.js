import React, { useContext, useState } from "react";
import "../css/CreateRoom.css";
import { AuthContext } from "../App";
import axios from "axios";
import { getApi, postApi } from "../api";

const CreateRoomForm = () => {
    const authContext = useContext(AuthContext);
    // 방명
    const [roomName, setRoomName] = useState("");
    const inputRoomName = (e) => {
        setRoomName(e.target.value);
    }

    // 최대인원 설정
    const [textNum, setTextNum] = useState(5);
    const increaseNum = (e) => {
        e.preventDefault();
        if (textNum < 50) { // 최대 인원수 
            setTextNum(textNum + 1);
        }
    }
    const decreaseNum = (e) => {
        e.preventDefault();
        if (textNum > 1) { // 최소 인원수
            setTextNum(textNum - 1);
        }
    }

    // 방 공개 여부에 따른 비밀번호 input 활성화 
    const [secret, setSecret] = useState("");
    const radioChange = (e) => {
        console.log(e.target.id);
        if (e.target.id === "secret") {
            setSecret("secret")
        } else {
            setSecret("not-secret")
        }
    }

    // 비밀번호
    const [pwd, setPwd] = useState("");
    const inputPwd = (e) => {
        setPwd(e.target.value);
    }

    // 카테고리
    const [category, setCategory] = useState("");
    const categoryChange = (e) => {
        console.log(e.target.id)
        switch (e.target.id) {
            case "1": setCategory("college"); break;
            case "2": setCategory("sat"); break;
            case "3": setCategory("gongmuwon"); break;
            case "4": setCategory("employment"); break;
            case "5": setCategory("certificate"); break;
            case "6": setCategory("language"); break;
            case "7": setCategory("etc"); break;
        }
    }

    // 공부방 에티켓
    const [manner, setManner] = useState("");
    const inputManner = (e) => {
        setManner(e.target.value);
    }

    // 테마컬러
    const [color, setColor] = useState("");
    const selectColor = (e) => {
        switch (e.target.id) {
            case "rc1": setColor("#FFB6B6"); break;
            case "rc2": setColor("#F8D57E"); break;
            case "rc3": setColor("#FDF76B"); break;
            case "rc4": setColor("#CCF8A8"); break;
            case "rc5": setColor("#B0DFFB"); break;
            case "rc6": setColor("#E1B0FF"); break;
            case "rc7": setColor("#B89779"); break;
        }
    }


    // POST
    const onCreate = async (e) => {
        e.preventDefault();
        if (roomName !== ""
            && secret !== ""
            && category !== ""
            && color !== "") {

            // POST
            const { status, data } = await postApi(
                {
                    uid: authContext.state.uid,
                    room_name: roomName,
                    maxppl: textNum,
                    is_secret: secret == "secret" ? "T" : "F",
                    room_pwd: pwd,
                    room_tag: category,
                    room_comment: manner,
                    room_color: color,
                },
                "/studyroom",
                authContext.state.token
            );

            if (status === 200) {
                await console.log("room create success");
            } else {
                await console.log("room create fail");
            }

            // 스터디룸으로 이동
            // 
        }
    };

    return (
        <form className="Createroom-outer-form">
            <div className="Createroom-form-header">
                <h3>방만들기</h3>
            </div>
            <div className="form-group">
                <h5>방명</h5>
                <input
                    name="room_name"
                    onChange={(e) => inputRoomName(e)}
                />
            </div>
            <div className="form-group">
                <h5>최대인원</h5>
                <button className="ppl-btn" onClick={increaseNum}>+</button>
                <p>{textNum}</p>
                <button className="ppl-btn" onClick={decreaseNum}>-</button>
            </div>
            <div className="form-group">
                <h5>방 공개 범위</h5>
                <input type="radio" name="is_secret" id="not-secret"
                    onChange={(e) => radioChange(e)}></input>
                <label for="not-secret"><p>공개방</p></label>
                <input type="radio" name="is_secret" id="secret"
                    onChange={(e) => radioChange(e)}></input>
                <label for="secret"><p>비밀방</p></label>
            </div>
            <div className="form-group">
                <h5>비밀번호</h5>
                <input
                    name="room_pwd"
                    placeholder="~~으로 입력해주세요"
                    disabled={secret == "not-secret" ? true : false}
                    onChange={(e) => inputPwd(e)}
                />
            </div>
            <div className="form-group2">
                <h5>카테고리</h5>
                <div className="categories">
                    <label>
                        <input type="radio" name="category" id="1"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>대학생</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="2"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>수능</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="3"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>공무원</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="4"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>취업 및 이직</span>
                    </label>
                    <br></br>
                    <label>
                        <input type="radio" name="category" id="5"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>자격증</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="6"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>어학</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="7"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>기타</span>
                    </label>
                </div>
            </div>
            <div className="form-group2">
                <h5>공부방 에티켓</h5>
                <textarea rows='5'
                    onChange={(e) => inputManner(e)}></textarea>


            </div>
            <div className="form-group2">
                <h5>테마컬러</h5>
                <div className="room-colors">
                    <div className="room-color" id="rc1"
                        onChange={(e) => selectColor(e)}></div>
                    <div className="room-color" id="rc2"
                        onChange={(e) => selectColor(e)}></div>
                    <div className="room-color" id="rc3"
                        onChange={(e) => selectColor(e)}></div>
                    <div className="room-color" id="rc4"
                        onChange={(e) => selectColor(e)}></div>
                    <div className="room-color" id="rc5"
                        onChange={(e) => selectColor(e)}></div>
                    <div className="room-color" id="rc6"
                        onChange={(e) => selectColor(e)}></div>
                    <div className="room-color" id="rc7"
                        onChange={(e) => selectColor(e)}></div>
                </div>
            </div>

            <br></br>
            <button type="submit" onClick={onCreate}>방만들고 공부하러 가기</button>
        </form>
    );
}

export default CreateRoomForm;
