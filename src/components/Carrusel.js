import React from 'react';
import {Carousel } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import './css/product_details.css';
import routes from '../service-manager/routes';

class Carrusel extends React.Component {

        constructor(props){
        super(props);
        this.state ={        
        };
    }   

    render() {      
        return (
    <React.Fragment>         
            <Container>           
                <Row className="justify-content-center">                                                                                  
                    <Col sm={12}>                              
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={ encodeURI(routes.FILES+this.props.producto.Articulo)}
                                     //src={ "https://mueblesavanti.com.mx//upload/productos//imagecache/900x675_839-5bc814a1eefb3c0d7e605601d4ab337d.jpg"}
                                    alt="Cargando..."
                                />                               
                            </Carousel.Item>
                        </Carousel>
                    </Col>                 
                </Row>                 
            </Container>                                       
    </React.Fragment>
                       );
               }
           }
export default Carrusel;