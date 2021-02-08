import React, { Component } from 'react';
import './App.css';
import Game from './components/Game.js';
import About from './components/About';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
      <div className = "App">
        <h1>Conway's Game of Life</h1>
        <h3>By Jason Belgard</h3>
        <Route exact path = "/" render = {props => <Link to = "/about">About Page</Link>} />
        <Route exact path = "/" render = {props => <Game />} />
        <Route exact path = "/" render = {props => <About />} />
      </div>
      </Router>
    );
  }
}

export default App;
