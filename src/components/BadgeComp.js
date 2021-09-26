import React, { useEffect, useState, useContext } from "react";

import { FaMedal } from "react-icons/fa";

import "../css/Main.css";
import { AuthContext } from "../App";
import { getApi } from "../api";
import Modal from "react-modal";

const getBadgeColor = (badge) => {
    switch (badge) {
        case "B":
            return "#cd7f32";
        case "S":
            return "#c0c0c0";
        case "G":
            return "#ffd700";
        case "P":
            return "#ff1493";
        case "D":
            return "#c7e8ff";
        default:
            return "#000000";
    }
};

const getBadgeName = (badge) => {
    switch (badge) {
        case "B":
            return "BRONZE";
        case "S":
            return "SILVER";
        case "G":
            return "GOLD";
        case "P":
            return "PLATINUM";
        case "D":
            return "DIA";
        default:
            return "IRON";
    }
};

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

const BadgeComp = () => {
    var subtitle = "";
    const [modalIsOpen, setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = "#E9B2BC";
    }

    function closeModal() {
        setIsOpen(false);
    }
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState({
        nickname: "로그인해주세요",
        badge_color: "#000000",
        badge_name: "-",
    });
    useEffect(() => {
        const getNickName = async () => {
            await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/badge_profile",
                authContext.state.token
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        console.log(data);
                        setUserData({
                            nickname: data.nickname,
                            badge_color: getBadgeColor(data.badge),
                            badge_name: getBadgeName(data.badge),
                        });
                    }
                })
                .catch((e) => {
                    alert("네트워크 불안정");
                });
        };
        getNickName();
    }, []);
    return (
        <div>
            <div className="Main-BadgeComp">
                <div className="badge-circle"></div>
                <div className="badge-contents">
                    <div className="badge-icon">
                        <FaMedal
                            style={{ cursor: "pointer" }}
                            onClick={openModal}
                            color={userData.badge_color}
                            size="45px"
                            className="icon"
                        />
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Example Modal"
                    >
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
                            뱃지 부여 기준
                        </h2>
                        <div>
                            뱃지는 누적 총 공부시간으로 계산됩니다. <br></br>
                            <p>
                                블랙: 0시간 이상 <br></br>
                                브론즈: 5시간 이상 <br></br>
                                실버: 30시간 이상 <br></br>
                                골드: 100시간 이상 <br></br>
                                플래티넘: 200시간 이상 <br></br>
                                다이아: 1000시간 이상<br></br>
                                <br></br>
                                다이아까지 열공!!!
                            </p>
                        </div>
                    </Modal>
                    <div className="badge-nickname">{userData.nickname}</div>
                    <div className="badge-name">{userData.badge_name}</div>
                </div>
            </div>
        </div>
    );
};

export default BadgeComp;
