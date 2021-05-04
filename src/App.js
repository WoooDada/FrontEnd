import { Switch, Route, Link } from "react-router-dom";

// Page 로딩
import { Main, MyProfile, NotFound, Home, Signup, Study } from "./pages";
// import Header from "./components/Header";
import "./App.css";
import Login from "./pages/Login";
import { useReducer, createContext, useContext } from "react";

//////////////////////////////////////////////////////////////////////////////////
const Header = () => {
    const authContext = useContext(AuthContext);
    return (
        <div className="App-header">
            <h1 className="App-header-title">공다다</h1>
            <div className="App-header-router-wrapper">
                <Link to="/" className="App-header-route">
                    홈
                </Link>
                {/* 로그인 여부에 따라 header에 login or myprofile 출력 */}
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
            </div>
        </div>
    );
};

const Footer = () => {
    const authContext = useContext(AuthContext);
    return (
        <div className="App-footer">
            <p>개발자들: 이진 전우정 김다현</p>
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
            return { uid: action.payload };
        case "logout":
            return { uid: null };
        default:
            return state;
    }
};

//////////////////////////////////////////////////////////////////////////////////
function App() {
    const [state, dispatch] = useReducer(reducer, {
        uid: null,
    });
    return (
        <div className="App">
            <AuthContext.Provider value={{ state, dispatch }}>
                <Header></Header>
                <div className="App-body">
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
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
