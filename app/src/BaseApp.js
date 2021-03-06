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
import RosterComp from "./RosterComponent.js";
import FindAvg from "./findAverage.js";



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
      userData: null,
      barClick: null,
      allPlayers: null
    };


    // better to keep separate ? or should I combine ?
    this.handleDataChange = this.handleDataChange.bind(this);
    this.formatData = this.formatData.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatTeamData = this.formatTeamData.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
    this.handleTableClick = this.handleTableClick.bind(this);
  }

  

  componentDidMount() {
    // When component mounts, use fetch to get data
    // this causes a cors error cause the origins are the same
    // http://s-wdbaintern01:5000/ <--- used because I was running on ISD server
    // http://localhost:5000/ <--- if server is running on same machine
    // two fetches for different routes set up in server


    // this is bad, we shouldn't be getting the data before the user is authenticated
    // have to move to componentDidUpdate() when the user is logged in, then call fetch to 
    // retrieve data
    
    fetch("http://s-wdbaintern01:5000/players")
      .then(res => { 
        return res.json();
      })
      .then(res => {
        //console.log(res.recordset)
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
    /*
    if (this.state.login === true) {
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
    }
    */   
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
    /*
    this.state.teams.forEach((team) => {
      //console.log(FindAvg(team));
      FindAvg(team);
      //team.AvgGoals = FindAvg(team);
      console.log(team);
    });
    */


    scope.state.send.forEach((val, idx) => {
      
      val.team_info = scope.state.teams[idx]
      val.AvgGoals = FindAvg(val);
      //console.log(val, idx);
    });

    scope.state.send.sort((a,b) => {
      return b.team_info.Points - a.team_info.Points;
    });
    scope.setState({teams: scope.state.send});
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
    this.setState({send: tmpSend, save: tmpSend, allPlayers: this.state.data});
  }

  // callback function for change in data to propogate to sub Components
  handleDataChange = (e) => {
    //console.log("Changing: ", e.target);    
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


  handleTableClick = (e) => {
    var playerClicked = e.target.innerHTML;
    // at this point we dont know if a name was clicked, 
    // so have to check that name (not stats column) was chosen
    /*
    this.state.allPlayers.forEach((val, idx) => {
      if (playerClicked)
    });
    */
    //console.log(this.state.allPlayers);
    // check if array of objects includes object
    const player = this.state.allPlayers.find((player) => {
      if (player.Name === playerClicked) {
        return player;
      }
    })
    console.log(player);
    var d = {
      data: null
    };
    //d.data = null;
    d.data = player;
    if (player) {
      this.setState({show: true, popup: d});
    }
  };



  handleBarClick = (e) => {
    //e.preventDefault();
    var scope = this;
    //console.log("bar click: ", e);
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
      //console.log("Login: ", body.userData);
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
          UserTeam: scope.refs.team.value,
          player: scope.refs.player.value
      }),
      headers: {"Content-Type": "application/json"}
    })
    .then(res => {
      return res.json()
    })
    .then(body => {
      //console.log("User: ", body.userData);
      this.setState({login: body.login, userData: body.userData});
    });
  }
  

  render() {    
    /// 3 components that are conditionally rendered
      // submit for practicing post
    //console.log(this.state);
    return(
      <div id="highContainer" transform={this.state.transform}>      
        {this.state.login ?
          <div id="baseContainer">
            <h3>{"Hello " + this.state.userData.username + "!"}</h3>           
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
              {this.state.send ?                
                <LeagueLeadersComp
                  data={this.state.send}
                  players={this.state.allPlayers}
                  onChange={this.handleTableClick}
                />                
                : null
              }
            </div>            
            <div id="userteam-roster">
              {this.state.userData ?                
                <RosterComp
                  userdata={this.state.userData}
                  data={this.state.send}              
                />                
                : null
              }
            </div>
            <div id="top-players-team" className="col-3">
              {this.state.barClick ?                
                <RenderTableComponent
                  data={this.state.barClick}
                  
                />                
                : null
              }
            </div>
            <div id="team-comparison">
            <h3 id="team-comp-head">Teams by Points</h3>
              {this.state.teams ?                
                <TeamComp
                  data={this.state.teams}                  
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
                        <Form.Control placeholder="SJS" ref="team"/>
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
