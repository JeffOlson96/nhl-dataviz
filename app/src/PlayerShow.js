import React, { Component } from 'react';
import * as d3 from 'd3';
import Table from 'react-bootstrap/Table';
import "./PlayerShow.css";



class PlayerShow extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: null
		};


	}

	componentDidMount() {
		console.log(this.props.data);
		this.setState({data: this.props.data});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			this.setState((props) => ({data: this.props.data}));
		}
	}

	render() {
		//console.log(this.state.data);
		return(
			<div>
				{this.state.data ?
					<div id="player"> 
						<h3>{this.state.data.data.Name}</h3>
						<h5>{this.state.data.data.Position}</h5>
						<Table striped bordered hover size="sm">
							<thead>
								<tr>
									<th>GP</th>
									<th>Goals</th>
									<th>Assists</th>
									<th>Points</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>{this.state.data.data.GP}</th>
									<th>{this.state.data.data.Goals}</th>
									<th>{this.state.data.data.Assists}</th>
									<th>{this.state.data.data.Points}</th>
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



export default PlayerShow;