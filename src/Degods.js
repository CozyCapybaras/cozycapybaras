import React, {useState} from 'react'
import ReactDOM from 'react-dom/client';
import { Payment } from './Payment'
import { Backend } from './Backend';
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//--------------------------------------------------------------------------------------
const collectionID = "degods";
//--------------------------------------------------------------------------------------


const root = ReactDOM.createRoot(document.getElementById('root'));
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
    const[count, setCount] = useState(0)
    const[count1, setCount1] = useState(0)
    var numberPlace = document.getElementById("numberPlace")
    const min=0;
    const max=30;
    var numberPlace1 = document.getElementById("numberPlace1")
    const min1 = 0;
    const max1 = 30;

    function increase () {
        if(count<max)
        {
            setCount(count+1)
        }
        if(count === max) {        
            numberPlace.style.color= "red";
            setTimeout(function(){numberPlace.style.color= "white"},500)
        }
        else {
            numberPlace.style.color= "white";
        }
    }
    function decrease () {
        if (count>min){
            setCount(count-1)
         }
         if(count === min) {        
             numberPlace.style.color= "red";
             setTimeout(function(){numberPlace.style.color= "white"},500)
         }
         else {
           numberPlace.style.color="white";            
         } 
    }
    function increase2 () {
        if(count1<max1)
        {
            setCount1(count1+1)
        }
        if(count1 === max1) {        
            numberPlace1.style.color= "red";
            setTimeout(function(){numberPlace1.style.color= "white"},500)
        }
        else {
            numberPlace1.style.color= "white";
        }
    }
    function decrease2 () {
        if (count1>min1){
            setCount1(count1-1)
         }
         if(count1 === min1) {        
             numberPlace1.style.color= "red";
             setTimeout(function(){numberPlace1.style.color= "white"},500)
         }
         else {
           numberPlace1.style.color="white";            
         } 
    }

    function maxTokensClicked(tokens) {
        var numberPlace1 = document.getElementById("numberPlace1")
        count1 = tokens;
        numberPlace1.innerText = count1;
    };
    function maxSolClicked(price, sol) {
        var numberPlace = document.getElementById("numberPlace")
        count = Math.floor(sol/price);
        numberPlace.innerText = count;
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
                        <button class="plus" id="plus" onClick={increase}>+</button>
                        <span id="numberPlace">{count}</span>
                        <button class="minus" id="minus"onClick={decrease}>-</button>
                    </Row>
                    <Row>
                        <Col><button class="max" onClick={() => Payment.getSolBalance(ask, maxSolClicked)}> <h3 class="max">Max</h3></button></Col>
                    </Row>
                </div>
                <button class="buy" onClick={() => Payment.buy(ask * count, count, token)}> Buy Now  {ask} ◎</button>
                <button class="floor"> Floor {floor} ◎</button>
                <button class="sell" onClick={() => Payment.sell((bid * count1)*0.92, count1, token)}> Sell Now  {bid} ◎</button>
                <div id="sellIncrement">
                    <Row>
                        <button class="plus" id="plus1"onClick={increase2}>+</button>
                        <span id="numberPlace1">{count1}</span>
                        <button class="minus" id="minus1"onClick={decrease2}>-</button>
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