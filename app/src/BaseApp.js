import React, { Component } from 'react';
import PieChart from "./PieChart.js";
import './BaseApp.css';
import * as d3 from 'd3';
import BarChart from "./BarChart.js";
import PlayerShow from "./PlayerShow.js";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TeamComp from "./TeamComparison.js";
import LeagueLeadersComp from "./LeagueLeadersComp.js";
import RenderTableComponent from "./RenderTableComp.js";

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
      sentItems: [],
      status: false,
      login: false,
      userData: "",
      barClick: null
    };

    this.handleDataChange = this.handleDataChange.bind(this);
    this.formatData = this.formatData.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatTeamData = this.formatTeamData.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
  }

  

  componentDidMount() {
    // When component mounts, use fetch to get data
    // this causes a cors error cause the origins are the same
    // http://s-wdbaintern01:5000/ <--- used because I was running on ISD server
    // http://localhost:5000/ <--- if server is running on same machine
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
        //console.log(res);
        this.setState({teams: res.recordset});
        this.formatTeamData()
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
  
  formatTeamData() {
    const scope = this;
    var tmpData = this.state.teams;
    //console.log(tmpData);

  }

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



  handleBarClick = (e) => {
    //e.preventDefault();
    var scope = this;
    console.log("bar click: ", e);
    this.setState({barClick: e});

  };


  // handle submit for user login, post request to insert into sql database
  handleSubmit = (e) => {
    e.preventDefault();
    var scope = this;    
    fetch('http://s-wdbaintern01:5000/sql/login', {
      method: 'POST',
      body: JSON.stringify({
        username: scope.refs.username.value,
        password: scope.refs.password.value,
        //email: scope.refs.email.value
      }),
      headers: {"Content-Type": "application/json"}
    })
    .then(res => {
      return res.json()
    })
    .then(body => {
      console.log(body);
      if (body.login) {
        this.setState({login: body.login, userData: body.userData});
      }
      else {
        this.setState({signup: true});
      }
    });
  };
  
  handleNewUser = (e) => {
    e.preventDefault();
    var scope = this;
    fetch('http://s-wdbaintern01:5000/sql/user', {
      method: 'POST',
      body: JSON.stringify({
          username: scope.refs.username.value,
          password: scope.refs.password.value,
          email: scope.refs.email.value,
          team: scope.refs.team.value,
          player: scope.refs.player.value
      }),
      headers: {"Content-Type": "application/json"}
    })
    .then(res => {
      return res.json()
    })
    .then(body => {
      console.log(body);
      this.setState({login: body.login});
    });
  }
  

  render() {    
    /// 3 components that are conditionally rendered
      // submit for practicing post
    return(
      <div id="highContainer" transform={this.state.transform}>      
        {this.state.login ?
          <div id="baseContainer">
            <h3>{"Hello " + this.state.userData[0].username + "!"}</h3>           
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
              <div id="bar">             
              {this.state.send ?                
                <BarChart
                  data={this.state.send}
                  onChangeValue={this.handleBarClick}
                  onBackClick={this.handleBack}
                />                
                : null
              }
            </div>
            <div id="top-players-league">
              {this.state.teams ?                
                <LeagueLeadersComp
                  data={this.state.send}
                  
                />                
                : null
              }
            </div>
            <div id="top-players-team">
              {this.state.barClick ?                
                <RenderTableComponent
                  data={this.state.barClick}
                  
                />                
                : null
              }
            </div>
          </div>
          : <div id="formLogin" textAnchor="center">
              {!this.state.signup ?
                <Form onSubmit={this.handleSubmit} size="sm">
                  <div className="col-3">
                    <Form.Group controlId="formBasicCheck">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" placeholder="username" ref="username" size="sm" width="50%"/>                  
                      <Form.Control type="password" placeholder="password" ref="password" size="sm" width="50%"/>
                      <input type="submit" />
                    </Form.Group>
                  </div>
                </Form>
                : <div id="signup" textAnchor="center">
                    <Form onSubmit={this.handleNewUser} size="sm">
                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" placeholder="Enter email" ref="email" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" placeholder="Password" ref="password"/>
                        </Form.Group>

                        <Form.Group controlId="formGridAddress1">
                          <Form.Label>username</Form.Label>
                          <Form.Control placeholder="username" ref="username"/>
                        </Form.Group>

                      </Form.Row>
                      
                      <Form.Group controlId="formGridAddress2">
                        <Form.Label>Team</Form.Label>
                        <Form.Control placeholder="Hartford Whalers" ref="team"/>
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridZip">
                          <Form.Label>Player</Form.Label>
                          <Form.Control placeholder="Wayne Gretzky" ref="player"/>
                        </Form.Group>

                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity">
                          <Form.Label>City</Form.Label>
                          <Form.Control ref="city"/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                          <Form.Label>State</Form.Label>
                          <Form.Control placeholder="State" ref="state">                            
                          </Form.Control>
                        </Form.Group>
                        
                      </Form.Row>

                      <Form.Group id="formGridCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                      </Form.Group>

                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </div>
              }
            </div>
        }       
      </div>
    )
  }
}


export default BaseApp;
