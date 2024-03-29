import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
  const history = useHistory();
  const didMountRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const Logout = async () => {
    await auth.signOut();
    history.push("/");
  };
  const getImage = async (url) => {
    const respone = await fetch(url);
    const file = await respone.blob();
    return new File([file], "userPhoto.jpg", { type: "image/jpeg" });
  };
  const { user } = useAuth();
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
    if (!user) {
      history.push("/");
      return;
    }
    axios
      .get("https://api.chatengine.io/users/me/", {
        headers: {
          "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
          "user-name": user.email,
          "user-secret": user.uid,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        let formdata = new FormData();
        formdata.append("email", user.email);
        formdata.append("username", user.email);
        formdata.append("secret", user.uid);
        getImage(user.photoURL).then((avatar) => {
          formdata.append("avatar", avatar, avatar.name);
          axios
            .post("https://api.chatengine.io/users/", formdata, {
              headers: { "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY },
            })
            .then(() => {
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
  }, [user, history]);
  if (!user || loading) {
    return "..loading";
  }
  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">ChatLite</div>
        <div className="logout-tab" onClick={Logout}>
          Logout
        </div>
      </div>
      <ChatEngine
        height="calc(100vh - 66px)"
        projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;
