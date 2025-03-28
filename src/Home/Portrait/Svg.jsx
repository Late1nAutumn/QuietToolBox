import React from "react";

import { PATHS } from "./portraitData";
import Shape from "./Shape";

export default function Svg(props) {
  return (
    <svg
      id="cover-portrait-canvas"
      height="100%"
      width="100%"
      viewBox="0 0 617 800"
    >
      {PATHS.map((obj, i) => (
        <Shape key={i} data={obj} index={i} static={props.eyeTrack} />
      ))}
      {/* left eye */}
      <clipPath id="portrait-clipPath-leftEye">
        <path fill="white" d={PATHS[12].path} />
      </clipPath>
      <circle
        id="portrait-leftpupil"
        cx={props.eyeTrack ? props.lEyeX : "201"}
        cy={props.eyeTrack ? props.lEyeY : "376"}
        r="16"
        style={{
          WebkitClipPath: "url(#portrait-clipPath-leftEye)",
        }}
        clipPath="url(#portrait-clipPath-leftEye)"
        fill="#171813"
        opacity={props.eyeTrack ? "1" : "0"}
      />
      <circle
        id="portrait-leftpupil"
        cx={props.eyeTrack ? props.lEyeX : "0"}
        cy={props.eyeTrack ? props.lEyeY : "0"}
        r="8"
        style={{
          WebkitClipPath: "url(#portrait-clipPath-leftEye)",
        }}
        clipPath="url(#portrait-clipPath-leftEye)"
        fill="black"
      />
      <circle
        id="portrait-lefthighlight"
        cx={props.eyeTrack ? "198" : "0"}
        cy={props.eyeTrack ? "380" : "0"}
        r="4"
        style={{
          WebkitClipPath: "url(#portrait-clipPath-leftEye)",
        }}
        clipPath="url(#portrait-clipPath-leftEye)"
        fill="#939393"
      />
      {props.eyeTrack ? null : (
        <animate
          href="#portrait-leftpupil"
          attributeName="opacity"
          from="0"
          to="1"
          fill="freeze"
          begin="3300ms"
          dur="400ms"
        />
      )}
      {/* right eye */}
      <clipPath id="portrait-clipPath-rightEye">
        <path fill="white" d={PATHS[14].path} />
      </clipPath>
      <circle
        id="portrait-rightpupil"
        cx={props.eyeTrack ? props.rEyeX : "403"}
        cy={props.eyeTrack ? props.rEyeY : "373"}
        r="16"
        style={{
          WebkitClipPath: "url(#portrait-clipPath-rightEye)",
        }}
        clipPath="url(#portrait-clipPath-rightEye)"
        fill="#171813"
        opacity={props.eyeTrack ? "1" : "0"}
      />
      <circle
        id="portrait-rightpupil"
        cx={props.eyeTrack ? props.rEyeX : "0"}
        cy={props.eyeTrack ? props.rEyeY : "0"}
        r="8"
        style={{
          WebkitClipPath: "url(#portrait-clipPath-rightEye)",
        }}
        clipPath="url(#portrait-clipPath-rightEye)"
        fill="black"
      />
      <circle
        id="portrait-righthighlight"
        cx={props.eyeTrack ? "402" : "0"}
        cy={props.eyeTrack ? "377" : "0"}
        r="4"
        style={{
          WebkitClipPath: "url(#portrait-clipPath-rightEye)",
        }}
        clipPath="url(#portrait-clipPath-rightEye)"
        fill="#939393"
      />
      {props.eyeTrack ? null : (
        <animate
          href="#portrait-rightpupil"
          attributeName="opacity"
          from="0"
          to="1"
          fill="freeze"
          begin="3300ms"
          dur="400ms"
        />
      )}
    </svg>
  );
}
