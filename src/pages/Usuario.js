import React from 'react';
import NewMenu from '../components/NewMenu';
import Titulo from '../components/Titulo';
import Photo from '../components/AgendaPhoto';
import { Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import '../components/css/Usuario.css';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

class Usuario extends React.Component {

    constructor(props) {
      super(props);
        this.state = {
            mostrar: false,
            show: false
        };
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.manipularMostrar = this.manipularMostrar.bind(this);
      this.manipularCerrar = this.manipularCerrar.bind(this);
    }


    handleClose() {
    this.setState({ show: false });
    }

    handleShow() {
    this.setState({ show: true });
    }

    manipularCerrar() {
    this.setState({ mostrar: false });
    }

    manipularMostrar() {
    this.setState({ mostrar: true });
    }

    cerrarSession(){
      localStorage.setItem("role","");
      localStorage.setItem("user","");
      localStorage.setItem("clienteNombre", "");
      localStorage.setItem("clienteCliente", "");
      localStorage.setItem("clienteTelefonos", "");
      localStorage.setItem("clienteeMail1", "");
      localStorage.setItem("clienteeCotizacion", "");
      localStorage.setItem("clienteeCotizacionID", "");
      localStorage.setItem("clienteeMov", "");
      localStorage.setItem("recentClients", "");
      localStorage.setItem("responsable", "");
      localStorage.setItem("clienteRFC", "");
      return(this.handleClose)
    }

    render() {
        return (    
            <div>
                <NewMenu/> 
            <div className="container-fluid" id="body_principales-a">
                  <Titulo titulo={localStorage.getItem('user')}/>
                      <Row>
                       <Col className="med mb-2" md={{ span: 4, offset: 4 }} xs={{ span: 4, offset: 4 }} sm={{ span: 4, offset: 4 }} xl={{ span: 4, offset: 4 }} lg={{ span: 4, offset: 4 }}>
                            <Photo nom={localStorage.getItem('user')}/>
                            <h4>{localStorage.getItem('userNombre')}</h4>
                          </Col>
                        { /*    <Col className="med mb-2" md={{ span: 4, offset: 4 }} xs={{ span: 4, offset: 4 }} sm={{ span: 4, offset:44 }} xl={{ span: 4, offset: 4 }} lg={{ span: 4, offset: 4 }}>
                            <Button className="botonUsuario">Configuración</Button>
                          </Col>
                          <Col className="med mb-2" md={{ span: 4, offset: 4 }} xs={{ span: 4, offset: 4 }} sm={{ span: 4, offset:44 }} xl={{ span: 4, offset: 4 }} lg={{ span: 4, offset: 4 }}>
                            <Link to="/historicoVentas"><Button className="botonUsuario">Historial de ventas</Button></Link>-->}
                          </Col> */}
                          <Col className="med mb-2" md={{ span: 4, offset: 4 }} xs={{ span: 4, offset: 4 }} sm={{ span: 4, offset: 4 }} xl={{ span: 4, offset: 4 }} lg={{ span: 4, offset: 4 }}>
                            <Button onClick= {(e) => this.handleShow()} className="botonUsuario">Cerrar sesión</Button>
                          </Col>
                      </Row>
            </div>
            <Modal size="sm"
             aria-labelledby="contained-modal-title-vcenter"
             centered show={this.state.show} 
             onHide={this.handleClose}>
                <Modal.Header className="modalCerrarUsuario">
                    <Modal.Title>¿Estas seguro?</Modal.Title>
                </Modal.Header>
                <Modal.Footer className="modalCerrarUsuario">
                      <Link to="/login">
                      <Button onClick= {(e) => this.cerrarSession()} className="cerrarSesionBoton" variant="secondary">
                        Si
                      </Button>
                      </Link>
                      <Button className="cerrarSesionBotonNo" variant="secondary" onClick={this.handleClose}>
                        No
                      </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="md"
             aria-labelledby="contained-modal-title-vcenter"
             centered show={this.state.mostrar} 
             onHide={this.manipularCerrar}>
                <Modal.Header className="modalCerrarUsuario">
                    <Modal.Title>Ayuda</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ajusteDeAyudaModal">
                  <Col md={12}>
                    <i className="fas fa-question mt-4"><p className="ajusteParrafo">Preguntas frecuentes</p></i>
                  </Col>
                  <Col md={12}>
                    <i className="fas fa-user-friends mt-4"><p className="ajusteParrafo">Contactos</p></i>
                  </Col>
                  <Col md={12}>
                    <i className="fas fa-file-alt mt-4"><p className="ajusteParrafo">Condiciones y privacidad</p></i>
                  </Col>
                  <Col md={12}>
                    <i className="fas fa-info-circle mt-4"><p className="ajusteParrafo">info. de la aplicacion</p></i>
                  </Col>     
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.manipularCerrar}>
                    Cerrar
                  </Button>
                </Modal.Footer>
            </Modal>  
           </div>
        );
    }
}


export default Usuario;