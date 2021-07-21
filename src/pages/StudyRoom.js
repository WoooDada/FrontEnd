import React from "react";
import { Link } from "react-router-dom";

const StudyRoom = () => {
    return (
        <div>
            <div className="Main-Banner">
                <Link to="/createroom" className="button">
                    공부방 만들기
                </Link>
            </div>
            <div>검색창 부분</div>
            <div>
                <div>태그 선택</div>
                <div>리스트</div>
            </div>
        </div>
    );
};

export default StudyRoom;
