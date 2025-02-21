import { css } from "styled-components"

const colors = css`
    // =-=-=-=-=-=-=-=-=-= PRIMARY COLOR =-=-=-=-=-=-=-=-=-=
    --primary-hue: 47;
    --primary-saturation: 94%;
    
    --primary50-lightness: 93%;
    --primary100-lightness: 88%;
    --primary200-lightness: 78%;
    --primary300-lightness: 68%;
    --primary400-lightness: 58%;
    --primary500-lightness: 48%;
    --primary600-lightness: 38%;
    --primary700-lightness: 28%;
    --primary800-lightness: 18%;
    --primary900-lightness: 8%;

    // --primary: hsl(47, 94%, 48%);
    --primary: hsl(var(--primary-hue), var(--primary-saturation), var(--primary500-lightness));

    // --primary50: hsl(47, 94%, 93%);
    --primary50: hsl(var(--primary-hue), var(--primary-saturation), var(--primary50-lightness));

    // --primary100: hsl(47, 94%, 88%);
    --primary100: hsl(var(--primary-hue), var(--primary-saturation), var(--primary100-lightness));

    // --primary200: hsl(47, 94%, 78%);
    --primary200: hsl(var(--primary-hue), var(--primary-saturation), var(--primary200-lightness));

    // --primary300: hsl(47, 94%, 68%);
    --primary300: hsl(var(--primary-hue), var(--primary-saturation), var(--primary300-lightness));

    // --primary400: hsl(47, 94%, 58%);
    --primary400: hsl(var(--primary-hue), var(--primary-saturation), var(--primary400-lightness));

    // --primary500: hsl(47, 94%, 48%);
    --primary500: hsl(var(--primary-hue), var(--primary-saturation), var(--primary500-lightness));

    // --primary600: hsl(47, 94%, 38%);
    --primary600: hsl(var(--primary-hue), var(--primary-saturation), var(--primary600-lightness));

    // --primary700: hsl(47, 94%, 28%);
    --primary700: hsl(var(--primary-hue), var(--primary-saturation), var(--primary700-lightness));

    // --primary800: hsl(47, 94%, 18%);
    --primary800: hsl(var(--primary-hue), var(--primary-saturation), var(--primary800-lightness));

    // --primary900: hsl(47, 94%, 8%);
    --primary900: hsl(var(--primary-hue), var(--primary-saturation), var(--primary900-lightness));

    // =-=-=-=-=-=-=-=-=-= SECONDARY COLOR =-=-=-=-=-=-=-=-=-=
    --secondary-hue: 0;
    --secondary-saturation: 3%;
    
    --secondary50-lightness: 93%;
    --secondary100-lightness: 88%;
    --secondary200-lightness: 78%;
    --secondary300-lightness: 68%;
    --secondary400-lightness: 58%;
    --secondary500-lightness: 48%;
    --secondary600-lightness: 38%;
    --secondary700-lightness: 28%;
    --secondary800-lightness: 18%;
    --secondary900-lightness: 8%;

    // --secondary: hsl(0, 3%, 8%);
    --secondary: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary500-lightness));

    // --secondary50: hsl(0, 3%, 93%);
    --secondary50: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary50-lightness));

    // --secondary100: hsl(0, 3%, 88%);
    --secondary100: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary100-lightness));

    // --secondary200: hsl(0, 3%, 78%);
    --secondary200: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary200-lightness));

    // --secondary300: hsl(0, 3%, 68%);
    --secondary300: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary300-lightness));

    // --secondary400: hsl(0, 3%, 58%);
    --secondary400: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary400-lightness));

    // --secondary500: hsl(0, 3%, 48%);
    --secondary500: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary500-lightness));

    // --secondary600: hsl(0, 3%, 38%);
    --secondary600: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary600-lightness));

    // --secondary700: hsl(0, 3%, 28%);
    --secondary700: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary700-lightness));

    // --secondary800: hsl(0, 3%, 18%);
    --secondary800: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary800-lightness));

    // --secondary900: hsl(0, 3%, 8%);
    --secondary900: hsl(var(--secondary-hue), var(--secondary-saturation), var(--secondary900-lightness));

    // =-=-=-=-=-=-=-=-=-= RED COLOR =-=-=-=-=-=-=-=-=-=
    --red-hue: 352;
    --red-saturation: 88%;

    --red50-lightness: 93%;
    --red100-lightness: 88%;
    --red200-lightness: 78%;
    --red300-lightness: 68%;
    --red400-lightness: 58%;
    --red500-lightness: 48%;
    --red600-lightness: 38%;
    --red700-lightness: 28%;
    --red800-lightness: 18%;
    --red900-lightness: 8%;

    // --red: hsl(352, 88%, 48%);
    --red: hsl(var(--red-hue), var(--red-saturation), var(--red500-lightness));

    // --red50: hsl(352, 88%, 93%);
    --red50: hsl(var(--red-hue), var(--red-saturation), var(--red50-lightness));

    // --red100: hsl(352, 88%, 88%);
    --red100: hsl(var(--red-hue), var(--red-saturation), var(--red100-lightness));

    // --red200: hsl(352, 88%, 78%);
    --red200: hsl(var(--red-hue), var(--red-saturation), var(--red200-lightness));

    // --red300: hsl(352, 88%, 68%);
    --red300: hsl(var(--red-hue), var(--red-saturation), var(--red300-lightness));

    // --red400: hsl(352, 88%, 58%);
    --red400: hsl(var(--red-hue), var(--red-saturation), var(--red400-lightness));

    // --red500: hsl(352, 88%, 48%);
    --red500: hsl(var(--red-hue), var(--red-saturation), var(--red500-lightness));

    // --red600: hsl(352, 88%, 38%);
    --red600: hsl(var(--red-hue), var(--red-saturation), var(--red600-lightness));

    // --red700: hsl(352, 88%, 28%);
    --red700: hsl(var(--red-hue), var(--red-saturation), var(--red700-lightness));

    // --red800: hsl(352, 88%, 18%);
    --red800: hsl(var(--red-hue), var(--red-saturation), var(--red800-lightness));

    // --red900: hsl(352, 88%, 8%);
    --red900: hsl(var(--red-hue), var(--red-saturation), var(--red900-lightness));

    // =-=-=-=-=-=-=-=-=-= YELLOW COLOR =-=-=-=-=-=-=-=-=-=
    --yellow-hue: 67;
    --yellow-saturation: 93%;

    --yellow50-lightness: 93%;
    --yellow100-lightness: 88%;
    --yellow200-lightness: 78%;
    --yellow300-lightness: 68%;
    --yellow400-lightness: 58%;
    --yellow500-lightness: 48%;
    --yellow600-lightness: 38%;
    --yellow700-lightness: 28%;
    --yellow800-lightness: 18%;
    --yellow900-lightness: 8%;

    // --yellow: hsl(67, 93%, 48%);
    --yellow: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow500-lightness));

    // --yellow50: hsl(67, 93%, 93%);
    --yellow50: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow50-lightness));

    // --yellow100: hsl(67, 93%, 88%);
    --yellow100: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow100-lightness));

    // --yellow200: hsl(67, 93%, 78%);
    --yellow200: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow200-lightness));

    // --yellow300: hsl(67, 93%, 68%);
    --yellow300: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow300-lightness));

    // --yellow400: hsl(67, 93%, 58%);
    --yellow400: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow400-lightness));

    // --yellow500: hsl(67, 93%, 48%);
    --yellow500: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow500-lightness));

    // --yellow600: hsl(67, 93%, 38%);
    --yellow600: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow600-lightness));

    // --yellow700: hsl(67, 93%, 28%);
    --yellow700: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow700-lightness));

    // --yellow800: hsl(67, 93%, 18%);
    --yellow800: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow800-lightness));

    // --yellow900: hsl(67, 93%, 8%);
    --yellow900: hsl(var(--yellow-hue), var(--yellow-saturation), var(--yellow900-lightness));

    // =-=-=-=-=-=-=-=-=-= GREEN COLOR =-=-=-=-=-=-=-=-=-=
    --green-hue: 150;
    --green-saturation: 68%;

    --green50-lightness: 93%;
    --green100-lightness: 88%;
    --green200-lightness: 78%;
    --green300-lightness: 68%;
    --green400-lightness: 58%;
    --green500-lightness: 48%;
    --green600-lightness: 38%;
    --green700-lightness: 28%;
    --green800-lightness: 18%;
    --green900-lightness: 8%;

    // --green: hsl(150, 68%, 38%);
    --green: hsl(var(--green-hue), var(--green-saturation), var(--green500-lightness));

    // --green50: hsl(150, 68%, 93%);
    --green50: hsl(var(--green-hue), var(--green-saturation), var(--green50-lightness));

    // --green100: hsl(150, 68%, 88%);
    --green100: hsl(var(--green-hue), var(--green-saturation), var(--green100-lightness));

    // --green200: hsl(150, 68%, 78%);
    --green200: hsl(var(--green-hue), var(--green-saturation), var(--green200-lightness));

    // --green300: hsl(150, 68%, 68%);
    --green300: hsl(var(--green-hue), var(--green-saturation), var(--green300-lightness));

    // --green400: hsl(150, 68%, 58%);
    --green400: hsl(var(--green-hue), var(--green-saturation), var(--green400-lightness));

    // --green500: hsl(150, 68%, 48%);
    --green500: hsl(var(--green-hue), var(--green-saturation), var(--green500-lightness));

    // --green600: hsl(150, 68%, 38%);
    --green600: hsl(var(--green-hue), var(--green-saturation), var(--green600-lightness));

    // --green700: hsl(150, 68%, 28%);
    --green700: hsl(var(--green-hue), var(--green-saturation), var(--green700-lightness));

    // --green800: hsl(150, 68%, 18%);
    --green800: hsl(var(--green-hue), var(--green-saturation), var(--green800-lightness));

    // --green900: hsl(150, 68%, 8%);
    --green900: hsl(var(--green-hue), var(--green-saturation), var(--green900-lightness));

    // =-=-=-=-=-=-=-=-=-= BLUE COLOR =-=-=-=-=-=-=-=-=-=
    --blue-hue: 210;
    --blue-saturation: 79%;

    --blue50-lightness: 93%;
    --blue100-lightness: 88%;
    --blue200-lightness: 78%;
    --blue300-lightness: 68%;
    --blue400-lightness: 58%;
    --blue500-lightness: 48%;
    --blue600-lightness: 38%;
    --blue700-lightness: 28%;
    --blue800-lightness: 18%;
    --blue900-lightness: 8%;

    // --blue: hsl(210, 79%, 48%);
    --blue: hsl(var(--blue-hue), var(--blue-saturation), var(--blue500-lightness));

    // --blue50: hsl(210, 79%, 93%);
    --blue50: hsl(var(--blue-hue), var(--blue-saturation), var(--blue50-lightness));

    // --blue100: hsl(210, 79%, 88%);
    --blue100: hsl(var(--blue-hue), var(--blue-saturation), var(--blue100-lightness));

    // --blue200: hsl(210, 79%, 78%);
    --blue200: hsl(var(--blue-hue), var(--blue-saturation), var(--blue200-lightness));

    // --blue300: hsl(210, 79%, 68%);
    --blue300: hsl(var(--blue-hue), var(--blue-saturation), var(--blue300-lightness));

    // --blue400: hsl(210, 79%, 58%);
    --blue400: hsl(var(--blue-hue), var(--blue-saturation), var(--blue400-lightness));

    // --blue500: hsl(210, 79%, 48%);
    --blue500: hsl(var(--blue-hue), var(--blue-saturation), var(--blue500-lightness));

    // --blue600: hsl(210, 79%, 38%);
    --blue600: hsl(var(--blue-hue), var(--blue-saturation), var(--blue600-lightness));

    // --blue700: hsl(210, 79%, 28%);
    --blue700: hsl(var(--blue-hue), var(--blue-saturation), var(--blue700-lightness));

    // --blue800: hsl(210, 79%, 18%);
    --blue800: hsl(var(--blue-hue), var(--blue-saturation), var(--blue800-lightness));

    // --blue900: hsl(210, 79%, 8%);
    --blue900: hsl(var(--blue-hue), var(--blue-saturation), var(--blue900-lightness));

    // =-=-=-=-=-=-=-=-=-= ORANGE COLOR =-=-=-=-=-=-=-=-=-=
    --orange-hue: 30;
    --orange-saturation: 85%;

    --orange50-lightness: 93%;
    --orange100-lightness: 88%;
    --orange200-lightness: 78%;
    --orange300-lightness: 68%;
    --orange400-lightness: 58%;
    --orange500-lightness: 48%;
    --orange600-lightness: 38%;
    --orange700-lightness: 28%;
    --orange800-lightness: 18%;
    --orange900-lightness: 8%;

    // --orange: hsl(30, 85%, 48%);
    --orange: hsl(var(--orange-hue), var(--orange-saturation), var(--orange500-lightness));

    // --orange50: hsl(30, 85%, 93%);
    --orange50: hsl(var(--orange-hue), var(--orange-saturation), var(--orange50-lightness));

    // --orange100: hsl(30, 85%, 88%);
    --orange100: hsl(var(--orange-hue), var(--orange-saturation), var(--orange100-lightness));

    // --orange200: hsl(30, 85%, 78%);
    --orange200: hsl(var(--orange-hue), var(--orange-saturation), var(--orange200-lightness));

    // --orange300: hsl(30, 85%, 68%);
    --orange300: hsl(var(--orange-hue), var(--orange-saturation), var(--orange300-lightness));

    // --orange400: hsl(30, 85%, 58%);
    --orange400: hsl(var(--orange-hue), var(--orange-saturation), var(--orange400-lightness));

    // --orange500: hsl(30, 85%, 48%);
    --orange500: hsl(var(--orange-hue), var(--orange-saturation), var(--orange500-lightness));

    // --orange600: hsl(30, 85%, 38%);
    --orange600: hsl(var(--orange-hue), var(--orange-saturation), var(--orange600-lightness));

    // --orange700: hsl(30, 85%, 28%);
    --orange700: hsl(var(--orange-hue), var(--orange-saturation), var(--orange700-lightness));

    // --orange800: hsl(30, 85%, 18%);
    --orange800: hsl(var(--orange-hue), var(--orange-saturation), var(--orange800-lightness));

    // --orange900: hsl(30, 85%, 8%);
    --orange900: hsl(var(--orange-hue), var(--orange-saturation), var(--orange900-lightness));

    // =-=-=-=-=-=-=-=-=-= PURPLE COLOR =-=-=-=-=-=-=-=-=-=
    --purple-hue: 260;
    --purple-saturation: 60%;

    --purple50-lightness: 93%;
    --purple100-lightness: 88%;
    --purple200-lightness: 78%;
    --purple300-lightness: 68%;
    --purple400-lightness: 58%;
    --purple500-lightness: 48%;
    --purple600-lightness: 38%;
    --purple700-lightness: 28%;
    --purple800-lightness: 18%;
    --purple900-lightness: 8%;

    // --purple: hsl(260, 60%, 48%);
    --purple: hsl(var(--purple-hue), var(--purple-saturation), var(--purple500-lightness));

    // --purple50: hsl(260, 60%, 93%);
    --purple50: hsl(var(--purple-hue), var(--purple-saturation), var(--purple50-lightness));

    // --purple100: hsl(260, 60%, 88%);
    --purple100: hsl(var(--purple-hue), var(--purple-saturation), var(--purple100-lightness));

    // --purple200: hsl(260, 60%, 78%);
    --purple200: hsl(var(--purple-hue), var(--purple-saturation), var(--purple200-lightness));

    // --purple300: hsl(260, 60%, 68%);
    --purple300: hsl(var(--purple-hue), var(--purple-saturation), var(--purple300-lightness));

    // --purple400: hsl(260, 60%, 58%);
    --purple400: hsl(var(--purple-hue), var(--purple-saturation), var(--purple400-lightness));

    // --purple500: hsl(260, 60%, 48%);
    --purple500: hsl(var(--purple-hue), var(--purple-saturation), var(--purple500-lightness));

    // --purple600: hsl(260, 60%, 38%);
    --purple600: hsl(var(--purple-hue), var(--purple-saturation), var(--purple600-lightness));

    // --purple700: hsl(260, 60%, 28%);
    --purple700: hsl(var(--purple-hue), var(--purple-saturation), var(--purple700-lightness));

    // --purple800: hsl(260, 60%, 18%);
    --purple800: hsl(var(--purple-hue), var(--purple-saturation), var(--purple800-lightness));

    // --purple900: hsl(260, 60%, 8%);
    --purple900: hsl(var(--purple-hue), var(--purple-saturation), var(--purple900-lightness));
`

export default colors