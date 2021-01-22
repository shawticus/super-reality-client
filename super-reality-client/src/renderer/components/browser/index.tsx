import "./index.scss";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { AppState } from "../../redux/stores/renderer";

import Channels from "../channels";
import Chat from "../chat";
import Login from "../chat/login-chat";
import GroupsPage from "../groups";

import Sonic from "../../../assets/images/sonic.png";
import GroupSettings from "../groups/group-settings";
import PagesIndex from "../../../types/browser";
import reduxAction from "../../redux/reduxAction";

interface ChatContainerProps {
  setPage: (pageIndex: any) => void;
}
function ChatContainer(props: ChatContainerProps) {
  const { setPage } = props;
  const { messages, users, activeGroup } = useSelector(
    (state: AppState) => state.chat
  );
  return (
    <>
      <Channels activeGroup={activeGroup} setPage={setPage} />
      <Chat messages={messages} users={users} />
    </>
  );
}

export default function Browser() {
  const { isChatAuth, groups } = useSelector((state: AppState) => state.chat);
  const dispatch = useDispatch();
  const [showGroupsList, setShowGroupsList] = useState<boolean>(false);
  const [showGroups, setShowGroups] = useState(false);

  const opacitySprings: any = showGroupsList ? "1" : "0";
  const zIndexSprings: any = showGroupsList ? "1000" : "0";
  const springProps = useSpring({
    transform: showGroupsList ? `translateY(40)` : `translateY(-100%)`,
    opacity: opacitySprings,
    zIndex: zIndexSprings,
  });
  const pages = [ChatContainer, GroupSettings];
  const [browserContent, setBrowserContent] = useState<any>(
    PagesIndex.chatContainer
  );

  const setPage = (pageIndex: any) => {
    setBrowserContent(pageIndex);
  };
  const CurrentPage = pages[browserContent];

  const setActiveGroup = (id: string) => {
    reduxAction(dispatch, {
      type: "SET_ACTIVE_GROUP",
      arg: id,
    });
  };
  return (
    <div>
      <div className="browser-nav">
        <div className="group-button">
          <div
            className="single-button"
            onClick={() => {
              setShowGroupsList(!showGroupsList);
            }}
          >
            <img src={Sonic} alt="" />

            <animated.div
              style={{
                ...springProps,
              }}
            >
              <ul className="menu-groups-list">
                <li key="show-groups">
                  <div
                    className="group-title"
                    onClick={() => {
                      setShowGroups(!showGroups);
                    }}
                  >
                    {showGroups ? "Show Chat" : "Show Groups"}
                  </div>
                </li>
                {groups.map((group) => {
                  return (
                    <li
                      key={group._id}
                      onClick={() => {
                        setActiveGroup(group._id);
                      }}
                    >
                      <img
                        src={group.collectivePhoto}
                        className="avatar"
                        alt=""
                      />
                      <div className="menu-list-group-name">
                        {group.collectiveName}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </animated.div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
      </div>
      {!isChatAuth ? (
        <main className="container text-center">
          <Login />
        </main>
      ) : (
        <div>
          <div className="chat-and-channels-container">
            {showGroups ? <GroupsPage /> : <CurrentPage setPage={setPage} />}
          </div>
        </div>
      )}
    </div>
  );
}
//  <button
// type="button"
// style={{
//   color: "var(--color-text)",
//   cursor: "pointer",
// }}
// onClick={() => {
//   setShowGroups(!showGroups);
// }}
// />