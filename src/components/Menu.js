import React from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { Link } from 'react-router-dom';
import './css/menu.css';
import logoImage from './images/logo.png'; 
import logoImageTorres from './images/logoTorres.png'
import { IoIosCart } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

import '../index.css';



class Menu extends React.Component {
    render() {
        return (
            <div className="menu_container">
                <div className="logo">
                    <img alt={"Logo"} src={localStorage.getItem("Categoria") === "R TORRES" ? logoImageTorres : logoImage} />
                </div>
                <div className="menu_items">
                    <div className="menu_item">
                        <Link to="/home" className="texto">INICIO</Link>
                    </div>
                    <div className="menu_item">
                        <Link to="/principales" className="texto">HOY</Link>
                    </div>
                    <div className="menu_item">
                        <Link to="/clientes" className="texto">CLIENTES</Link>
                    </div>
                </div>
                <div className="with_icons">
                    <div className="menu_item">
                        <IoIosCart className="icon" />
                        <Link to="/carrito" className="other_text">CARRITO</Link>
                    </div>
                    <div className="menu_item">
                        <IoIosStarOutline className="icon" />
                        <Link to="/Favoritos" className="other_text">ULTIMOS</Link>
                    </div>

                </div>
            </div>
    );
            
    }
}
export default Menu;