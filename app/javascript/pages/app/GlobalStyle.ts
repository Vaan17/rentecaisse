import { createGlobalStyle } from "styled-components";
import colors from "./colors";

const GlobalStyle = createGlobalStyle`
    :root {
        ${colors}
        --top-bar-height: 48px;
    }

    body {
        margin: 0;
    }
`;

export default GlobalStyle;
