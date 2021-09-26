import React, { useContext, useState, useEffect } from "react";
import "../css/MyProfile.css";
import { AuthContext } from "../App";
import { Link } from "react-router-dom";
import { getApi, putApi } from "../api";

const MyProfileForm = () => {
    const [nickname, setNickname] = useState("");
    const [sex, setSex] = useState("");
    const [birth, setBirth] = useState("");
    const [likeCategory, setLikeCategory] = useState({
        college: "F",
        sat: "F",
        gongmuwon: "F",
        employment: "F",
        certificate: "F",
        language: "F",
        etc: "F",
    });

    const authContext = useContext(AuthContext);

    const settingProfile = (set_sex, set_likecategory) => {
        // sex & like_category Setting
        switch (set_sex) {
            case "U":
                document.getElementById("unknown").checked = true;
                break;
            case "W":
                document.getElementById("woman").checked = true;
                break;
            case "M":
                document.getElementById("man").checked = true;
                break;
            default:
                document.getElementById("unknown").checked = true;
                break;
        }

        document.getElementById("college").checked =
            set_likecategory.college === "T" ? true : false;
        document.getElementById("sat").checked =
            set_likecategory.sat === "T" ? true : false;
        document.getElementById("gongmuwon").checked =
            set_likecategory.gongmuwon === "T" ? true : false;
        document.getElementById("employment").checked =
            set_likecategory.employment === "T" ? true : false;
        document.getElementById("certificate").checked =
            set_likecategory.certificate === "T" ? true : false;
        document.getElementById("language").checked =
            set_likecategory.language === "T" ? true : false;
        document.getElementById("etc").checked =
            set_likecategory.etc === "T" ? true : false;
    };

    useEffect(() => {
        const getProfile = async () => {
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/myprofile/",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        setNickname(data.send_data.nickname);
                        setSex(data.send_data.sex);
                        setBirth(data.send_data.birth);
                        setLikeCategory(data.send_data.like_category);
                        settingProfile(
                            data.send_data.sex,
                            data.send_data.like_category
                        );
                    }
                })
                .catch((e) => {
                    alert("네트워크 불안정");
                });
        };
        getProfile();
        // GET한 정보들로 세팅
    }, []);

    const inputNickname = (e) => {
        setNickname(e.target.value);
    };

    const sexChange = (e) => {
        if (e.target.id === "woman") {
            setSex("W");
        } else if (e.target.id === "man") {
            setSex("M");
        } else {
            setSex("U");
        }
    };

    const inputBirth = (e) => {
        setBirth(e.target.value);
    };

    const likeCategoryFormat = (checklist) => {
        // checklist -> 서버에 넘겨줄 likeCategory 포맷으로 변경
        setLikeCategory({
            ...likeCategory,
            college: checklist[0].checked === true ? "T" : "F",
            sat: checklist[1].checked === true ? "T" : "F",
            gongmuwon: checklist[2].checked === true ? "T" : "F",
            employment: checklist[3].checked === true ? "T" : "F",
            certificate: checklist[4].checked === true ? "T" : "F",
            language: checklist[5].checked === true ? "T" : "F",
            etc: checklist[6].checked === true ? "T" : "F",
        });
    };

    const checkHandler = (e) => {
        var checklist = document.getElementsByName("like");
        var cnt = 0;
        for (var i = 0; i < 7; i++) {
            if (checklist[i].checked) {
                cnt += 1;
            }
        }
        if (cnt > 3) {
            document.getElementById(e.target.id).checked = false;
        }
        likeCategoryFormat(checklist);
    };

    // 수정사항 반영. Putapi
    const clickProfileBtn = async (e) => {
        e.preventDefault();
        await putApi(
            {
                uid: authContext.state.uid,
                nickname: nickname,
                sex: sex,
                birth: birth,
                like_category: likeCategory,
            },
            "/myprofile/",
            authContext.state.token
        )
            .then(({ status, data }) => {
                console.log("profile update success");
                alert("수정사항이 반영되었습니다.");
            })
            .catch((e) => {
                console.log("profile update fail");
                alert(
                    "네트워크 연결이 불안정해 수정사항이 반영되지 않았습니다."
                );
            });
    };

    return (
        <div className="MyProfilePage">

            <div className="MyProfile-outer-form">
                <h2>프로필 수정</h2>
                <div className="MyProfile-formgroup1">
                    <div className="MyProfile-formgorup1-title">
                        <h5>닉네임</h5>
                    </div>
                    <input
                        style={{ width: "10rem" }}
                        name="nickname"
                        value={nickname}
                        onChange={(e) => inputNickname(e)}
                    />
                </div>

                <div className="MyProfile-formgroup1">
                    <div className="MyProfile-formgorup1-title">
                        <h5>성별</h5>
                    </div>
                    <input
                        type="radio"
                        name="sex"
                        id="woman"
                        onChange={(e) => sexChange(e)}
                    ></input>
                    <label htmlFor="woman">
                        <p>여자</p>
                    </label>
                    <input
                        type="radio"
                        name="sex"
                        id="man"
                        onChange={(e) => sexChange(e)}
                    ></input>
                    <label htmlFor="man">
                        <p>남자</p>
                    </label>
                    <input
                        type="radio"
                        name="sex"
                        id="unknown"
                        onChange={(e) => sexChange(e)}
                    ></input>
                    <label htmlFor="unknown">
                        <p>선택안함</p>
                    </label>
                </div>

                <div className="MyProfile-formgroup1">
                    <div className="MyProfile-formgorup1-title">
                        <h5>생년월일</h5>
                    </div>
                    <input
                        style={{ width: "10rem" }}
                        type="date"
                        name="birth"
                        value={birth}
                        onChange={(e) => inputBirth(e)}
                    ></input>
                </div>

                <div className="MyProfile-formgroup2">
                    <h5>관심 카테고리</h5>
                    <p>
                        채워주시면 더 정확하게 공부방 추천을 해드려요!
                        <br></br> 최대 3개 선택 가능
                    </p>
                    <div className="likes">
                        <div className="likes-group1">
                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="college"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>대학생</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="sat"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>수능</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="gongmuwon"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>공무원</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="employment"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>취업 및 이직</span>
                            </label>
                        </div>
                        <div className="likes-group2">
                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="certificate"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>자격증</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="language"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>어학</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="like"
                                    id="etc"
                                    onChange={(e) => checkHandler(e)}
                                ></input>
                                <span>기타</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    className="MyProfile-button"
                    type="submit"
                    onClick={clickProfileBtn}
                >
                    수정하기
                </button>
            </div>
        </div>
    );
};

export default MyProfileForm;
