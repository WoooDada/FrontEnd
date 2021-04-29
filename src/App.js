import { Switch, Route, Link } from "react-router-dom";

// Page 로딩
import { Main, Auth, MyProfile, NotFound, Home } from "./pages";
// import Header from "./components/Header";
import "./App.css";

const Header = () => {
    return (
        <div className="App-header">
            <h1 className="App-header-title">공다다</h1>
            <div>
                <Link to="/" className="App-header-route">
                    홈
                </Link>
                <Link to="/auth" className="App-header-route">
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
            <Switch className="App-body">
                <Route path="/" component={Home} exact />
                <Route path="/auth" component={Auth} />
                <Route path="/myprofile" component={MyProfile} />
                <Route path="/main" component={Main} />
                <Route component={NotFound} />
            </Switch>
        </div>
    );
}

export default App;
