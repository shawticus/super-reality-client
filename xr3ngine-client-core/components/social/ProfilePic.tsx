import React from "react";
import Router from "next/router";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export function ProfilePic({
  src,
  username,
  size,
  border,
  href,
  ...props
}: any) {
  return (
    <span {...props} onClick={() => Router.push("/[pid]", `/${username}`)}>
      {src ? <img
        alt={`${username}'s profile pic`}
        data-testid="user-avatar"
        draggable="false"
        src={src}
        style={{
          width: size,
          height: size,
          borderRadius: size,
          border: border && "2px solid white",
          cursor: "pointer",
        }}
      ></img> :
      <AccountCircleIcon fontSize="large"/>}      
    </span>
  );
}
