import React from 'react';
import './css/detallesreportes.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';



 class BotonesDeDetalleReportes extends React.Component {


    render() {
        return (     
           <Container>
              <Row>
                   {/* <Col className="ml-4" md={4}  lg={2} xl={2}>
                            <Button className="botonuno">Dia</Button>
                    </Col> */}
                    <Col md={4}  lg={4} xl={4}>
                            <Button className="botonuno" >Semana</Button>
                    </Col>
                    <Col md={4}  lg={4} xl={4}>
                            <Button className="botonuno">Mes</Button>
                    </Col>
                    <Col md={4}  lg={4} xl={4}>
                            <Button className="botonuno">Año</Button>
                    </Col>
                    {/*<Col md={4}  lg={2} xl={2}>
                            <Button className="botonuno">Acumulado</Button>
                    </Col>*/}
                </Row>
           </Container>
        );
    }
 }    

   export default BotonesDeDetalleReportes;