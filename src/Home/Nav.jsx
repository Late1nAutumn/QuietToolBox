import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NexusIcon } from "../svg/NexusIcon";

export const Nav = () => {
  const lc = useLocation();

  const homeButtonClassName = () => {
    // console.log(lc.pathname);
    let path = "." + lc.pathname;
    switch (true) {
      case path.includes("./nikki"):
        return "nikkikiwi-home";
      default:
        return "home-home";
    }
  };

  return (
    <Link to="/">
      <div className={homeButtonClassName()}>
        <NexusIcon />
      </div>
    </Link>
  );
};
