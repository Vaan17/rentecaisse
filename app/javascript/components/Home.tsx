import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Flex } from "./style/flex";
import useEmprunts from "../hook/useEmprunts";
import useUser from "../hook/useUser";
import dayjs from "dayjs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const StyledCard = styled(Card)`
    width: 100%;
    background: #f8f9fa !important;
`;
const StyledCardContent = styled(CardContent)`
    padding: .5em !important;
`;

const Home = () => {
	const emprunts = useEmprunts();
	const user = useUser();

	const myOrderedEmprunts = Object.values(emprunts)
		.filter(emprunt => emprunt.utilisateur_demande_id === user.id)
		.sort((a, b) => dayjs(a.date_debut).diff(dayjs(b.date_debut)))

	// Prepare data for pie chart - group emprunts by statut_emprunt
	const pieChartData = Object.values(myOrderedEmprunts).reduce((acc, emprunt) => {
		const status = emprunt.statut_emprunt;
		const existingStatus = acc.find(item => item.name === status);

		if (existingStatus) {
			existingStatus.value += 1;
		} else {
			acc.push({ name: status, value: 1 });
		}

		return acc;
	}, [] as Array<{ name: string; value: number }>);

	// Colors for different statuses
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

	// Prepare data for line chart - group emprunts by month of date_debut
	const monthlyData = Object.values(myOrderedEmprunts).reduce((acc, emprunt) => {
		const monthKey = dayjs(emprunt.date_debut).format('YYYY-MM');
		const monthLabel = dayjs(emprunt.date_debut).locale('fr').format('MMMM YYYY');

		const existingMonth = acc.find(item => item.month === monthKey);

		if (existingMonth) {
			existingMonth.nb_emprunts += 1;
		} else {
			acc.push({ month: monthKey, monthLabel, nb_emprunts: 1 });
		}

		return acc;
	}, [] as Array<{ month: string; monthLabel: string; nb_emprunts: number }>);

	// Sort by month chronologically
	monthlyData.sort((a, b) => a.month.localeCompare(b.month));

	return (
		<Flex fullWidth directionColumn alignItemsStart gap="2em">
			<Typography variant={isMobile ? "body1" : "h4"} component="h1" gutterBottom>
				Bienvenue sur Rentecaisse
			</Typography>

			<Flex fullWidth directionColumn={isMobile} spaceBetween alignItemsStart gap="1em">
				<StyledCard>
					<StyledCardContent>
						<Flex fullWidth directionColumn alignItemsStart gap="1em">
							<Typography variant="h6" component="h2" gutterBottom>
								Mon taux d'emprunts par mois
							</Typography>
							{monthlyData.length > 0 ? (
								<div style={{ width: '100%', height: '300px' }}>
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={monthlyData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis
												dataKey="monthLabel"
												angle={-45}
												textAnchor="end"
												height={80}
												fontSize={12}
											/>
											<YAxis
												label={{ value: 'Nb d\'emprunts', angle: -90, position: 'insideLeft' }}
												fontSize={12}
											/>
											<Tooltip
												formatter={(value) => [`${value} emprunt(s)`]}
												labelFormatter={(label) => `Mois: ${label}`}
											/>
											<Line
												type="monotone"
												dataKey="nb_emprunts"
												stroke="#8884d8"
												strokeWidth={3}
												dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
												activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							) : (
								<Typography variant="body2" color="textSecondary">
									Aucun emprunt à afficher
								</Typography>
							)}
						</Flex>
					</StyledCardContent>
				</StyledCard>
				{/* datapie chart for myOrderedEmprunts displaying emprunts by status-emprunt */}
				<StyledCard>
					<StyledCardContent>
						<Flex fullWidth directionColumn alignItemsStart gap="1em">
							<Typography variant="h6" component="h2" gutterBottom>
								Répartition de mes emprunts par statut
							</Typography>
							{pieChartData.length > 0 ? (
								<div style={{ width: '100%', height: '300px' }}>
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={pieChartData}
												cx="50%"
												cy="50%"
												labelLine={false}
												label={({ name, percent }) => `${isMobile ? "" : name} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
											>
												{pieChartData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
												))}
											</Pie>
											<Tooltip
												formatter={(value, name) => [`${value} emprunt(s)`, name]}
												labelStyle={{ color: '#333' }}
											/>
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
							) : (
								<Typography variant="body2" color="textSecondary">
									Aucun emprunt à afficher
								</Typography>
							)}
						</Flex>
					</StyledCardContent>
				</StyledCard>

			</Flex>
		</Flex>
	)
}

export default Home;
