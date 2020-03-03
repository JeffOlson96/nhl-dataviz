import React, { Component } from 'react';
import * as d3 from 'd3';
import Table from "react-bootstrap/Table";


class BarChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			send: null,
			clicked: null,
			display: null
		};

		this.drawChart = this.drawChart.bind(this);
		this.onButtonClick = this.onButtonClick.bind(this);
	}

	componentDidMount() {
		this.setState((props) => ({data: this.props.data}));
		this.drawChart(this.props.data);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			this.setState((props) => ({data: this.props.data}));
			d3.selectAll(".bar").remove();
			this.drawChart(this.props.data);	
		}
	}

	componentWillUnmount() {
		d3.selectAll(".bar").remove();
	}

	drawChart(data) {
		console.log("BarChart: ", data);
    var multiplyFactor = 1.0;

    var dataMax, dataMin;

    function findTopPlayers(team) {
    	var maxAssist = 0, maxGoals = 0, maxPoints = 0;
    	var playerGoals, playerAssists, playerPoints;
    	console.log(team.roster);
    	
    	if (team.roster) {
	    	team.roster.forEach((val, idx) => {
	    		if (val.Goals > maxGoals) {
	    			maxGoals = val.Goals;
	    			playerGoals = val;
	    		}

	    		if (val.Assists > maxAssist) {
	    			maxAssist = val.Assists;
	    			playerAssists = val;
	    		}

	    		if (val.Points > maxPoints) {
	    			maxPoints = val.Points;
	    			playerPoints = val;
	    		}
	    	});
	    }

    	//console.log(playerGoals, playerAssists, playerPoints);
    	return {G: playerGoals, A: playerAssists, P: playerPoints};
    }

    function getVals() {    	
      return data.map(d => {
      	if (d.Goals) {
      		return d.Goals;
      	}
      	else if (d.value) {
      		return d.value;
      	}
      })
    }
    function getMin() {
      return Math.min(...getVals());
    }
    function getMax() {
      return Math.max(...getVals());
    }

    dataMax = getMax();
    dataMin = getMin();
    
    console.log(dataMax, ":", dataMin);
    let diff = dataMax - dataMin;
    if (diff > 2000) {
      multiplyFactor = 0.1;
    }
    else if (2000 > diff >= 100) {
      multiplyFactor = 2.0;
    }
    else if (diff <= 100) {
      multiplyFactor = 3.0;
    }

    
    var scope = this;
    var margin = 50;
    
    //console.log(info);
    //const info = [12, 5, 6, 8, 3];
    const svg = d3.select("#bar")
                  .append("svg")
                  .attr("class", "bar")
                  .attr("width", 800)
                  .attr("height", 800);
                  
    
    // using scale band for bars
    var x = d3.scaleBand()
            .range([0, 1500])
            .domain(data.map(function(d) {
            	if (d.key) {
            		return d.key;
            	}
            	else if (d.Name) {
            		return d.Name;
            	}            	
            }))
            .padding(0.2);
    
    
    // scale Ordinal is helpful for colors
    var color = d3.scaleOrdinal()
              .domain(data)
              .range(d3.schemeSet3);


    // y = mx + b
    var y = d3.scaleLinear()
              .range([0, 800]);

    y.domain(data.map(function(d) { 
    	if (d.key) {
    		return d.key;
    	}
    	else if (d.Name) {
    		return d.Name;
    	} 
    }));

    
    var bars = svg.selectAll('.bars')
        .data(data)
        .enter()
        .append("g");


    bars.append("rect")
        .attr("class", "bars")
        .attr("x", (d, i) => (i * 15) + margin)
        .attr("y", (d, i) => {
        	//console.log("d: ", d);
        	if (d.value) {
          	return (550 - (d.value * multiplyFactor));
          }
          else if (d.Goals) {
          	return (550 - (d.Goals * (multiplyFactor * 2)));
          }        		
      	}) // 300 is height, can be made more dynamic with variables, state to hold info
        .attr("width", 10)
        .attr("height", (d, i) => {
          if (d.value) {
          	return d.value * multiplyFactor;
          }
          else if (d.Goals) {
          	return d.Goals * (multiplyFactor * 2);
          }
        })
        .attr("fill", function(d) {
          //console.log(d);
          d.parent = data;
          if (d.key) {
		    		return color(d.key);
		    	}
		    	else if (d.Name) {
		    		return color(d.Name);
		    	}
        })
        .on("mouseover", function(d) {
          d3.select(this)
            .style("opacity", 0.5);
        })
        .on("mouseout", function(d) {
          d3.select(this)
              .style("opacity", 1.0);
          d3.select(this).style("fill", function(d) {
              if (d.key) {
				    		return color(d.key);
				    	}
				    	else if (d.Name) {
				    		return color(d.Name);
				    	}
            });
        })
        .on("click", function(d) {          
					var sendDisplay = findTopPlayers(d);
					//var sendDisplay = [goalPlayer, assistPlayer, pointsPlayer];
					console.log(sendDisplay);
					scope.setState({display: sendDisplay});
        });


    bars.append("text")
        .attr("class", "label")
        .text((d) => {
          if (d.key) {
		    		return d.key;
		    	}
		    	else if (d.Name) {
		    		return d.Name;
		    	}
        })
        .attr("font-size", "8px")
        .attr("transform", (d,i) => { 
        	if (d.key) {
        		return "translate( " + (((i * 15) + 9) + margin) + "," + (/*(d.key.length * 5) + */ 570) + ")rotate(-90)";
        	}
        	else if (d.Name) {
        		return "translate( " + (((i * 15) + 9) + margin) + "," + (/*(d.Name.length * 5) + */ 650) + ")rotate(-90)";
        	}
        });
    
    bars
        .append("text")
        .attr("class", "value")
        .text((d) => {          
          if (d.value) {
          	return Math.ceil(d.value);
          }
          else if (d.Goals) {
          	return Math.ceil(d.Goals);
          }
        })
        .attr("x", (d,i) => ((i * 15) - 0) + margin)
        .attr("y", (d,i) => {        		 
	        	if (d.value) {
	          	return (550 - (d.value * multiplyFactor));
	          }
	          else if (d.Goals) {
	          	return (550 - (d.Goals * (multiplyFactor * 2)));
	          }	
        })
        .attr("font-size", "8px");

    //svg.append("g").call(d3.axisLeft(y)).attr("font-size", "7px");
    svg.attr("transform", "translate(550, -750)");    
	}

	onButtonClick = (e) => {
		this.setState({display: null});
	}

	render() {
		//console.log(this.state.display);
		return(
			<div>
				{this.state.display ?
					<div id="player">
						<button type="button" onClick={this.onButtonClick}>X</button>						
						<h5>Top Players on the Team</h5>
						<Table striped bordered hover size="sm">
							<thead>
								<tr>
									<th>Goals</th>
									<th>Assists</th>
									<th>Points</th>
								</tr>
							</thead>
							<tbody>
								<tr>									
									<td>{this.state.display.G.Name}</td>
									<td>{this.state.display.A.Name}</td>
									<td>{this.state.display.P.Name}</td>
								</tr>
								<tr>									
									<td>{this.state.display.G.Goals}</td>
									<td>{this.state.display.A.Assists}</td>
									<td>{this.state.display.P.Points}</td>
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

export default BarChart;