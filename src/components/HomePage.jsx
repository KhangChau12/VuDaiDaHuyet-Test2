import { useEffect, useState } from 'react'
import "../styles/home.css"

import background from "../assets/image.png";
import title from "../assets/title.png";

function Home(props) {
    useEffect(() => {
        setTimeout(() => {
            let title = document.getElementById("title");
            let menu = document.getElementById("menu");
            let buttons = document.getElementsByClassName("button");
            title.style.marginTop = 0;
            menu.style.opacity = 1;
            menu.style.width = '80%';
            for (let i = 0; i < buttons.length; ++i) {
                buttons[i].style.width = 'fit-content';
            }
        }, 1000);
    }, []);

    return (<div className='home'>
        <div className='background'>
            <img src={background}></img>
        </div>
        <div id='title'>
            <img src={title}></img>
        </div>
        <div id="menu">
            <h2>Chào mừng Hương Sư</h2>
            <div id='start' className='button' onClick={props.playGame}>
                <h3>Bắt đầu ván chơi</h3>
            </div>
            <div id='how_to_use' className='button' onClick={props.seeInstruction}>
                <h3>Hướng dẫn Hương Sư</h3>
            </div>
        </div>
    </div>);
}

export default Home;