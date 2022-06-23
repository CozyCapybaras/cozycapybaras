import React from 'react'
import data from "./ListData.json"
import { Link } from "react-router-dom";
import { Backend } from './Backend';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function List(props) {

    var filteredData = data.filter((el) => {
        if (props.input !== '') {
            return el.text.toLowerCase().includes(props.input)
        }
    })
    filteredData = filteredData.slice(0, 5);
    return (
        filteredData.map((item) => (
            <Link to={'/' + item.id}><ul key={item.id}>
                <button class="menu">
                    <img class="menu" src={Backend.getSampleImageLink(item.id)} />
                    <h2 class="dropdown">{item.text}</h2>
                </button>
            </ul></Link>
        ))

    )
}

export default List;