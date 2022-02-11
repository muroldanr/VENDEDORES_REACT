import React from 'react';
import '../components/css/clientes.css';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import '../components/css/seguimiento.css';
import { Col, Row, Form,Button } from 'react-bootstrap';
import swal from 'sweetalert';
import ModalClientes from '../components/ModalClientes';
import ModalUser from '../components/ModalUser';

class ModalAvanzar extends React.Component {

  constructor(props) {
      super(props);

      let defaultCliente = localStorage.getItem('clienteUsuarioCliente');
      let nombreCliente = localStorage.getItem("clienteNombre");
      let telefonos = localStorage.getItem('clienteTelefonos');
      let email = localStorage.getItem('clienteeMail1');

      if (!(nombreCliente) || nombreCliente === "null" || nombreCliente === "") {
        nombreCliente = "Cliente mostrador";
      }

      if (telefonos === "null" || telefonos === "" || telefonos === null) {
        telefonos = "";
      }

      if (email === "null" || email === "" || email === null) {
        email = "";
      }

      this.state = {
          headers: [],
          data: [],  
          users: [],
          mostrar:false,
          loading : true,
          ID:"",
          mov:"",
          mostrarOpciones: false,
          showModalRegistro: false,
          mostrarClientes: false,
          defaultCliente: defaultCliente,
          nombreCliente: nombreCliente,
          telefonoCliente: telefonos,
          emailCliente: email
      };

      this.mostrarModal = this.mostrarModal.bind(this);
  }
  
  mostrarModal(active){
    this.setState({ mostrar: false });
    this.props.isShow(false);
  }

  selectMov(mov){
      this.setState({
          mov: mov
      });
  }

  avanzarMov(){
    if(this.state.mov && this.state.cliente){
      this.reqAvanzarMovimiento();
    }
  }

  reqAvanzarMovimiento() {

    this.isLoading(true);

    manager.postData(routes.SET_AVANZAR_PEDIDO,{UsuarioWeb:localStorage.getItem('user'),ID:this.state.ID,Mov:this.state.mov, Cliente: this.state.cliente})
    .then(response => {
        if (response[0] && typeof response[0] === "object") {
            let resp = response[0];
            if ( resp.Ok === null && resp.OkRef === null) {
                this.isLoading(false);
                this.props.avanzar(false);
                swal("Enviado", "Movimiento hecho exitosamente!", "success"); 
                this.setState({
                  mostrar:false
                });
            }else {
                swal("Error!", (resp.OkRef) ? resp.OkRef : "Ocurrrio un error inesperado, vuelva a intentar", "error");
                this.isLoading(false);
            }
        }
        this.isLoading(false);
    })
    .catch(error =>{
      swal("Error!", "Ocurrrio un error inesperado, vuelva a intentar", "error"); 
        const {code} = error
        if (code === undefined) {
            this.isLoading(false); 
        }
        if(code === 401){
            this.isLoading(false);
        }else { 
            this.isLoading(false);
        }
    });
  }

  handleClick = (e,objV) =>{  
    this.props.isShow(this.state.mostrar);
  }

  componentWillReceiveProps(props) {
    let nombreCliente = localStorage.getItem("clienteNombre");
    let telefonos = localStorage.getItem('clienteTelefonos');
    let email = localStorage.getItem('clienteeMail1');

    if (!(nombreCliente) || nombreCliente === "null" || nombreCliente === "") {
      nombreCliente = "Cliente mostrador";
    }

    if (telefonos === "null" || telefonos === "" || telefonos === null) {
      telefonos = "";
    }

    if (email === "null" || email === "" || email === null) {
      email = "";
    }

    this.setState({
        mostrarOpciones: props.mostrar,
        ID:props.ID,
        nombreCliente: nombreCliente,
        telefonoCliente: telefonos,
        emailCliente: email
    });
  }

  isLoading(active){
    if (this.props.loading) {
      this.props.loading(active);
    }
  }

  seleccionarNuevo(event) {
    this.setState({
      mostrarClientes: true
    });
    this.props.avanzar(false);
  }

  continuarClienteActual(event) {

    let cliente = localStorage.getItem('clienteCliente');
    this.props.avanzar(false);

    if (cliente === "null" || cliente === "" || cliente === null) {
      cliente = undefined;
    }

    /*if (cliente === this.state.defaultCliente) {
      this.showModalRegistro();
      return;
    }*/

    this.setState({
      mostrarOpciones: false,
      mostrar: true,
      cliente: cliente
    });
  }

  handleRegistrarUsuario(usuario) {
    if (usuario) {
      this.setState({
        cliente: usuario.Clave,
        mostrarOpciones: false,
        mostrar: true,
      });
      
    }
  }

  showModalRegistro() {
    this.setState({
      showModalRegistro: true
    });
  }

  closeModalOpciones() {
    this.setState({
      mostrarOpciones: false
    });
  }

  closeModalRegistro() {
    this.setState({
      showModalRegistro: false
    });
  }

  handleClickClientes(parameter) {
    this.setState({
        mostrarClientes: false
      },
      this.continuarClienteActual()
    );
  }

  render() {
      return (
        <React.Fragment>
          <Modal 
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.mostrar} 
                onHide={this.mostrarModal}>
          <Modal.Header closeButton>
              <Modal.Title>Carrito</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Row}>
                  <Form.Check
                    type="radio"
                    label="Generar Venta Stock"
                    name="mov"
                    id="Venta Stock"
                    onClick={() => this.selectMov("Venta Stock")}
                  />
                  <Form.Check
                    type="radio"
                    label="Generar Venta Pedido"
                    name="mov"
                    id="Venta Pedido"
                    onClick={() => this.selectMov("Venta Pedido")}
                  />
                  <Form.Check
                    type="radio"
                    label="Generar Venta Mostrador"
                    name="mov"
                    id="Venta Mostrador"
                    onClick={() => this.selectMov("Venta Mostrador")}
                  />
                  <Form.Check
                    type="radio"
                    label="Generar Venta Perdida"
                    name="mov"
                    id="Venta Perdida"
                    onClick={() => this.selectMov("Venta Perdida")}
                  />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
               <Button variant="primary" onClick={()=> this.avanzarMov()}>Generar</Button>
          </Modal.Footer>
          </Modal>
          <Modal 
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.mostrarOpciones} 
                onHide={this.mostrarModal}>
            <Modal.Header closeButton>
                <Modal.Title>{ this.state.nombreCliente }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <Button className="ajusteBotonSeguimiento" variant="success" onClick={ this.seleccionarNuevo.bind(this) }>Seleccionar / Registrar</Button>
                </Col>
                <Col>
                  <Button className="ajusteBotonSeguimiento" variant="success" onClick={ this.continuarClienteActual.bind(this) }>Continuar</Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          <ModalUser
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={ this.state.showModalRegistro }
                onHide={this.closeModalRegistro.bind(this)}
                nombre={this.state.nombreCliente}
                telefonos={this.state.telefonoCliente}
                email={this.state.emailCliente}
                onCreated={this.handleRegistrarUsuario.bind(this)}
                isLoading={this.isLoading.bind(this)}
                />
          <ModalClientes mostrar={this.state.mostrarClientes}  isCarrito={false} loading={this.isLoading.bind(this)} isShow={this.handleClickClientes.bind(this)}/>
        </React.Fragment>
      );

  }
}

export default ModalAvanzar;
