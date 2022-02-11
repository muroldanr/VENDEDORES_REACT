import React from 'react';
import 'react-push-menu/styles/component.css';
import logoImage from './images/logo.png';
import logoImageTorres from './images/logoTorres.png'
import { Link } from 'react-router-dom';
import './css/menu.css';



class MenuBurger extends React.Component {


    render() {
        return (
            <div className="mobile-nav">                
                <div className="amado-navbar-brand">
                    <Link to="/home">
                        <img alt={"AvantiMenu"} src={localStorage.getItem("Categoria") === "R TORRES" ? logoImageTorres : logoImage} />
                    </Link>                        
                </div>                    
                <div className="amado-navbar-toggler">
                        <span></span><span></span><span></span>
                </div>
            </div>
        );
    }
}
export default MenuBurger;