import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../App";
import "../css/LeftStudy.css";
import { getApi } from "../api";
// import { Container, Row, Col } from 'react-grid';
import HeatMap from 'react-heatmap-grid';

const TenMinPlanner = () => {
    const authContext = useContext(AuthContext);
    var update;
    // const [tenMinData, setTenMinData] = useState([]);
    const [tenMinData, setTenMinData] = useState([
        {
            id: 1,
            stt_time: "9:00",
            end_time: "9:10",
            concent_type: "C", // c: concentrate & p: play
        },
        {
            id: 2,
            stt_time: "11:00",
            end_time: "11:10",
            concent_type: "P",
        },
    ]);

    useEffect(() => {
        const getTenmin = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                    update: update, // F:한꺼번에 받아옴, T:하나(10분단위)만 받아옴
                },
                "/study/ten_min_data/"
            );
            await console.log("룰루");
            if (status === 200) {
                await console.log(data.ten_min_list);
                await setTenMinData(
                    data.ten_min_list.map(t => ({
                        stt_time: t.stt_time,
                        end_time: t.end_time,
                        concent_type: t.concent_type,
                    }))
                );
                await console.log("tenMinData:", tenMinData);
            } else {
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        // getTenmin();
    }, []);

    const DrawGrid = () => {
        const xLabels = [0,10,20,30,40,50];
        const yLabels = [5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,1,2,3,4];
            
        const data = new Array(yLabels.length) // 랜덤으로 -100 ~ 100 숫자 
            .fill(0)
            .map(() =>
                new Array(xLabels.length).fill(0)
                .map(() => Math.floor(((0.5-Math.random()) * 200)))
            );
        // data 값 : 0 = nothing / 100 = concentrate / -100 = play
        // 초기데이터 : 싹다 0
        // const data = new Array(yLabels.length) 
        // .fill(0)
        // .map(() =>
        //     new Array(xLabels.length).fill(0)
        // );
        
        return (
            <HeatMap
                xLabels={xLabels}
                yLabels={yLabels}
                xLabelsLocation={"top"}
                xLabelWidth={10}
                yLabelWidth={15}
                yLabelTextAlign='center'
                data={data}
                cellStyle={(background, value, min, max, data, x, y) => ({
                    background: `rgb(66, 86, 244, ${1 - (max - value) / (max - min)})`,
                    fontSize: "10px",
                })}
                cellRender={value => value && `${value}%`}
            />
        );
    };

    const DrawTenMin = ({ stt_time, end_time, concent_type }) => {
        
    };

    return (
        <div className="daily-tenmin">
            <DrawGrid />
            {/* {tenMinData.map((d, i) => (
                <DrawTenMin
                    key={d.id}
                    stt_time={d.stt_time}
                    end_time={d.end_time}
                    concent_type={d.concent_type}
                ></DrawTenMin>
            ))} */}
        </div>
    );
};

export default TenMinPlanner;