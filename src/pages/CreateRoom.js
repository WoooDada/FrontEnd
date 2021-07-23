import React, { useContext } from "react";
import { AuthContext } from "../App";
import CreateRoomForm from "../components/CreateRoomForm";

import "../css/Home.css";
import "../css/CreateRoom.css";

const CreateRoom = () => {
    return (
        <div className="CreateRoom-page">
            <CreateRoomForm></CreateRoomForm>

        </div>
    );
};

export default CreateRoom;