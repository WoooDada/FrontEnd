import React, { useContext, useState } from "react";
import "../css/CreateRoom.css";
import { AuthContext } from "../App";
import { postApi } from "../api";

const CreateRoomForm = ({ history }) => {
    const authContext = useContext(AuthContext);
    // 버튼 하단에 적힐 문구
    const [message, setMessage] = useState("");
    // 방명
    const [roomName, setRoomName] = useState("");
    const inputRoomName = (e) => {
        setRoomName(e.target.value);
    }

    // 최대인원 설정
    const [textNum, setTextNum] = useState(5);
    const increaseNum = (e) => {
        e.preventDefault();
        if (textNum < 20) { // 최대 인원수 
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
            case "cate1": setCategory("college"); break;
            case "cate2": setCategory("sat"); break;
            case "cate3": setCategory("gongmuwon"); break;
            case "cate4": setCategory("employment"); break;
            case "cate5": setCategory("certificate"); break;
            case "cate6": setCategory("language"); break;
            case "cate7": setCategory("etc"); break;
        }
    }

    // 공부방 에티켓
    const [manner, setManner] = useState("");
    const inputManner = (e) => {
        setManner(e.target.value);
    }

    // 테마컬러
    const [color, setColor] = useState("");
    const selectColor = (id) => {
        switch (id) {
            case "rc1": setColor("#FFB6B6"); break;
            case "rc2": setColor("#F8D57E"); break;
            case "rc3": setColor("#FDF76B"); break;
            case "rc4": setColor("#CCF8A8"); break;
            case "rc5": setColor("#B0DFFB"); break;
            case "rc6": setColor("#E1B0FF"); break;
            case "rc7": setColor("#B89779"); break;
        }
        for (var i=1; i<=7; i++){
            var nowid = "rc" + i;
            var element = document.getElementById(nowid);
            if (nowid == id){
                element.style.border = "solid 2px #727272";
                element.style.width = "16px"; element.style.height = "16px";
            } else {
                element.style.border = "none";
                element.style.width = "20px"; element.style.height = "20px";
            }
        }
    }

    // POST
    const onCreate = async (e) => {
        e.preventDefault();
        if (roomName === "" || secret === "" || category === "" || color === ""){
            setMessage("필수 입력 항목을 모두 입력해주세요.")
        }
        else {
            // 공개방일 경우 비밀번호 "" 처리
            if (secret === "not-secret") { setPwd("") }
            const { status, data } = await postApi(
                {
                    uid: authContext.state.uid,
                    room_name: roomName,
                    maxppl: textNum,
                    is_secret: secret === "secret" ? "T" : "F",
                    room_pwd: pwd,
                    room_tag: category,
                    room_comment: manner,
                    room_color: color,
                },
                "/studyroom/",
                authContext.state.token
            );
            // const { status, data } = {
            //     status: 200,
            //     data: { uid: "EXAMPLE", room_id: 3 },
            // };

            if (status === 200) {
                await console.log("room create success");
                await console.log(data.room_id);
                if (data.room_id == -1) {
                    await console.log("방명 중복");
                    setMessage("방명이 중복되었습니다. 다른 이름을 입력해주세요.");
                } else if (data.room_id == -2) {
                    await console.log("비밀방인데 비밀번호 안씀");
                    setMessage("비밀방을 선택하셨습니다. 비밀번호를 입력해주세요.");
                } else {
                    // 스터디룸으로 이동
                    history.push("/study");
                }
            } else {
                await console.log("room create fail");
            }
        }
    };




    return (
        <form className="Createroom-outer-form">
            <div className="Createroom-form-header">
                <h3>방만들기</h3>
            </div>
            <div className="form-group">
                <h5>방명*</h5>
                <input
                    name="room_name"
                    onChange={(e) => inputRoomName(e)}
                />
            </div>
            <div className="form-group">
                <h5>최대인원*</h5>
                <button className="ppl-btn" onClick={increaseNum}>+</button>
                <p>{textNum}</p>
                <button className="ppl-btn" onClick={decreaseNum}>-</button>
            </div>
            <div className="form-group">
                <h5>방 공개 범위*</h5>
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
                    disabled={secret == "secret" ? false : true}
                    onChange={(e) => inputPwd(e)}
                />
            </div>
            <div className="form-group2">
                <h5>카테고리*</h5>
                <div className="categories">
                    <label>
                        <input type="radio" name="category" id="cate1"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>대학생</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="cate2"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>수능</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="cate3"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>공무원</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="cate4"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>취업 및 이직</span>
                    </label>
                    <br></br>
                    <label>
                        <input type="radio" name="category" id="cate5"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>자격증</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="cate6"
                            onChange={(e) => categoryChange(e)}></input>
                        <span>어학</span>
                    </label>
                    <label>
                        <input type="radio" name="category" id="cate7"
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
                <h5>테마컬러*</h5>
                <div className="room-colors">
                    <div className="room-color" id="rc1"
                        onClick={() => selectColor("rc1")}
                        ></div>
                    <div className="room-color" id="rc2"
                        onClick={() => selectColor("rc2")}></div>
                    <div className="room-color" id="rc3"
                        onClick={() => selectColor("rc3")}></div>
                    <div className="room-color" id="rc4"
                        onClick={() => selectColor("rc4")}></div>
                    <div className="room-color" id="rc5"
                        onClick={() => selectColor("rc5")}></div>
                    <div className="room-color" id="rc6"
                        onClick={() => selectColor("rc6")}></div>
                    <div className="room-color" id="rc7"
                        onClick={() => selectColor("rc7")}></div>
                </div>
            </div>

            <br></br>
            <button className="create-room-btn" type="submit" onClick={onCreate}>방만들고 공부하러 가기</button>
            <p className="bottom-msg">{message}</p>
        </form>
    );
}

export default CreateRoomForm;
