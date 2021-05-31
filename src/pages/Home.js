import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HomeLower from "../constants/imgs/home-lower.png";
import Home1 from "../constants/imgs/home1.png";
import Home2 from "../constants/imgs/home2.png";
import Home3 from "../constants/imgs/home3.png";
import { AuthContext } from "../App";

import "../css/Home.css";

const Home = () => {
    const authContext = useContext(AuthContext);
    // authContext.state.uid 존재하면 /main, 존재하지않으면 /login으로.
    const path = authContext.state.uid ? "/main" : "/login";
    return (
        <div className="Home">
            <div className="Home-banner">
                <div className="Home-banner-only">
                    <p>공부만을 위해;</p>
                    <p>공다다</p>
                </div>
                <Link to={path} className="Home-route">
                    바로 공부하러 가기
                </Link>
            </div>
            <div className="Home-middle">
                <hr></hr>
                <img width="90%" src={HomeLower} />
                <hr></hr>
            </div>
            <div className="Home-lower">
                <div className="Home-lower-left">
                    <img src={Home1} />
                    <div className="left-p">
                        <br></br>
                        <p className="p1">이제 핸드폰은 그만!</p>
                        <p>
                            핸드폰을 만지면 공다다가 귀신같이 캐치해요! 경고를
                            받지 않으려면 손에는 펜만 들어야겠죠?
                        </p>
                    </div>
                </div>
                <div className="Home-lower-right">
                    <div className="right-p">
                        <p className="p1">집중그래프로 학습관리까지!</p>
                        <p>
                            일주일간 공부에 얼마나 집중했는지를 나타내는
                            그래프가 보여져요!
                            <br></br>얼마나 공부했는지 스스로 점검하고 성찰해서
                            보다 더 집중할 수 있어요!
                        </p>
                    </div>
                    <img src={Home2} />
                </div>
                <div className="Home-lower-left">
                    <img src={Home3} />
                    <div className="left-p">
                        <p className="p1">
                            <br></br>성취 돋는 하루!
                        </p>
                        <p>
                            공다다와 함께 성취 돋는 하루를 시작해 보세요!
                            공다다를 키면 무조건 공부 시작! 딴 짓은 엄금!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
