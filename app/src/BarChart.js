import React, { Component } from 'react';
import * as d3 from 'd3';
//import Table from "react-bootstrap/Table";
import RenderTable from "./RenderTableComp.js";
import "./BarChart.css";


class BarChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			send: null,
			clicked: null,
			display: null,
      averageLeagueGoals: 0
		};

		this.drawChart = this.drawChart.bind(this);
		//this.onButtonClick = this.onButtonClick.bind(this);
    this.findAverage = this.findAverage.bind(this);
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
		//console.log("BarChart: ", data);
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
    
    //console.log(dataMax, ":", dataMin);
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


    /*
    svg.append("g")
       .attr("transform", "translate(0," + 550 + ")")
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll('.bars')
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(d) { return x(d); })
       .attr("width", x.bandwidth())
       .attr("fill", "#69b3a2")
       .attr("height", function(d) { return 550 - y(0); })
       .attr("y", function(d) { return y(0); });


    svg.selectAll("rect")
       .transition()
       .duration(800)
       .attr("y", function(d) {return y(d); })
       .attr("height", function(d) { return 550 - y(d); })
       .delay(function(d,i) { return(i*100); });

    */

    
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
          if (d.roster) {        
  					var sendDisplay = findTopPlayers(d);
  					//var sendDisplay = [goalPlayer, assistPlayer, pointsPlayer];
  					console.log(sendDisplay);
  					scope.setState({display: sendDisplay});
            scope.props.onChangeValue(sendDisplay);
          }
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
        		return "translate( " + (((i * 15) + 9) + margin) + "," + (570) + ")rotate(-90)";
        	}
        	else if (d.Name) {
        		return "translate( " + (((i * 15) + 9) + margin) + "," + (620) + ")rotate(-90)";
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
    scope.findAverage(data);
	}

  findAverage(arr) {
    //console.log("arr: ", arr);
    var total = 0;
    var avg;
    if (arr.length) {
      arr.forEach((val) => {
        if (val.value) {
          total += val.value
        }
        else if (val.Goals) {
          total += val.Goals
        }
      });
      avg = total / arr.length;
    }
    this.setState({averageLeagueGoals: avg});
  }

	

	render() {
		//console.log(this.state.display);
		return(
			<div id="div-avg-goals">
        <p>Average Goals</p>
				<p>{this.state.averageLeagueGoals}</p>
			</div>
		);
	}
}

export default BarChart;