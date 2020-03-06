import React, { Component } from 'react';
import * as d3 from 'd3';
import Table from "react-bootstrap/Table";



class LeagueLeadersComp extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			players: null,
			mounted: false
		};

		this.findPlayers = this.findPlayers.bind(this);
	}

	componentDidMount() {
		this.setState((props) => ({data: this.props.data, mounted: true}));
		//this.findPlayers(this.props.data);
	}

	findPlayers(data) {
		var maxGoals, maxAssists, maxPoints;
		var countGoals = 0, countAssist = 0, countPoints = 0;
		console.log(data);
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

		return {G: maxGoals, A: maxAssists, P: maxPoints};
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
									<th>Top Goals</th>
									<th>Top Assists</th>
									<th>Top Points</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{TopPlayers.G.Name}</td>
									<td>{TopPlayers.A.Name}</td>
									<td>{TopPlayers.P.Name}</td>
								</tr>
								<tr>
									<td>{TopPlayers.G.Goals}</td>
									<td>{TopPlayers.A.Assists}</td>
									<td>{TopPlayers.P.Points}</td>
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