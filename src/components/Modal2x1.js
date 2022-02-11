import React from 'react';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { Col, Row, Button } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import NumberFormat from 'react-number-format';

class Modal2x1 extends React.Component {

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
                  <Modal.Title><center>Articulo 2X1</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Si la cantidad no es par se le invitara al cliente a tomar el otro articulo</h4>
                    <h4>Si la cantidad es par se aplica el descuento.</h4>
                </Modal.Body>
                <Modal.Footer>
                  
                </Modal.Footer>
            </Modal>
        );
    }
}
export default Modal2x1;