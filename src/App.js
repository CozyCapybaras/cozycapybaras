import React from 'react';
import {useState} from 'react';
import TextField from "@mui/material/TextField";
import "./App.css";
import Home from "./Home";
import Degods from "./Degods";
import Primates from "./Primates";
import BuyContest from "./BuyContest.js";
import {Route,Link} from 'react-router-dom';
var Buffer = require('buffer/').Buffer
function App() {

  return (
    <>
      <Route exact path="/" component ={Home}/>
      <Route exact path="/primates" component={Primates} />
      <Route exact path="/degods" component={Degods} />
      <Route exact path="/buycontest" component={BuyContest} />
    </>
  );
}

export default App;