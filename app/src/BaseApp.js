import React, { Component } from 'react';
import PieChart from "./PieChart.js";
import './BaseApp.css';
import * as d3 from 'd3';
import BarChart from "./BarChart.js";
import PlayerShow from "./PlayerShow.js";

let lastScrollY = 0;
let ticking = 0;


class BaseApp extends Component {

  constructor() {
    super();

    this.state = {
      data: null,
      send: [],
      save: null,
      popup: null,
      show: false,
      style: null,
      transform: null,
      teams: null,
      sentItems: []
    };

    this.handleDataChange = this.handleDataChange.bind(this);
    this.formatData = this.formatData.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  

  componentDidMount() {
    // When component mounts, use fetch to get data
    // this causes a cors error cause the origins are the same
    // http://s-wdbaintern01:5000/
    // http://localhost:5000
    // two fetches for different routes set up in server

    fetch("http://s-wdbaintern01:5000/players")
      .then(res => { 
        return res.json();
      })
      .then(res => {
        //
        this.setState({data: res.recordset});
        this.formatData();
      });

    fetch("http://s-wdbaintern01:5000/teams")
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({teams: res})
      });

    //window.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    //window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {

  }



  // this is an attempt to do some cool scrolling stuff
  nav = React.createRef();

  handleScroll = (e) => {
    /*
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        this.nav.current.style.top = `${lastScrollY}px`;
        ticking = false;
      });

      ticking = true;
    }
    */
    var style = {
      transform: null
    };
    console.log(e);
    let scrollTop = e.srcElement.body.scrollTop,
        itemTranslate = Math.min(0, scrollTop/3 - 60);

    this.setState({
      transform: itemTranslate
    });
  };
  

  // data preprocessing
  formatData() {
    var scope = this;
    function getTeamName(d) {
      if (d.Team.length === 3) {
        return d.Team;
      }
      else if (d.Team.length !== 3) {
        return d.Team.substr(d.Team.length-3, d.Team.length);
      }
    }

    var obj = {};
    var totPlayers = [];
    //console.log(this.state.data);
    var tmpData = this.state.data;
    var tmpSend;
    
       

    tmpSend = d3.nest()
          .key(function(d) {
            return getTeamName(d);
          })
          .rollup(function(d) {
            //console.log("roll: ", d);
            return d3.sum(d, function(v) {
              //console.log(v);
              totPlayers.push(v);
              return v.Goals;
            })
          })
          .entries(tmpData);

    tmpSend.forEach((d, i) => {
      d.roster = [];
      totPlayers.forEach((p, j) => {
        var baseName = getTeamName(p);
        if (baseName === d.key) {
          d.roster.push(p);
        }

        p.key = p["H-Ref Name"];
      })
    })
    this.setState({send: tmpSend, save: tmpSend});
  }

  // callback function for change in data to propogate to sub Components
  handleDataChange = (e) => {
    console.log("Changing: ", e);    
    if (e.data.roster) {
      this.setState({send: e.data.roster});
    }
    else if (e.data.Name) {
      this.setState({show: true, popup: e});
    }
  };

  handleBack = (e) => {
    this.setState({send: this.state.save, show: false});
  };




  // handle submit for user login, post request to insert into sql database
  handleSubmit = (e) => {
    e.preventDefault();
    var scope = this;    
    fetch('http://s-wdbaintern01:5000/sql/user', {
      method: 'POST',
      body: JSON.stringify({
        team: scope.refs.team.value,
        password: scope.refs.password.value,
        email: scope.refs.email.value
      }),
      headers: {"Content-Type": "application/json"}
    })
    .then(res => {
      return res.json()
    })
    .then(body => {
      console.log(body);
    });
  }

  render() {
    //console.log(this.state.data);
    /*
    if (this.state.data) {
      this.formatData();
    }
    */// 3 components that are conditionally rendered
      // submit for practicing post
    return(
      <div id="highContainer" transform={this.state.transform}>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="team" ref="team"/>
          <input type="email" placeholder="email" ref="email"/>
          <input type="password" placeholder="password" ref="password"/>
          <input type="submit" />
        </form>      
        <div id="baseContainer">
          <h3>NHL Player Data 17-18</h3>
          <div id="playerInfo">
            {this.state.show ?
              <PlayerShow
                data={this.state.popup}
              />
              : null
            }
          </div>
          <div id="pie">
            <h5>Number of Goals</h5>
            {this.state.send ?
              <PieChart
                data={this.state.send}
                onChangeValue={this.handleDataChange}
                onBackClick={this.handleBack}
              />
              : null
            }
          </div>
          <div id="bar" width="50" height="50">
            {this.state.send ?
              <BarChart
                data={this.state.send}
                onChangeValue={this.handleDataChange}
                onBackClick={this.handleBack}
              />
              : null
            }
          </div> 
        </div>        
      </div>
    )
  }
}


export default BaseApp;
