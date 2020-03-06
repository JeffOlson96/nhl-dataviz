import React, { Component } from 'react';
import * as d3 from 'd3';


class PieChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			send: null,
			clicked: null
		};

		this.drawChart = this.drawChart.bind(this);
	}

	componentDidMount() {
		this.setState((props) => ({data: this.props.data}));
		this.drawChart(this.props.data);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			this.setState((props) => ({data: this.props.data}));
			d3.selectAll(".pie").remove();
			this.drawChart(this.props.data);	
		}
	}

	componentWillUnmount() {
		d3.selectAll(".pie").remove();
	}

	drawChart(data) {
		var scope = this;
		console.log("pie: ", this.state);
		var radius = 200;

		var color = d3.scaleOrdinal().domain(data).range(d3.schemeSet3);

		var arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 100);

		var pie = d3.pie()
							.sort(null)
							.value(function(d) {
								//console.log(d);
								if (d.value) {
									return d.value;
								}
								else if (d.Goals) {
									return d.Goals;
								}
							});

		const svg = d3.select("#pie")
									.append("svg")
									.attr("class", "pie")
									.attr("width", 600)
									.attr("height", 500)
									.append("g")
									.attr("transform", "translate(300,240)");

		svg.append("text")
			  .style("text-anchor", "middle")
			  .text("BACK")
			  .on("click", function(d) {
			  	if (scope.state.clicked) {
			  		d3.select("svg").remove();
			  		scope.props.onBackClick(scope.state.clicked.data.parent);
			  	//scope.drawChart(scope.props.data);
			  	}
			  });

		var g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) {
				//console.log(d);
				if (d.data.key) {
					return color(d.data.key);
				}
				else if (d.data.Name) {
					return color(d.data.Name);
				}
			})
			.on("click", function(d) {
				//console.log(d);
				scope.props.onChangeValue(d);
				scope.setState({clicked: d});
				if (d.data.roster) {
					d3.selectAll(".pie").remove();
					scope.drawChart(d.data.roster);
				}
			})
			.on("mouseover", function(d) {
				d3.select(this).style("opacity", 0.5);
				g.append("text")
					.attr("class", "val")
					.attr("transform", function() {
						let coord = arc.centroid(d);
						coord[0] *= 0.9;
						coord[1] *= 0.9;
						return "translate("+ coord + ")";
					})
					.text(function() {
						if (d.data.value) {
							return Math.ceil(d.data.value) + " Goals";
						}
						else if (d.data.Goals) {
							return Math.ceil(d.data.Goals) + " Goals";
						}
					})
					.attr("font-size", "8px")
					.style("text-anchor", "middle")
					.style("font-weight", "lighter");
			})
			.on("mouseout", function(d) {
				d3.select(this).style("opacity", 1);
				d3.selectAll('.val').remove();
			});

		g.append("text")
			.attr("transform", function(d, i) {
				let coord = arc.centroid(d);
				coord[0] *= 1.4;
				coord[1] *= 1.4;
				return "translate(" + coord + ")";
			})
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				//console.log(d)
				if (d.data.key) {
					return d.data.key;
				}
				else if (d.data.Name) {
					if (d.data.Goals >= 7) {
						return d.data.Name;
					}
				}
			})
			.attr("font-size", "8px");			
	}
	

	render() {
		return(<div/>);
	}
}

export default PieChart;
