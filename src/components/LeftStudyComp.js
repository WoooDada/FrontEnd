import React from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { MonthlyComp, WeeklyComp, DailyComp } from "../components";

import "../css/Study.css";

const LeftStudyComp = () => {
    
    return (
        <div className="LeftComp">
            <div>여기는 왼쪽 스터디페이지: 컴포넌트</div>
            <Router>
                <div className="LeftComp-router">
                    <div>
                        <Link to="/tdl/monthly">monthly</Link>
                    </div>
                    <div>.....</div>
                    <div>
                        <Link to="/tdl/weekly">weekly</Link>
                    </div>
                    <div>.....</div>
                    <div>
                        <Link to="/tdl/daily">daily</Link>
                    </div>
                </div>
                <Route path='/tdl/daily' component={DailyComp} />
                <Route path='/tdl/weekly' component={WeeklyComp} />
                <Route path='/tdl/monthly' component={MonthlyComp} />
            </Router>
        </div>
    )
};

export default LeftStudyComp;
