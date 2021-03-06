import {
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    NavLink,
} from "react-router-dom";

// Page 로딩
import {
    Main,
    Logout,
    MyProfile,
    NotFound,
    Home,
    Study,
    StudyRoom,
    CreateRoom,
    Socket,
    Graph,
} from "./pages";
// import Header from "./components/Header";
import "./App.css";
import Login from "./pages/Login";
import {
    useReducer,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import Logo from "./constants/imgs/newlogo.png";
import { BadgeComp } from "../src/components";

//////////////////////////////////////////////////////////////////////////////////
const Header = () => {
    const authContext = useContext(AuthContext);
    return (
        <>
            <div className="App-header-belt"></div>
            <div className="App-header">
                <div className="App-header-title">
                    <div
                        className={
                            !authContext.state.onLogin
                                ? "logo-title-login"
                                : "logo-title-nologin"
                        }
                    >
                        <img width="3%" src={Logo}></img>
                        <Link to="/" className="logo-title-txt">
                            공다다
                        </Link>
                    </div>
                    {/* ------------ 테스트용 임시 코드 ------------- */}
                    <div>
                        <Link to="/main">메인</Link>
                    </div>
                    {!authContext.state.onLogin &&
                        (authContext.state.token ? (
                            <div>
                                <Link
                                    to="/myprofile"
                                    className="App-header-route"
                                >
                                    내 프로필
                                </Link>
                                <Link to="/logout" className="App-header-route">
                                    로그아웃
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="App-header-route">
                                로그인
                            </Link>
                        ))}
                </div>
            </div>
        </>
    );
};

const Footer = () => {
    const authContext = useContext(AuthContext);
    return (
        <div className="App-footer">
            <div className="App-footer-title">
                <p>GongDaDa</p>
                <p>공부만을 위해; 공다다</p>
            </div>
            <div>
                Copyright@2021 We are smwu students and team WOODADA by Jin Lee,
                Dahyun Kim, Woojung Jun
                <br /> Design comfirmed by Areum Song
            </div>
            <p>
                {authContext.state.token
                    ? authContext.state.token
                    : "로그인해주세요"}
            </p>
        </div>
    );
};

const SideMenu = () => {
    const activeStyle = {
        color: "#5F45FF",
    };
    // Sidemenu 나타나지 않는 페이지
    if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/" ||
        window.location.pathname === "/socket" ||
        window.location.pathname.startsWith("/study/")
    )
        return null;

    return (
        <aside>
            <BadgeComp></BadgeComp>
            <div className="aside-menus">
                <p>
                    <Link to={"/"}>Home</Link>
                </p>
                <p id="Main-side-main">
                    <NavLink to={"/main"} activeStyle={activeStyle}>
                        Main
                    </NavLink>
                </p>

                <p id="Main-side-studyroom">
                    <NavLink to={"/studyroom"} activeStyle={activeStyle}>
                        Studyroom
                    </NavLink>
                </p>

                <p id="Main-side-profile">
                    <NavLink to={"/myprofile"} activeStyle={activeStyle}>
                        Profile
                    </NavLink>
                </p>

                <p id="Main-side-log">
                    <NavLink to={"/logout"} activeStyle={activeStyle}>
                        Logout
                    </NavLink>
                </p>
            </div>
            <div className="aside-bottom">공다다</div>
        </aside>
    );
};
//////////////////////////////////////////////////////////////////////////////////
export const AuthContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "login":
            return { token: action.token, onLogin: true, uid: action.uid };
        case "logout":
            return { token: null, onLogin: true, uid: null };
        case "onLoginPage":
            return { token: null, onLogin: true, uid: null };
        case "notOnLoginPage":
            return { token: state.token, onLogin: false, uid: state.uid };
        default:
            return state;
    }
};

//////////////////////////////////////////////////////////////////////////////////
function App() {
    const history = useHistory();
    const location = useLocation();
    const [state, dispatch] = useReducer(reducer, {
        token: null,
        uid: null,
        onLogin: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(JSON.parse(localStorage.getItem("loggedInfo")));

        const initUserInfo = async () => {
            const loggedInfo = await JSON.parse(
                localStorage.getItem("loggedInfo")
            );
            console.log("-------------새로 고침했다------------");
            console.log(loggedInfo);

            if (loggedInfo) {
                const { token, uid } = loggedInfo;
                await dispatch({
                    type: "login",
                    token: token,
                    uid: uid,
                });
                await dispatch({ type: "notOnLoginPage" });
            } else {
                await dispatch({
                    type: "logout",
                });
                await dispatch({ type: "notOnLoginPage" });
                // if (location.pathname !== "/") {
                //     await history.push("/login");
                // }
            }
            setLoading(false);
        };
        initUserInfo();
    }, [state.token]);

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="App">
            <AuthContext.Provider value={{ state, dispatch }}>
                {/* <Header></Header> */}
                {/* <div className="SideMenu-back"></div> */}
                <SideMenu></SideMenu>
                <div className="App-body">
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} />
                        <Route path="/logout" component={Logout} />
                        <Route path="/main" component={Main} />
                        {/* <Route path="/study" component={Study} /> */}
                        <Route path="/study/:roomid" component={Study} />
                        <Route path="/studyroom" component={StudyRoom} />
                        <Route path="/createroom" component={CreateRoom} />
                        <Route path="/myprofile" component={MyProfile} />
                        <Route path="/socket" component={Socket} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
                {/* <Footer></Footer> */}
            </AuthContext.Provider>
        </div>
    );
}

export default App;
