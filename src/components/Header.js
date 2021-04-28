import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div>
            <Link to="/">홈</Link>
            <Link to="/auth">로그인</Link>
            <Link to="/myprofile">마이프로필</Link>
            <Link to="/main">메인</Link>
        </div>
    );
};

export default Header;
