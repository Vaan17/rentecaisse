import React from "react"
import styled from "styled-components"

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const ColorPane = styled.div`
    padding: 1rem;
`

const ColorsPage = () => {
    const availableColors = ["primary", "secondary", "red", "yellow", "green", "blue", "orange", "purple"]
    const lightnessVariations = ["", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

    return (
        <Container>
            {availableColors.map((color) => {
                return lightnessVariations.map((lightness_intensity) => {
                    return <ColorPane key={color + lightness_intensity} style={{ backgroundColor: `var(--${color + lightness_intensity})` }}>
                        {`--${color + lightness_intensity}`}
                    </ColorPane>
                })
            })}
        </Container>
    )
}

export default ColorsPage