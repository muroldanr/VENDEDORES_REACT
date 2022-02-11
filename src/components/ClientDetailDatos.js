import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './css/clientDetail.css';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import Titulo from '../components/Titulo';

class ClientDetailDatos extends React.Component {

    constructor(props) {

      super(props);

      let telefonos = localStorage.getItem('clienteTelefonos');
      let clienteEmail = localStorage.getItem('clienteeMail1');
      let clienteNombre = localStorage.getItem('clienteNombre');
      let rfc = localStorage.getItem('clienteRFC');

      if (telefonos === null || telefonos === "" || telefonos === "null") {
        telefonos = " ";
      }

      if (clienteEmail === null || clienteEmail === "" || clienteEmail === "null") {
        clienteEmail = " ";
      }

      if (rfc === null || rfc === "" || rfc === "null") {
        rfc = " ";
      }

      this.state={
         show:false,
         mostrar:false,
         StringDelNumeroDeTelefono:'',
         StringDelCorreo:'',
         telefonos: telefonos,
         clienteEmail: clienteEmail,
         clienteNombre: clienteNombre,
         rfc: rfc,
      };
    }

      handleChange = e => {
        this.setState({            
                [e.target.name]:e.target.value,
        });
      }

      handleShow() {
        this.setState({
          show: true
        })
      }

      handleClose(){
        this.setState({
          show: false
        })
      } 

      manejarMostrar() {
        this.setState({
          mostrar: true
        })
      }

      manejarCerrar(){
        this.setState({
           mostrar: false
        })
      } 

      isLoading(active){
        if (this.props.loading) {
          this.props.loading(active);
        }
      }

      capturandoNumeroTelefonico(stringTelefono){
          this.setState({StringDelNumeroDeTelefono:stringTelefono.target.value})
      }

      capturandoCorreo(stringCorreo){
          this.setState({StringDelCorreo:stringCorreo.target.value})
      }

      valorDelTelefono(){
            this.isLoading(true);
            manager.postData(routes.POST_ACTUALIZAR_CLIENTE,{
               WebUsuario: localStorage.getItem('user'),
               Cliente: localStorage.getItem('clienteCliente'),
               Nombre: this.state.clienteNombre,
               Telefono: this.state.telefonos,
               Email:this.state.clienteEmail,
               RFC:this.state.rfc,
            }).then(response => {
      
              this.isLoading(false);
              if(response[0]["Ok"] === null) {
              localStorage.setItem("clienteNombre", this.state.clienteNombre);
              localStorage.setItem("clienteTelefonos", this.state.telefonos);
              localStorage.setItem("clienteeMail1", this.state.clienteEmail);
              localStorage.setItem("clienteRFC", this.state.rfc);
              swal("Cliente actualizado", "Cliente actualizada con éxito", "success");
              }

            })
            .catch(error =>{
              this.isLoading(false);
              swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
            });
          this.handleClose()
          this.removeLastCliente()
      }


    removeLastCliente(){
      var recentClientsNew = [];
      localStorage.setItem('recentClients', JSON.stringify(recentClientsNew));
    }

    render() {
        return (
            <Container fluid={true} >
                <Titulo titulo={this.state.clienteNombre}></Titulo>
                <Row className="m-3">
                    <Col >
                        <div className="input-group-prepend"  onClick={(e)=>this.handleShow()}>
                            <label onClick={(e)=>this.handleShow()} className="input-group-text" htmlFor="inputGroupSelect01"id="miLabel" >Tel. Principal</label>
                            <input type="text" className="form-control" id="miInput" placeholder={this.state.telefonos} disabled />
                        </div>
                    </Col>
                    <Col >
                        <div className="input-group-prepend" onClick={(e)=>this.handleShow()}>
                            <label onClick={(e)=>this.handleShow()} className="input-group-text" htmlFor="inputGroupSelect01"id="miLabel">Correo</label>
                            <input type="text" className="form-control" id="miInput" placeholder={this.state.clienteEmail} disabled />                             
                        </div>
                    </Col>
                </Row>
                <Row className="m-3">
                    <Col >
                        <div className="input-group-prepend" onClick={(e)=>this.handleShow()}>
                            <label onClick={(e)=>this.handleShow()} className="input-group-text" htmlFor="inputGroupSelect01"id="miLabel">Tel. Contacto</label>
                            <input type="text" className="form-control" id="miInput" placeholder={this.state.clienteEmail} disabled />                             
                        </div>
                    </Col>
                    <Col >
                        <div className="input-group-prepend"  onClick={(e)=>this.handleShow()}>
                            <label onClick={(e)=>this.handleShow()} className="input-group-text" htmlFor="inputGroupSelect01"id="miLabel" >RFC</label>
                            <input type="text" className="form-control" id="miInput" placeholder={this.state.rfc} disabled />
                        </div>
                    </Col>
                </Row>
                <Container>
                  <Modal size="md"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={this.state.show}
                  onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" className="form-control mb-3" value={this.state.clienteNombre} id="clienteNombre"  name="clienteNombre" placeholder="Nombre" onChange={this.handleChange}/>
                        <input type="tel" className="form-control mb-3" value={this.state.telefonos} id="telefonos"  name="telefonos" placeholder="Teléfono" onChange={this.handleChange}/>
                        <input type="email" className="form-control mb-3" value={this.state.clienteEmail} id="clienteEmail"  name="clienteEmail" placeholder="Correo" onChange={this.handleChange}/>
                        <input type="text" className="form-control mb-3" value={this.state.rfc} id="rfc"  name="rfc" placeholder="RFC" onChange={this.handleChange}/>
                      
                    </Modal.Body>
                    <Modal.Footer>
                          <Button variant="primary" onClick={()=> this.valorDelTelefono()}>Guardar Cambio</Button>
                    </Modal.Footer>
                  </Modal>
                </Container>
            </Container>
            );
    }
}

export default ClientDetailDatos;