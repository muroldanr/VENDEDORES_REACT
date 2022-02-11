import React from 'react';
import '../components/css/carrito.css';
import logoImage from '../components/images/logo.png'
import logoImageTorres from '../components/images/logoTorres.png'

class Titulo extends React.Component {

    render() {
        return ( 
            <React.Fragment>
                <nav className="navbar navbar-expand-lg static-top">
                  <div className="container-fluid">
                    <div className="text-back" href="#">
                        <h4 className=" " href="#">{(this.props.titulo).toUpperCase()}</h4>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                      <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <img  className="imagen-nav" alt="logo" src= {localStorage.getItem("Categoria") === "R TORRES" ? logoImageTorres : logoImage} /> 
                        </li>
                      </ul>
                    </div>
                 </div>
                </nav> 
                <hr className="style2"/>
            </React.Fragment> 
        );
    }
}
export default Titulo;