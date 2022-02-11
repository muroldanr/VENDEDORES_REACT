import React from 'react';
import './css/menu.css';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { Link } from 'react-router-dom';

class NewMenu extends React.Component{

    render(){
        let user = localStorage.getItem('user').substr(0, 2);
        let defaultMenu = window.location.pathname ; 
        return(
            <SideNav className="menuContainer"
                onSelect={(selected) => {
                    // Add your code here
                }}
            >
                <SideNav.Toggle/>
                    <SideNav.Nav onClick={(e)=>{localStorage.setItem("condicionModalUsuario","")}} defaultSelected={defaultMenu}>
                        <NavItem eventKey="/home">
                            <NavIcon>
                                <Link to="/home"><i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /></Link>
                            </NavIcon>
                            <NavText>INICIO</NavText>
                        </NavItem>
                        <NavItem eventKey="/principales">
                            <NavIcon>
                                <Link to="/principales"><i className="fa fa-fw fa-calendar-plus" style={{ fontSize: '1.75em' }} /></Link>
                            </NavIcon>
                            <NavText>HOY</NavText>
                        </NavItem>
                        <NavItem eventKey="/productDetail">
                            <NavIcon>
                                <Link to="/productDetail"><i className="fa fa-fw fa-couch" style={{ fontSize: '1.75em' }} /></Link>
                            </NavIcon>
                           <NavText>
                                ARTICULOS</NavText>
                        </NavItem>
                        <NavItem eventKey="/clientes">
                            <NavIcon>
                                <Link to="/clientes"><i className="fa fa-fw fa-user" style={{ fontSize: '1.75em' }} /></Link>
                            </NavIcon>
                            <NavText>
                                CLIENTES
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="/carrito">
                            <NavIcon>
                                <Link to="/carrito"><i className="fa fa-fw fa-cart-plus" style={{ fontSize: '1.75em' }} /></Link>
                            </NavIcon>
                            <NavText>
                                CARRITO
                            </NavText>
                        </NavItem>
                        {
                            (true) ?
                            null
                            :
                            <NavItem eventKey="/principales">
                                <NavIcon>
                                    <Link to="/principales"><i className="fa fa-fw fa-star" style={{ fontSize: '1.75em' }} /></Link>
                                </NavIcon>
                                <NavText>
                                    ÚLTIMOS
                                </NavText>
                            </NavItem>
                        }
                        <NavItem eventKey="/seguimiento">
                            <NavIcon>
                                <Link to="/seguimiento"><i className="fa fa-fw fa-clipboard-check" style={{ fontSize: '1.75em' }} /></Link>
                            </NavIcon>
                            <NavText>
                                SEGUIMIENTO
                            </NavText>
                        </NavItem>
                        <NavItem className="/Usuario" eventKey="charts/algso">
                            <NavIcon>
                                <Link to="/Usuario"><div className="iconUser">{user}</div></Link>
                            </NavIcon>
                            <NavText>
                                <div className="optionUserTitulo">{localStorage.getItem('user')}</div>
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
            );
    }
}
export default NewMenu;