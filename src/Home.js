import React from 'react';
import { useState } from 'react';
import TextField from "@mui/material/TextField";
import List from "./List";
import { Payment } from "./Payment"
import { Link } from "react-router-dom";
import data from "./ListData.json"
import fetch from "isomorphic-fetch";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



const COINBASE_BASE_URL = "https://api.coinbase.com/v2";
var value;
async function getPrice() {
    const res = await fetch(`${COINBASE_BASE_URL}/prices/SOL-USD/buy`);
    const { data } = await res.json();
    value = data.amount
}

function Home() {
    const [inputText, setInputText] = useState("");
    let inputHandler = (e) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };
    const collections = [];
    data.map((item) => (
      collections.push((item.text).padEnd(6, ' '))
  ))
  var collectionsString = collections.join('    ☩    ');
    return (
        <>
            <div class="centered">
            <h2>$SOL</h2>
              <label class="switch">
              <input type="checkbox"></input>
              <span class="slider round"></span>
            </label>
            <h2>$COZY</h2>
                <div class="marquee">
	                <h2>{collectionsString}</h2>
                </div>
                <button class="solana"> SOL-USD:${value} </button>
            </div>
            <Link to="/buycontest"><button class="back"> Trading Contest</button></Link>
            <div className="main">
                <h1>Marketplace</h1>
                <div>
                    <TextField
                        onChange={inputHandler}
                        fullWidth
                        id="outlined-basic" label="Enter Collection" variant="outlined"
                    />
                    <List input={inputText} />
                </div>
                <button onClick={() => Payment.connect()}> Connect Wallet</button>
                <button onClick={() => Payment.disconnect()}> Remove Wallet</button>
            </div>
        </>
    );
}
export default Home
getPrice()
setInterval(getPrice, 10000)