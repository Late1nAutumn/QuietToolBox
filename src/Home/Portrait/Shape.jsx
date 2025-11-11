// WARNING: negative offset value WON'T work on Safari

import React from "react";

export default function Shape(props) {
  const {
    path,
    fill,
    perimeter,
    top,
    bottom,
    left,
    right,
    strokeDashStart,
    strokeDashDur,
    strokeDashDir,
    fillStart,
    fillDur,
    fillReverse,
    strokeFadeStart,
  } = props.data;
  // optimize DOM tree, no visual difference
  if (props.static) return <path fill={fill} d={path} />;
  else
    return (
      <g>
        <clipPath id={"portrait-clipPath-path" + props.index}>
          <path fill="violet" d={path} />
        </clipPath>
        <rect
          id={"portrait-rect" + props.index}
          width={right - left}
          height={bottom - top}
          x={fillReverse ? right : 2 * left - right}
          y={top}
          fill={fill}
          style={{
            WebkitClipPath: `url(#portrait-clipPath-path${props.index})`,
          }}
          clipPath={`url(#portrait-clipPath-path${props.index})`}
        />
        <animate
          href={"#portrait-rect" + props.index}
          attributeName="x"
          from={fillReverse ? right : 2 * left - right}
          to={left}
          fill="freeze"
          begin={fillStart + "ms"}
          dur={fillDur + "ms"}
        />

        {strokeDashDur ? (
          <path
            id={"portrait-stroke" + props.index}
            d={path}
            fill={"transparent"}
            stroke={"white"}
            strokeWidth={2}
            style={{
              strokeDasharray: perimeter,
              // WARNING: negative offset value WON'T work on Safari
              strokeDashoffset: (strokeDashDir ? 1 : -1) * perimeter,
              animationName: "home-content-portrait-stroke-offset",
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
              animationDelay: strokeDashStart + "ms",
              animationDuration: strokeDashDur + "ms",
            }}
          />
        ) : null}
        {strokeDashDur && strokeFadeStart !== -1 ? (
          <animate
            href={"#portrait-stroke" + props.index}
            attributeName="stroke-opacity"
            from="1"
            to="0"
            fill="freeze"
            begin={strokeFadeStart + "ms"}
            dur="500ms"
          />
        ) : null}
      </g>
    );
}
