import React, { useEffect, useState } from 'react'
import "../../styles/card_menu.css"

import getPlayerImage from '../../assets/playerImages';
import PlayerMenu from './PlayerMenu';

function CardMenu(props) {
    const cardImage = getPlayerImage(props.player.role);

    return (<div className='card_menu' onClick={props.seeMenu}>
        <div className='background-card'>
            <img src={cardImage} alt={props.player.role} />
            <p>{props.player.role}</p>
        </div>
        <div className='player-info'>
            <h2>Tên: {props.player.name}</h2>
            <p>Phe: {props.player.team}</p>
            <div className='stats'>
            </div>
        </div>
    </div>);
}

export default CardMenu;