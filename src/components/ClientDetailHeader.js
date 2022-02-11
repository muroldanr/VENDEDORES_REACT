import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Titulo from '../components/Titulo';

class ClientDetailHeader extends React.Component {
    
    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col xs={12}>
                        <Titulo titulo={localStorage.getItem('clienteNombre')}></Titulo>
                    </Col>                 
                </Row>
            </Container>            
        );

    }
}
export default ClientDetailHeader;