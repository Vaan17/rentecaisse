import styled, { css } from "styled-components"

type Unit = boolean | string | number

const parseUnit = ({
    unit,
    defaultUnit,
}: {
    unit: Unit
    defaultUnit: string
}) => {
    switch (typeof unit) {
        case "number":
            return `${unit}px`
        case "string":
            return unit
        case "boolean":
            return unit ? defaultUnit : 0
        default:
            return 0
    }
}

export const Flex = styled.div<{
    directionColumn?: boolean
    directionReverse?: boolean
    /**
     * @deprecated The method should not be used
     */
    wrap?: boolean
    $wrap?: boolean
    wrapReverse?: boolean
    gap?: boolean | string | number
    alignItemsInitial?: boolean
    alignItemsStart?: boolean
    alignItemsCenter?: boolean
    alignItemsEnd?: boolean
    alignItemsStretch?: boolean
    fullWidth?: boolean
    fullHeight?: boolean
    justifyCenter?: boolean
    spaceBetween?: boolean
    spaceAround?: boolean
    flexEnd?: boolean
    flex?: string | number
    zeroMinHeight?: boolean
    zeroMinWidth?: boolean
    flexGrow?: number
    padding?: string
    margin?: string
}>`
    /* Base and default */
    display: flex;
    align-items: center;
    /* Direction */

    ${({ directionColumn, directionReverse }) =>
        (directionColumn || directionReverse) &&
        css`
            flex-direction: ${directionColumn
                ? directionReverse
                    ? "column-reverse"
                    : "column"
                : directionReverse && "row-reverse"
            };
        `}

    /* Wrap deprecated */
    ${({ wrap, wrapReverse }) =>
        (wrap || wrapReverse) &&
        css`
            flex-wrap: ${wrapReverse ? "wrap-reverse" : wrap && "wrap"};
        `}

    /* Wrap */
    ${({ $wrap, wrapReverse }) =>
        ($wrap || wrapReverse) &&
        css`
            flex-wrap: ${wrapReverse ? "wrap-reverse" : $wrap && "wrap"};
        `}
        
    /* Gap */
    ${({ gap }) =>
        gap &&
        css`
            gap: ${parseUnit({ unit: gap, defaultUnit: "1rem" })};
        `}
    

    /* Align items */
    ${({
            alignItemsInitial,
            alignItemsStart,
            alignItemsCenter,
            alignItemsEnd,
            alignItemsStretch,
        }) =>
        (alignItemsInitial ||
            alignItemsStart ||
            alignItemsCenter ||
            alignItemsEnd ||
            alignItemsStretch) &&
        css`
            align-items: ${alignItemsInitial
                ? "initial"
                : alignItemsCenter
                    ? "center"
                    : alignItemsStart
                        ? "start"
                        : alignItemsEnd
                            ? "end"
                            : alignItemsStretch && "stretch"
            };
        `}

    // Full size
    ${({ fullHeight }) =>
        fullHeight &&
        css`
            height: 100%;
        `}
    ${({ fullWidth }) =>
        fullWidth &&
        css`
            width: 100%;
        `}
    ${({ flexGrow }) =>
        flexGrow &&
        css`
            flex-grow: ${flexGrow};
        `}

    // flex item
    ${({ flex }) =>
        flex &&
        css`
            flex: ${flex};
        `}


    // justify
    ${({ justifyCenter, spaceBetween, flexEnd }) =>
        (justifyCenter || spaceBetween || flexEnd) &&
        css`
            justify-content: ${justifyCenter
                ? "center"
                : spaceBetween
                    ? "space-between"
                    : flexEnd && "flex-end"
            };
        `}
        
    ${({ spaceAround }) =>
        spaceAround &&
        css`
            justify-content: space-around;
        `}
        

    // padding
    ${({ padding }) =>
        padding &&
        css`
            padding: ${Array.isArray(padding)
                ? padding
                    .map((p) => parseUnit({ unit: p, defaultUnit: "1rem" }))
                    .join(" ")
                : parseUnit({ unit: padding, defaultUnit: "1rem" })
            };
        `}

    // margin
    ${({ margin }) =>
        margin &&
        css`
            margin: ${Array.isArray(margin)
                ? margin
                    .map((m) => parseUnit({ unit: m, defaultUnit: "1rem" }))
                    .join(" ")
                : parseUnit({ unit: margin, defaultUnit: "1rem" })
            };
        `}
    
    // zero min
        
    ${({ zeroMinHeight }) =>
        zeroMinHeight &&
        css`
            min-height: 0;
        `}
    ${({ zeroMinWidth }) =>
        zeroMinWidth &&
        css`
            min-width: 0;
        `}
`