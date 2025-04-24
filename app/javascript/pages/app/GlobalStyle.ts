import { createGlobalStyle, css } from "styled-components";
import colors from "./colors";

const fontTitle = css`
    font-family: 'Arial Black', Helvetica, sans-serif;
    text-transform: uppercase;
`;
const GlobalStyle = createGlobalStyle`
    :root {
        ${colors}
        --top-bar-height: 48px;
    }

    *::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    *::-webkit-scrollbar-track {
        border-radius: 8px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
        background-color: var(--secondary200);
    }

    *::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: linear-gradient(180deg, var(--primary400) 0%, var(--primary500) 100%);
    }

    h1, h2, h3 {${fontTitle}}

    body {
        margin: 0;
    }
`;

export default GlobalStyle;
