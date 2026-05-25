"use client";

import React from "react";
import styled from "styled-components";

const BoxLoader = () => {
  return (
    <StyledWrapper>
      <svg xmlns="http://www.w3.org/2000/svg" height={200} width={200}>
        <g style={{ order: -1 }}>
          <polygon
            transform="rotate(45 100 100)"
            strokeWidth={1}
            stroke="#a3e635"
            fill="none"
            points="70,70 148,50 130,130 50,150"
            id="bounce"
          />

          <polygon
            transform="rotate(45 100 100)"
            strokeWidth={1}
            stroke="#a3e635"
            fill="none"
            points="70,70 148,50 130,130 50,150"
            id="bounce2"
          />

          <polygon
            transform="rotate(45 100 100)"
            strokeWidth={2}
            stroke="none"
            fill="#414750"
            points="70,70 150,50 130,130 50,150"
          />

          <polygon
            strokeWidth={2}
            stroke="none"
            fill="url(#gradiente)"
            points="100,70 150,100 100,130 50,100"
          />

          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
              <stop
                style={{ stopColor: "#1e2026", stopOpacity: 1 }}
                offset="20%"
              />
              <stop
                style={{ stopColor: "#414750", stopOpacity: 1 }}
                offset="60%"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="translate(20, 31)"
            strokeWidth={2}
            stroke="none"
            fill="#84cc16"
            points="80,50 80,75 80,99 40,75"
          />

          <polygon
            transform="translate(20, 31)"
            strokeWidth={2}
            stroke="none"
            fill="url(#gradiente2)"
            points="40,-40 80,-40 80,99 40,75"
          />

          <defs>
            <linearGradient
              y2="100%"
              x2="0%"
              y1="-17%"
              x1="10%"
              id="gradiente2"
            >
              <stop
                style={{ stopColor: "#a3e63500", stopOpacity: 1 }}
                offset="20%"
              />
              <stop
                style={{ stopColor: "#a3e63554", stopOpacity: 1 }}
                offset="100%"
                id="animatedStop1"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="rotate(180 100 100) translate(20, 20)"
            strokeWidth={2}
            stroke="none"
            fill="#a3e635"
            points="80,50 80,75 80,99 40,75"
          />

          <polygon
            transform="rotate(0 100 100) translate(60, 20)"
            strokeWidth={2}
            stroke="none"
            fill="url(#gradiente3)"
            points="40,-40 80,-40 80,85 40,110.2"
          />

          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
              <stop
                style={{ stopColor: "#a3e63500", stopOpacity: 1 }}
                offset="20%"
              />
              <stop
                style={{ stopColor: "#a3e63554", stopOpacity: 1 }}
                offset="100%"
                id="animatedStop2"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="rotate(45 100 100) translate(80, 95)"
            strokeWidth={2}
            stroke="none"
            fill="#bef264"
            points="5,0 5,5 0,5 0,0"
            id="particles1"
          />

          <polygon
            transform="rotate(45 100 100) translate(80, 55)"
            strokeWidth={2}
            stroke="none"
            fill="#a3e635"
            points="6,0 6,6 0,6 0,0"
            id="particles2"
          />

          <polygon
            transform="rotate(45 100 100) translate(70, 80)"
            strokeWidth={2}
            stroke="none"
            fill="#ecfccb"
            points="2,0 2,2 0,2 0,0"
            id="particles3"
          />

          <polygon
            strokeWidth={2}
            stroke="none"
            fill="#292d34"
            points="29.5,99.8 100,142 100,172 29.5,130"
          />

          <polygon
            transform="translate(50, 92)"
            strokeWidth={2}
            stroke="none"
            fill="#1f2127"
            points="50,50 120.5,8 120.5,35 50,80"
          />
        </g>
      </svg>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  @keyframes bounce {
    0%,
    100% {
      translate: 0px 36px;
    }
    50% {
      translate: 0px 46px;
    }
  }

  @keyframes bounce2 {
    0%,
    100% {
      translate: 0px 46px;
    }
    50% {
      translate: 0px 56px;
    }
  }

  @keyframes umbral {
    0% {
      stop-color: #a3e6352e;
    }
    50% {
      stop-color: rgba(163, 230, 53, 0.8);
    }
    100% {
      stop-color: #a3e6352e;
    }
  }

  @keyframes partciles {
    0%,
    100% {
      translate: 0px 16px;
    }
    50% {
      translate: 0px 6px;
    }
  }

  #particles1,
  #particles2,
  #particles3 {
    animation: partciles 1s ease-in-out infinite;
  }

  #animatedStop1,
  #animatedStop2 {
    animation: umbral 1s infinite;
  }

  #bounce {
    animation: bounce 1s ease-in-out infinite;
    translate: 0px 36px;
  }

  #bounce2 {
    animation: bounce2 1s ease-in-out infinite;
    translate: 0px 46px;
    animation-delay: 0.125s;
  }
`;

export default BoxLoader;
