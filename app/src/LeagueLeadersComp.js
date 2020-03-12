import React, { Component } from 'react';
import * as d3 from 'd3';
import Table from "react-bootstrap/Table";



class LeagueLeadersComp extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			players: null,
			mounted: false,
			allPlayers: null
		};

		this.findPlayers = this.findPlayers.bind(this);
	}

	componentDidMount() {
		this.setState((props) => ({data: this.props.data, mounted: true, allPlayers: this.props.players}));
		//this.findPlayers(this.props.data);
	}

	findPlayers(data) {
		var maxGoals, maxAssists, maxPoints;
		var countGoals = 0, countAssist = 0, countPoints = 0;
		//console.log(data);
		var tmpData = data;
		data.forEach((val) => {
			val.roster.forEach((player) => {
				if (player.Goals > countGoals) {
					countGoals = player.Goals;
					maxGoals = player;
				}

				if (player.Assists > countAssist) {
					countAssist = player.Assists;
					maxAssists = player;
				}

				if (player.Points > countPoints) {
					countPoints = player.Points;
					maxPoints = player;
				}
			});
		});

		var topGoals, topAssists, topPoints;
		
		//console.log(this.state.allPlayers);
		
		var tmpPlayers = this.state.allPlayers;

		topGoals = tmpPlayers.sort((a,b) => {
			return b.Goals - a.Goals;
		}).slice(0,10);

		topAssists = tmpPlayers.sort((a,b) => {
			return b.Assists - a.Assists;
		}).slice(0,10);

		topPoints = tmpPlayers.sort((a,b) => {
			return b.Points - a.Points;
		}).slice(0,10);


		//console.log(topGoals, topAssists, topPoints);




		return {G: topGoals, A: topAssists, P: topPoints};
	}

	render() {
		
		if (this.state.mounted) {
			var TopPlayers = this.findPlayers(this.state.data);
			console.log(TopPlayers);
		}
		return(
			<div>
				{this.state.mounted ?
					<div className="col-3">
						<h4>League Leaders</h4>
						<Table striped bordered hover variant="dark" size="sm" width="25%">
							<thead>
								<tr>									
									<th colSpan="2">Top Goals</th>
									<th colSpan="2">Top Assists</th>
									<th colSpan="2">Top Points</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{TopPlayers.G[0].Name}</td>
									<td>{TopPlayers.G[0].Goals}</td>
									<td>{TopPlayers.A[0].Name}</td>
									<td>{TopPlayers.A[0].Assists}</td>
									<td>{TopPlayers.P[0].Name}</td>
									<td>{TopPlayers.P[0].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[1].Name}</td>
									<td>{TopPlayers.G[1].Goals}</td>
									<td>{TopPlayers.A[1].Name}</td>
									<td>{TopPlayers.A[1].Assists}</td>
									<td>{TopPlayers.P[1].Name}</td>
									<td>{TopPlayers.P[1].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[2].Name}</td>
									<td>{TopPlayers.G[2].Goals}</td>
									<td>{TopPlayers.A[2].Name}</td>
									<td>{TopPlayers.A[2].Assists}</td>
									<td>{TopPlayers.P[2].Name}</td>
									<td>{TopPlayers.P[2].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[3].Name}</td>
									<td>{TopPlayers.G[3].Goals}</td>
									<td>{TopPlayers.A[3].Name}</td>
									<td>{TopPlayers.A[3].Assists}</td>
									<td>{TopPlayers.P[3].Name}</td>
									<td>{TopPlayers.P[3].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[4].Name}</td>
									<td>{TopPlayers.G[4].Goals}</td>
									<td>{TopPlayers.A[4].Name}</td>
									<td>{TopPlayers.A[4].Assists}</td>
									<td>{TopPlayers.P[4].Name}</td>
									<td>{TopPlayers.P[4].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[5].Name}</td>
									<td>{TopPlayers.G[5].Goals}</td>
									<td>{TopPlayers.A[5].Name}</td>
									<td>{TopPlayers.A[5].Assists}</td>
									<td>{TopPlayers.P[5].Name}</td>
									<td>{TopPlayers.P[5].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[6].Name}</td>
									<td>{TopPlayers.G[6].Goals}</td>
									<td>{TopPlayers.A[6].Name}</td>
									<td>{TopPlayers.A[6].Assists}</td>
									<td>{TopPlayers.P[6].Name}</td>
									<td>{TopPlayers.P[6].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[7].Name}</td>
									<td>{TopPlayers.G[7].Goals}</td>
									<td>{TopPlayers.A[7].Name}</td>
									<td>{TopPlayers.A[7].Assists}</td>
									<td>{TopPlayers.P[7].Name}</td>
									<td>{TopPlayers.P[7].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[8].Name}</td>
									<td>{TopPlayers.G[8].Goals}</td>
									<td>{TopPlayers.A[8].Name}</td>
									<td>{TopPlayers.A[8].Assists}</td>
									<td>{TopPlayers.P[8].Name}</td>
									<td>{TopPlayers.P[8].Points}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G[9].Name}</td>
									<td>{TopPlayers.G[9].Goals}</td>
									<td>{TopPlayers.A[9].Name}</td>
									<td>{TopPlayers.A[9].Assists}</td>
									<td>{TopPlayers.P[9].Name}</td>
									<td>{TopPlayers.P[9].Points}</td>
								</tr>								
							</tbody>
						</Table>
					</div>
					: null
				}
			</div>

		);
	}
}


export default LeagueLeadersComp;