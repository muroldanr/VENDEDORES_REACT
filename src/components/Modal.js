import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import swal from 'sweetalert';
import './css/modal.css'

class ModalComponent extends React.Component {


  constructor(props) {
    super(props);

    let user = localStorage.getItem('user');

    this.state={
      loading: false,
      name:[], 
      user: (user) ? user:'',
      actividad:""

    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  isLoading(active){
        this.setState({loading: active});
    }


  getActividad(WebUsuario,Cliente,Que,Titulo,Reporte){
    this.isLoading(true);
    this.props.onHide();   
    manager.postData(routes.PUT_ACTIVIDAD,{'WebUsuario': this.state.user,'Cliente':localStorage.getItem('clienteCliente'),'Que':this.props.act,'Titulo': this.state.actividad,'Reporte':this.state.actividad})
    .then(response => {
        this.setData(response)
        this.isLoading(false);
    })
    .catch(error =>{
      this.isLoading(false)
      let {code} = error;

      swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

      if (code === undefined) {
        code = 500;
      }

      if(code === 401){
        
      }
    });
  }

	render() {
	  return (
      <div>		
      	<Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter" centered >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                 <h3>{this.props.act}</h3>                  
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>	                                                  
                     <Form.Label>Anotaciones</Form.Label>
                     <Form.Control 
                      onChange={this.handleChange}
                      type="text"
                      placeholder="Actividad a realizar..." 
                      name="actividad"
                      value={this.state.actividad}
                       />                      
                     <Form.Text className="text-muted">
                       Fecha de la actividad {this.props.date}
                     </Form.Text>                   
              </Modal.Body>
              <Modal.Footer>                
                <Button className="saveButton" onClick={this.getActividad.bind(this)}>Guardar cambios</Button>    
                <Button className="closeButton" onClick={this.props.onHide}>Close</Button>
              </Modal.Footer>
          </Modal>	
      </div>
		);
	}
}

export default ModalComponent;
