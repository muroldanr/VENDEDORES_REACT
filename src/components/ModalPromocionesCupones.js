import React from 'react';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { Container,Col, Row, Button } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import NumberFormat from 'react-number-format';
import ToogleSwitch from '../components/ToogleSwitch';
import Form from 'react-bootstrap/Form';

class ModalPromocionesCupones extends React.Component {

    constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

        this.state = {
            headers: [],

            ver: (props.mostrar) ? true:false,
     

      
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            ver: (props.mostrar) ? true:false,
        
        });
    }

   
   
     


    isLoading(active){
      if (this.props.loading) {
        this.props.loading(active);
      }
    }

    render() {
        return (
            <Modal className="modal-termometro"
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={this.state.ver} 
                  onHide={this.props.onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title><center> Cupones del Artículo</center></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row  mt={4} className="mt-4 pt-4">
                                <Col>
                                    <Form.Control type="text" name="busquedaAlmacen"  placeholder="Código del cupón"/>
                                </Col>
                                <Col>
                                    <Button className="botonsearch" >
                                        Aplicar
                                    </Button>
                                </Col>
                            </Row>  
                            <Row mt={4} className="mt-4 pt-4" >
                                <Col >
                                <h4> Descuento del 10% en compras mayores a $ 35.000.00 </h4>
                                </Col>
                                <Col>
                                    <ToogleSwitch />
                                </Col>
                            </Row>  
                            <Row mt={4} className="mt-4 pt-4">
                                <Col >
                                    <h4> Entrega gratuita en compras mayores a $ 40.000.00 </h4>
                                </Col>
                                <Col>
                                    <ToogleSwitch />
                                </Col>
                            </Row>  
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                    
                    </Modal.Footer>
            </Modal>
        );
    }
}
export default ModalPromocionesCupones;