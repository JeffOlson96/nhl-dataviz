import React, { Component } from 'react';
import Table from "react-bootstrap/Table";


class RenderTableComp extends Component {
	constructor() {
		super();
		this.state = {
			data: null
		};
	}

	componentDidMount() {
		this.setState((props) => ({data: this.props.data}));
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			this.setState((props) => ({data: this.props.data}));
			//d3.selectAll(".bar").remove();
			//this.drawChart(this.props.data);	
		}
	}

	onButtonClick = (e) => {
		this.setState({data: null});
	}



	render() {
		return(
			<div>
				{this.state.data ?
					<div id="player-render-table" className="col-4">
						<button type="button" onClick={this.onButtonClick}>X</button>						
						<h5>Top Players on the Team</h5>
						<Table striped bordered hover size="sm" variant="dark">
							<thead>
								<tr>
									<th>Goals</th>
									<th>Assists</th>
									<th>Points</th>
								</tr>
							</thead>
							<tbody>
								<tr>									
									<td>{this.state.data.G.Name}</td>
									<td>{this.state.data.A.Name}</td>
									<td>{this.state.data.P.Name}</td>
								</tr>
								<tr>									
									<td>{this.state.data.G.Goals}</td>
									<td>{this.state.data.A.Assists}</td>
									<td>{this.state.data.P.Points}</td>
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


export default RenderTableComp;