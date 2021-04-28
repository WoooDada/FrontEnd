import { Switch, Route } from "react-router-dom";

// Page 로딩
import { Main, Auth, MyProfile, NotFound, Home } from "./pages";
import Header from "./components/Header";
import "./App.css";

function App() {
    return (
        <div className="App">
            <Header></Header>
            <Switch>
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
