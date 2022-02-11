import React from 'react';
import './css/principales.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import FontAwesome from 'react-fontawesome';

class PrinBotones extends React.Component {
    
    constructor(props) {
        super(props);

        let cliente = localStorage.getItem('clienteCliente');

        if (cliente === "" || cliente === "null" || cliente === null) {
            localStorage.setItem("clienteCliente", localStorage.getItem('clienteUsuarioCliente'));
            localStorage.setItem("clienteNombre",  "Cliente Mostrador");
            localStorage.setItem("clienteTelefonos", "");
            localStorage.setItem("clienteeMail1", "");
            localStorage.setItem("clienteeCotizacionID", "");
            localStorage.setItem("clienteeMov", "");
            localStorage.setItem("recentClients", "");
            cliente = localStorage.getItem('clienteCliente');
        }

        this.manejarMostrar = this.manejarMostrar.bind(this);
        this.manejarCerrar = this.manejarCerrar.bind(this);
        this.state = {
            objeto:false,
            cliente: cliente
        };
    }


    clickCotizacion = (e,obj) => {
        this.props.history.push({
            pathname:'/productDetail',
                state:{
                valor:obj
            }
        });
    }

    manejarMostrar(){
    this.setState({ mostrar: true });
    }

    manejarCerrar(){
    this.setState({ mostrar: false });
    }

    render() {
        return (
            <Container fluid={true} className="pt-2">
                <Row>                         
                    <Col className="pt-4" xs={4} sm={4} md={4}  lg={4} xl={4}>
                        <Link to="/DetallesReportes">
                          <center>  

                              <Button className="botoncirculo">
                                  <FontAwesome className="car" name='chart-line' size='lg' />
                                  
                              </Button>
                              <h4 className='mt-3'>
                                 REPORTE VENTAS
                              </h4>
                          </center>  
                        </Link>
                    </Col>
                    <Col className="pt-4"  xs={4} sm={4} md={4}  lg={4} xl={4}>
                        <Link to="/ReportesGraficas">
                          <center>  
                              <Button className="botoncirculo">
                                  <FontAwesome className="car" name='chart-bar' size='lg' />
                              </Button>
                              <h4 className='mt-3'>
                                 REPORTES
                              </h4>
                          </center>  
                        </Link>
                    </Col>
                    <Col className="pt-4" xs={4} sm={4} md={4}  lg={4} xl={4}>
                            <Link to="/agenda">
                                <center> 
                                    <Button className="botoncirculo">
                                        <FontAwesome className="car" name='calendar'size='lg' />
                                    </Button>
                                    <h4 className='mt-3'>
                                        AGENDA
                                    </h4>
                                </center>
                            </Link> 
                    </Col>
                    {/* 
                    <Col className="pt-4" xs={3} sm={3} md={3}  lg={3} xl={3}>
                            <Link to="/ReportesGraficasVendedor">
                                <center> 
                                    <Button className="botoncirculo">
                                        <FontAwesome className="car" name='chart-area'size='lg' />
                                    </Button>
                                    <h4 className='mt-3'>
                                        INGRESOS
                                    </h4>
                                </center>
                            </Link> 
                    </Col>
                    */}
                </Row>

                  <Modal size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered show={this.state.mostrar} 
                      onHide={this.manejarCerrar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Aviso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                           Es necesario seleccionar un cliente
                    </Modal.Body>
                    <Modal.Footer>
                          <Button variant="secondary" onClick={this.manejarCerrar}>
                            Cerrar
                          </Button>
                    </Modal.Footer>
                  </Modal>
            </Container>                
        );
    }
}

export default PrinBotones;