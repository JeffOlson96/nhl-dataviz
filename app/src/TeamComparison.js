import React, { Component } from "react";
import * as d3 from "d3";
import Table from "react-bootstrap/Table";
import "./TeamComp.css";


class TeamComp extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			send: {
				"Atlantic": [],
				"Metropolitan": [],
				"Central": [],
				"Pacific": []
			}
		};

		this.formatData = this.formatData.bind(this);
		this.handleTableClick = this.handleTableClick.bind(this);
	}

	

	componentDidMount() {
		this.setState((props) => ({data: this.props.data}));
		this.formatData(this.props.data);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			this.setState((props) => ({data: this.props.data}));
			d3.selectAll(".team").remove();
			this.formatData(this.props.data);
		}
	}

	formatData(data) {
		
		var tmpData = data;
		var tmpSend = this.state.send;
		tmpData.sort((a,b) => {
			return b.Points - a.Points;
		});
		console.log("team: ", tmpData);
		/*
		tmpData.forEach((val, idx) => {
			if (val.Division === "Atlantic") {
				tmpSend.Atlantic.push(val);
			}
			else if (val.Division === "Metropolitan") {
				tmpSend.Metropolitan.push(val);
			}
			else if (val.Division === "Central") {
				tmpSend.Central.push(val);
			}
			else if (val.Division === "Pacific") {
				tmpSend.Pacific.push(val);
			}
		});
		*/
		//console.log(tmpSend);
		this.setState({send: tmpData});

	}

	handleTableClick = (e) => {
		e.preventDefault();
		console.log(e.target.innerHTML);

	};
	/*
	{this.state.send.Atlantic.map((team) => {
										return (
											<tr key={team.Teamname} onClick={this.handleTableClick}>
												<td>{team.Division}</td>
												<td>{team.Teamname}</td>
												<td>{team.Wins}</td>
												<td>{team.Losses}</td>
												<td>{team.Points}</td>
											</tr>
										);
									})
								}
								{this.state.send.Metropolitan.map((team) => {
										return (
											<tr key={team.Teamname}>
												<td>{team.Division}</td>
												<td>{team.Teamname}</td>
												<td>{team.Wins}</td>
												<td>{team.Losses}</td>
												<td>{team.Points}</td>
											</tr>
										);
									})
								}
								{this.state.send.Central.map((team) => {
										return (
											<tr key={team.Teamname}>
												<td>{team.Division}</td>
												<td>{team.Teamname}</td>
												<td>{team.Wins}</td>
												<td>{team.Losses}</td>
												<td>{team.Points}</td>
											</tr>
										);
									})
								}
								{this.state.send.Pacific.map((team) => {
										return (
											<tr key={team.Teamname}>
												<td>{team.Division}</td>
												<td>{team.Teamname}</td>
												<td>{team.Wins}</td>
												<td>{team.Losses}</td>
												<td>{team.Points}</td>
											</tr>
										);
									})
								}

	*/

	render() {
		return(
			<div id="TeamComp" className="col-6">				
					{this.state.data ?
						<Table striped bordered hover variant="dark" size="sm" width="25%">
							<thead>
								<tr>
									<th>Division</th>
									<th>Teamname</th>
									<th>Wins</th>
									<th>Losses</th>
									<th>Points</th>
									<th>Average Goals</th>
								</tr>
							</thead>
							<tbody>
								{this.state.data.map((team) => {
										return (
											<tr key={team.team_info.Teamname}>
												<td>{team.team_info.Division}</td>
												<td>{team.team_info.Teamname}</td>
												<td>{team.team_info.Wins}</td>
												<td>{team.team_info.Losses}</td>
												<td>{team.team_info.Points}</td>
												<td>{team.AvgGoals}</td>
											</tr>
										);
									})
								}
							</tbody>
						</Table>
						: null
					}				
			</div>

		);
	}

};



export default TeamComp;