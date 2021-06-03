import { Switch, Route, Link } from "react-router-dom";

// Page 로딩
import { Main, MyProfile, NotFound, Home, Study } from "./pages";
// import Header from "./components/Header";
import "./App.css";
import Login from "./pages/Login";
import { useReducer, createContext, useContext } from "react";
import Logo from "./constants/imgs/newlogo.png";

//////////////////////////////////////////////////////////////////////////////////
const Header = () => {
    const authContext = useContext(AuthContext);
    return (
        <>
            <div className="App-header-belt"></div>
            <div className="App-header">
                <div className="App-header-title">
                    <div className="logo-title">
                        <img width="3%" src={Logo}></img>
                        <Link to="/" className="logo-title-txt">
                            공다다
                        </Link>
                    </div>
                    {!authContext.state.onLogin &&
                        (authContext.state.uid ? (
                            <Link to="/myprofile" className="App-header-route">
                                로그아웃
                            </Link>
                        ) : (
                            <Link to="/login" className="App-header-route">
                                로그인
                            </Link>
                        ))}
                </div>
                {/* <div className="App-header-router-wrapper">
                    <Link to="/" className="App-header-route">
                        홈
                    </Link>
                    로그인 여부에 따라 header에 login or myprofile 출력
                    {authContext.state.uid ? (
                        <></>
                    ) : (
                        <Link to="/login" className="App-header-route">
                            로그인
                        </Link>
                    )}
                    <Link to="/myprofile" className="App-header-route">
                        마이프로필
                    </Link>
                    <Link to="/main" className="App-header-route">
                        메인
                    </Link>
                    {/* 스터디는 임시임다
                    <Link to="/study" className="App-header-route">
                        스터디
                    </Link>
                </div> */}
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
                {authContext.state.uid
                    ? authContext.state.uid
                    : "로그인해주세요"}
            </p>
        </div>
    );
};
//////////////////////////////////////////////////////////////////////////////////
export const AuthContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "login":
            return { uid: action.payload, onLogin: true };
        case "logout":
            return { uid: null, onLogin: true };
        case "onLoginPage":
            return { uid: null, onLogin: true };
        case "notOnLoginPage":
            return { uid: state.uid, onLogin: false };
        default:
            return state;
    }
};

//////////////////////////////////////////////////////////////////////////////////
function App() {
    const [state, dispatch] = useReducer(reducer, {
        uid: null,
        onLogin: false,
    });
    return (
        <div className="App">
            <AuthContext.Provider value={{ state, dispatch }}>
                <Header></Header>
                <div className="App-body">
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} />
                        <Route path="/myprofile" component={MyProfile} />
                        <Route path="/main" component={Main} />
                        <Route path="/study" component={Study} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
                <Footer></Footer>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
