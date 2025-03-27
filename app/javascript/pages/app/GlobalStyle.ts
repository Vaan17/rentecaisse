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
    h1,h2,h3 {${fontTitle}}

    body {
        margin: 0;
    }
`;

export default GlobalStyle;
