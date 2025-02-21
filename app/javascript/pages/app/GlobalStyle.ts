import { createGlobalStyle } from "styled-components";
import colors from "./colors";

const GlobalStyle = createGlobalStyle`
    :root {
        ${colors}
    }

    body {
        margin: 0;
    }
`

export default GlobalStyle;