import React, {Component} from 'react';
import "./RosterComponent.css";
import Table from "react-bootstrap/Table";
import Hello from "./exportFunction.js";




class RosterComp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			team: null,
			user: null,
			mounted: false
		};

		this.handleClick = this.handleClick.bind(this);	
	}
	componentDidMount(prevProps) {
		var teams = this.props.data;
		var teamFound;
		//console.log(teams);
		console.log(this.props.userdata);
		teams.forEach((t) => {			
			if (t.key === this.props.userdata.UserTeam) {
				teamFound = t;
			}
		});
		
		teamFound.roster.sort((a,b) => {
			return b.Points - a.Points;
		});
		
		this.setState({team: teamFound, user: this.props.userdata, mounted: true});
		
	}

	handleClick = (e) => {
		console.log(e.target);
		Hello(e.target);
	};

	render() {
		//console.log(this.state.user, this.state.team, this.state.mounted);
		return(
			<div className="col-2">
				{this.state.mounted ?
					<div id="inner_container">
						<h3>{this.state.team.key}</h3>
						<Table striped bordered hover size="sm" variant="dark" onClick={this.handleClick}>
							<thead>
								<tr>								
									<th>Name</th>
									<th>GP</th>
									<th>G</th>
									<th>A</th>
									<th>P</th>
									<th>Position</th>
								</tr>
							</thead>
							<tbody>
							{
								this.state.team.roster.map((player) => {
									return(
										<tr key={"col-" + player.Name + "-row"}>										
											<td>{player.Name}</td>
											<td>{player.GP}</td>
											<td>{player.Goals}</td>
											<td>{player.Assists}</td>
											<td>{player.Points}</td>
											<td>{player.Position}</td>
										</tr>
									);
								})
							}
							</tbody>
						</Table>
					</div>
					: "Loading..."
				}
			</div>
		);
	}
}

export default RosterComp;