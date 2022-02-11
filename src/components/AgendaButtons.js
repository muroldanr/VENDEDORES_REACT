import React from 'react';
import './css/agenda.css';
import { Container, Row, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
class AgendaButtons extends React.Component {   
    state={

    };
    handleChange = e => {        
        this.setState({            
            [e.target.name] : e.target.value
        }); 
    };   

    
    render() {        
        return (
            <Container fluid={true}>
                <Row>
                    <Col xl={12} className="mb-4">
                        <InputGroup>                          
                                <div className="input-group-prepend">
                                    <label className="input-group-text" for="inputGroupSelect01"></label>
                                </div>
                                <Form.Control as="select" onChange={this.props.onChange}>  
                                    <option name="select"    value={this.state.select}>    Selecciona ...</option>
                                    <option name="correo"    value={this.state.registrar}> Correo</option>
                                    <option name="whatsapp"  value={this.state.enviar}>    Whatsapp</option>
                                    <option name="lamada"   value={this.state.avanzar}>   Llamada</option>                                                            
                                </Form.Control>                                                        
                        </InputGroup>                                                        
                    </Col>
                </Row>
            </Container>
            );
    }
}
export default AgendaButtons;