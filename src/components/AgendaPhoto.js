import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Container, Row, Col } from 'react-bootstrap';
import '../components/css/reportes.css';

class AgendaPhoto extends React.Component {
    render() {
        return (            
            <Container fluid={true} className="userPersonalizado">
                <Row className="text-center">                
                    <Col lg={12}>
                         <FontAwesome                          
                          name='user-circle'
                          size='5x'                             
                        />
                    </Col>
                    <Col xs={12} className="mt-4">
                        <h4> {this.props.nombre} </h4>
                    </Col>  
                </Row>
            </Container>   
 
             
            );

    }
}
export default AgendaPhoto;