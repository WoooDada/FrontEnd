import React from "react";
import CreateRoomForm from "../components/CreateRoomForm";

import "../css/Home.css";
import "../css/CreateRoom.css";

const CreateRoom = (props) => {
    return (
        <div className="CreateRoom-page">
            <CreateRoomForm history={props.history}></CreateRoomForm>

        </div>
    );
};

export default CreateRoom;