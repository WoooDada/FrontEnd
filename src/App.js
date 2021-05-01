import { Switch, Route, Link } from "react-router-dom";

// Page 로딩
import { Main, Auth, MyProfile, NotFound, Home, Signup } from "./pages";
// import Header from "./components/Header";
import "./App.css";

const Header = () => {
    return (
        <div className="App-header">
            <h1 className="App-header-title">공다다</h1>
            <div className="App-header-router-wrapper">
                <Link to="/" className="App-header-route">
                    홈
                </Link>
                <Link to="/login" className="App-header-route">
                    로그인
                </Link>
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

function App() {
    return (
        <div className="App">
            <Header></Header>
            <div className="App-body">
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/login" component={Auth} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/myprofile" component={MyProfile} />
                    <Route path="/main" component={Main} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </div>
    );
}

export default App;
