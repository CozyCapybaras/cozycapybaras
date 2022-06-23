import React from 'react'
import ReactDOM from 'react-dom/client';
import { Payment } from './Payment'
import { Backend } from './Backend';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//--------------------------------------------------------------------------------------
const collectionID = "primates";
//--------------------------------------------------------------------------------------


const root = ReactDOM.createRoot(document.getElementById('root'));
var number = 0;
var number1 = 0;
function Degods() {
    var floor = roundUp(Backend.getFloor(collectionID), 4);
    var ask = roundUp(Backend.getAsk(collectionID) * 0.01, 4);
    var bid = roundUp(Backend.getBid(collectionID) * 0.01, 4);
    var description = Backend.getDescription(collectionID);
    var image = Backend.getCollectionImageLink(collectionID);
    var token = Backend.getCollectionToken(collectionID);
    var name = Backend.getCollectionName(collectionID);
    function roundUp(num, precision) {
        precision = Math.pow(10, precision)
        return Math.ceil(num * precision) / precision
    }

    window.onload = function () {
        var minusBtn = document.getElementById("minus"),
            plusBtn = document.getElementById("plus"),
            numberPlace = document.getElementById("numberPlace"),
            min = 0, /// min number
            max = 30; /// max number

        minusBtn.onclick = function () {
            if (number > min) {
                number -= 1;
                numberPlace.innerText = number;
            }
            if (number === min) {
                numberPlace.style.color = "red";
                setTimeout(function () { numberPlace.style.color = "white" }, 500)
            }
            else {
                numberPlace.style.color = "white";
            }
        }
        plusBtn.onclick = function () {
            if (number < max) {
                number += 1;
                numberPlace.innerText = number;
            }
            if (number === max) {
                numberPlace.style.color = "red";
                setTimeout(function () { numberPlace.style.color = "white" }, 500)
            }

            else {
                numberPlace.style.color = "white";
            }
        }

        var minusBtn1 = document.getElementById("minus1"),
            plusBtn1 = document.getElementById("plus1"),
            numberPlace1 = document.getElementById("numberPlace1"),
            min1 = 0,
            max1 = 30;
        minusBtn1.onclick = function () {
            if (number1 > min1) {
                number1 -= 1;
                numberPlace1.innerText = number1;
            }
            if (number1 === min1) {
                numberPlace1.style.color = "red";
                setTimeout(function () { numberPlace1.style.color = "white" }, 500)
            }
            else {
                numberPlace1.style.color = "white";
            }
        }
        plusBtn1.onclick = function () {
            if (number1 < max1) {
                number1 += 1;
                numberPlace1.innerText = number1;
            }
            if (number1 === max1) {
                numberPlace1.style.color = "red";
                setTimeout(function () { numberPlace1.style.color = "white" }, 500)
            }

            else {
                numberPlace1.style.color = "white";
            }
        }
    }

    function maxTokensClicked(tokens) {
        var numberPlace1 = document.getElementById("numberPlace1")
        number1 = tokens;
        numberPlace1.innerText = number1;
    };
    function maxSolClicked(price, sol) {
        var numberPlace = document.getElementById("numberPlace")
        number = Math.floor(sol/price);
        numberPlace.innerText = number;
    };

    return (
        <>
            <Link to="/"><button class="back"> 🡸 Back</button></Link>
            <img src={image} />
            <h1>{name}</h1>
            <h2>{description}</h2>
            <h3>One share = 1%</h3>
            <div class="centered">
                <div id="buyIncrement">
                    <Row>
                        <button class="plus" id="plus">+</button>
                        <span id="numberPlace">0</span>
                        <button class="minus" id="minus">-</button>
                    </Row>
                    <Row>
                        <Col><button class="max" onClick={() => Payment.getSolBalance(ask, maxSolClicked)}> <h3 class="max">Max</h3></button></Col>
                    </Row>
                </div>
                <button class="buy" onClick={() => Payment.buy(ask * number, number, token)}> Buy Now  {ask} ◎</button>
                <button class="floor"> Floor {floor} ◎</button>
                <button class="sell" onClick={() => Payment.sell((bid * number1)*0.92, number1, token)}> Sell Now  {bid} ◎</button>
                <div id="sellIncrement">
                    <Row>
                        <button class="plus" id="plus1">+</button>
                        <span id="numberPlace1">0</span>
                        <button class="minus" id="minus1">-</button>
                    </Row>
                    <Row>
                        <Col><button class="max" onClick={() => Payment.getTokenBalance(token, maxTokensClicked)}> <h3 class="max">Max</h3></button></Col>
                    </Row>
                </div>
            </div>
            <h2>Marketplace Coming Soon!</h2>
        </>
    )
}

export default Degods;