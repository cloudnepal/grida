import React from "react";

export function SolidJsIcon({
  size,
  color,
}: {
  color: "white" | "black";
  size: number;
}) {
  switch (color) {
    case "white":
      return <SolidJsWhite size={size} />;
    case "black":
      // TODO:
      return <></>;
  }
}

function SolidJsWhite({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_8641_62576)">
        <path
          d="M64.0004 14.8415C64.0004 14.8415 42.6671 -0.856654 26.164 2.76599L24.9564 3.1685C22.5413 3.97353 20.5288 5.18108 19.3212 6.79114L18.5162 7.99869L12.4785 18.4641L22.9439 20.4767C27.3715 23.2943 33.0067 24.5018 38.2394 23.2943L56.7552 26.9169L64.0004 14.8415Z"
          fill="white"
        />
        <path
          opacity="0.3"
          d="M64.0004 14.8415C64.0004 14.8415 42.6671 -0.856654 26.164 2.76599L24.9564 3.1685C22.5413 3.97353 20.5288 5.18108 19.3212 6.79114L18.5162 7.99869L12.4785 18.4641L22.9439 20.4767C27.3715 23.2943 33.0067 24.5018 38.2394 23.2943L56.7552 26.9169L64.0004 14.8415Z"
          fill="url(#paint0_linear_8641_62576)"
        />
        <path
          d="M19.3199 14.8414L17.7098 15.2439C10.8671 17.2565 8.85451 23.6968 12.4771 29.332C16.5023 34.5647 24.9551 37.3823 31.7979 35.3697L56.7539 26.9169C56.7539 26.9169 35.4205 11.2188 19.3199 14.8414Z"
          fill="white"
        />
        <path
          opacity="0.3"
          d="M19.3199 14.8414L17.7098 15.2439C10.8671 17.2565 8.85451 23.6968 12.4771 29.332C16.5023 34.5647 24.9551 37.3823 31.7979 35.3697L56.7539 26.9169C56.7539 26.9169 35.4205 11.2188 19.3199 14.8414Z"
          fill="url(#paint1_linear_8641_62576)"
        />
        <path
          d="M52.327 32.9547C47.7171 27.1955 40.0751 24.8074 33.0063 26.917L8.05031 34.9673L0 49.0553L45.0817 56.7031L53.132 42.2126C54.7421 39.3949 54.3396 36.1748 52.327 32.9547Z"
          fill="url(#paint2_linear_8641_62576)"
        />
        <path
          d="M44.2767 47.0427C39.6668 41.2836 32.0248 38.8955 24.956 41.005L0 49.0553C0 49.0553 21.3333 65.1559 37.8365 61.1308L39.044 60.7283C45.8868 58.7157 48.3019 52.2754 44.2767 47.0427Z"
          fill="url(#paint3_linear_8641_62576)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_8641_62576"
          x1="9.45959"
          y1="11.6736"
          x2="52.1987"
          y2="32.4424"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1" stop-color="white" />
          <stop offset="0.3" stop-color="#C4C4C4" />
          <stop offset="1" stop-color="#868686" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_8641_62576"
          x1="36.9501"
          y1="22.6492"
          x2="34.4332"
          y2="31.0313"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C9C9C9" />
          <stop offset="0.5" stop-color="#C4C4C4" />
          <stop offset="1" stop-color="#A5A5A5" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_8641_62576"
          x1="5.79622"
          y1="36.7068"
          x2="45.554"
          y2="63.7383"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D8D8D8" />
          <stop offset="0.5" stop-color="white" />
          <stop offset="1" stop-color="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_8641_62576"
          x1="28.6591"
          y1="46.6159"
          x2="23.1163"
          y2="66.9432"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#E1E1E1" />
          <stop offset="0.5" stop-color="#F2F2F2" />
          <stop offset="1" stop-color="#F4F4F4" />
        </linearGradient>
        <clipPath id="clip0_8641_62576">
          <rect width="64" height="64" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
