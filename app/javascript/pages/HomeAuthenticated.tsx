import * as React from "react";
import styled from "styled-components";
import MainMenu from "../components/MainMenu";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Container = styled.div`
  padding: 24px;
  margin-left: 0px;
  margin-top: 10px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 16px;
  color:rgb(7, 7, 7);
`;

const Text = styled.p`
  color: #666;
  line-height: 1.5;
`;

export const HomeAuthenticated = (): JSX.Element => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

	return (
		<Container>
			<MainMenu />
		</Container>
	);
};

export default HomeAuthenticated;
