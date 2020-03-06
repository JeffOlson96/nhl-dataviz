import React, { Component } from 'react';
import "./HeaderComp.css";


export default class Header extends Component {
	constructor() {
		super();
	}

	componentDidMount() {

	}

	render() {
		return(
			<div id="Header">
				<h1>NHL Data App</h1>
				<p>created by Jeff Olson</p>
			</div>
		);
	}
};

