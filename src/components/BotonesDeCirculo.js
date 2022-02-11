import React from 'react';
import './css/carrito.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Camara from '../components/Camara';
import Termometro from '../components/Termometro';
import FuenteComponent from '../components/FuenteComponent';
import BotonesSearch from '../components/BotonesSearch';
import ListaArticulos from '../components/ListaArticulos';
import ToogleSwitch from '../components/ToogleSwitch';
import swal from 'sweetalert';

class BotonesDeCirculo extends React.Component {

  constructor(props){
    super(props);

    this.manejarShow = this.manejarShow.bind(this);
    this.manejarClose = this.manejarClose.bind(this);
    this.handleScanCamara = this.handleScanCamara.bind(this);
    this.enviarproductos=this.enviarproductos.bind(this)
    let user = localStorage.getItem('user');
    let cliente = localStorage.getItem('clienteCliente');

    if (cliente === "" || cliente === "null" || cliente === null) {
      localStorage.setItem("clienteCliente", localStorage.getItem('clienteUsuarioCliente'));
      localStorage.setItem("clienteNombre", "Cliente Mostrador");
      localStorage.setItem("clienteTelefonos", "");
      localStorage.setItem("clienteeMail1", "");
      localStorage.setItem("clienteeCotizacionID", "");
      localStorage.setItem("clienteeMov", "");
      localStorage.setItem("clienteRFC", "");
      cliente = localStorage.getItem('clienteCliente');
    }

    this.state={
        ver:false,
        showArticulo: false,
        showComment: false,
        showQR: false,
        errorMessage: "",           
        loading: true,
        articulo:"",
        observaciones:"",
        tiempoAproximado:"",
        objetoarticulo:[],
        articulosOriginal:[],
        termometro:"",
        cadenaDeArticulo:"",
        responsiva:["hola"],
        stringDeBusqueda:"",
        sumatoria:1,
        condicionalSpiner:false,
        user: (user) ? user:'',
        cliente: cliente,
        busqueda: '',
        busquedaAlmacen:'',
        articulos: [],
        articulosFiltered: [],
        articulosHistorico: [],
        validData: true,
        conocidos: [],
        existencia: true,
        disponible: true,
        validacion: props.validacion,
        activar:false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      validacion: props.validacion,
      observaciones: props.observaciones,
      tiempoAproximado: props.tiempoAproximado
    });
  }

  mostrarComentario() {
    this.setState({
      showComment: true
    });
  }

  comment() {
    if (this.props.toComment) {
      localStorage.setItem("observaciones",this.state.observaciones)
      localStorage.setItem("tiempoAproximado",this.state.tiempoAproximado)
      this.props.toComment(this.state.observaciones, this.state.tiempoAproximado);
    }

    if (!this.state.validData) {
      if (this.state.tiempoAproximado !== "" && this.state.termometro !== "") {
        this.enviarproductos();
      }
    }

    this.manejarClose();
  }
  
  manejarShow(){
    this.setState({ ver: true });
  }

  manejarClose(){
      this.setState({
        ver: false,
        showComment: false
      });
  }

  handleShowArticulo() {
    this.setState({
      showArticulo: true
    })
  }

  handleClose() {

      let showArticulo = false;

      if (this.state.showQR) {
        showArticulo = true;
      }

      this.setState({
        showArticulo: showArticulo,
        showQR: false
      });
  }

  handleShowQR() {
      this.setState({
        showQR: true
      });
  }

  changeBusqueda(event) {
      let busqueda = event.target.value;
      this.setState({
        busqueda: busqueda
      });
  }

changeBusquedaAlmacen(event) {

    this.setState({
      busquedaAlmacen: event.target.value,
      articulosFiltered: this.state.articulos.filter((busqueda) => busqueda.Almacen.includes(event.target.value)),
      articulos: (event.target.value.length>0)?  this.state.articulos.filter((busqueda) => busqueda.Almacen.includes(event.target.value)):this.state.articulosOriginal,
    });


}

  onChangeSwitch(existencia) {
    this.setState({
      existencia: existencia
    });
  }

  buscarArticulo() {
    if (this.state.busqueda.length > 0) {
      this.setState({
        activar:true
      })
      this.reqSearchArticulos();
    }
  }

  handleScanCamara(busqueda) {
    if (busqueda.length > 0) {
      this.setState({
        busqueda: busqueda
      }, function() {
        this.buscarArticulo();
      });
      this.handleClose();
    }
  }

  reqSearchArticulos() {
    this.isLoading(true);
    manager.postData(routes.GET_ARTICULOS,{
      UsuarioWeb: this.state.user,
      Articulo: this.state.busqueda,
      Disponible: this.state.existencia
    }).then(response => {
      this.isLoading(false);
      this.setState({
        articulos: response,
        articulosOriginal:response,
        disponible: this.state.existencia
      });
    })
    .catch(error =>{
      this.isLoading(false);
      swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
    });
  }

  handleShowObservaciones() {

    this.isLoading(true);
      manager.postData(routes.spWebVentaListaCampos, {          
        ID: this.state.ID,
        UsuarioWeb: this.state.user,})
      .then(response => {
        this.isLoading(false);
        this.setState({
          showObservaciones: true,
          observaciones: response[0].Observaciones,
          tiempoAproximado: response[0].Comentarios
        });
      })
      .catch(error =>{
          this.isLoading(false);

          let {code} = error;

          if(code===undefined){
            code = 500;
          }
          if(code === 401){

          }else {

          }
      });


  }

  enviarproductos(evento){

    let conocidos = "";

    if (this.state.conocidos && this.state.conocidos.length > 0) {
      for (var i = 0; i < this.state.conocidos.length; ++i) {
        let conocido = this.state.conocidos[i];
        conocidos = conocidos + conocido + ",";
      }
    }

    if (conocidos) {
      conocidos = conocidos.substring(0, conocidos.length - 1);
    }

    this.props.click(evento, this.state.termometro, this.state.observaciones, this.state.tiempoAproximado, conocidos);
    this.setState({ ver: false });
  }
  
  //UsuarioWeb,Articulo,Precio,Cantidad,Opciones
  handleSaveArticulo(articulo) {
    this.isLoading(true);
    manager.postData(routes.ADD_CARRITO, {
      UsuarioWeb: this.state.user,
      Cliente: localStorage.getItem('clienteCliente'),
      Articulo: articulo.Articulo,
      Precio: articulo.PrecioLista,
      Precio2: (articulo.Precio2) ? articulo.Precio2: articulo.PrecioLista,
      Precio3: (articulo.Precio2) ? articulo.Precio3: articulo.PrecioLista,
      Almacen: articulo.Almacen,
      Cantidad: 1,
      Descripcion: ''
    })
    .then(response => {
        this.handleClose();
        this.isLoading(false);
        window.location.reload();
    })
    .catch(error => {

        this.isLoading(false);
        let {code} = error;

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

        if (code === undefined) {
          code = 500;
        }

        if(code === 401){
            console.log(code);
        }else {
            console.log(code);
        }
        this.handleClose();
    });
  }

  handleSelectedConocidos(seleccionados) {
    this.setState({
      conocidos: seleccionados
    });
  }

  termometro(termometro){

    //let showComment = (this.state.conocidos.length === 0);
    let showComment = false;
    let errorMessage = "";

    if (showComment) {
      errorMessage = "Como nos conociste es un campo obligatorio";
    }

    this.setState({
      termometro:termometro,
      showComment: showComment,
      errorMessage: errorMessage
    }, function() {
      this.enviarproductos()
    });

    return;

    //this.setState({
    //  validData: false
    //});
  }

  isLoading(active){
    if (this.props.isLoading) {
      this.props.isLoading(active);
    }
  }

  capturandoObservaciones(observaciones){
   this.setState({observaciones:observaciones.target.value})
  }

  capturandoTiempoAproximado(tiempoAprox){
   this.setState({tiempoAproximado:tiempoAprox.target.value})
  }

  render() {
      return (
         <Container>
           <Row>
              <Col className={(!this.state.validacion) ? 'mb-3' : 'condicionalHidden'} xs={3} md={4}  lg={3} xl={3}>
               <center>
                  <Button onClick={(e)=>this.props.eliminarCarrito(e)} className="botoncirculo">
                    <FontAwesome className="car"
                              name='times'
                              size='1x' />
                  </Button>
              </center>
             </Col>
             <Col className="mb-3" xs={3} md={3} lg={3} xl={3} >
               <center>
                    <Button  className="botoncirculo" onClick={this.handleShowArticulo.bind(this)}>
                          <FontAwesome className='car'
                          name='plus'
                          size='1x'/>
                    </Button>
              </center>
             </Col>
             <Col className={(!this.state.validacion) ? 'mb-3' : 'condicionalHidden'} xs={3} md={3}  lg={3} xl={3}>
               <center>
                  <Button onClick={this.mostrarComentario.bind(this)} className="botoncirculo">
                    <FontAwesome className="car"
                              name='comment'
                              size='1x' />
                  </Button>
              </center>
             </Col>
             <Col className={(!this.state.validacion) ? 'mb-3' : 'condicionalHidden'} xs={3} md={3}  lg={3} xl={3}>
              <center>
                  <Button onClick={(e)=>this.manejarShow()} className="botoncirculo">
                        <FontAwesome className='car'
                        name='check'
                        size='1x'/>
                  </Button>
              </center>
             </Col>
           </Row>
              <Modal className="modal-termometro"
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={this.state.ver}
                  onHide={this.manejarClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Termómetro venta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Termometro termometroClick={this.termometro.bind(this)}/>
                </Modal.Body>
              </Modal>
              <Modal size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={this.state.showComment}
                  onHide={this.manejarClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comentarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    {(this.state.errorMessage === "") ?  null:<div className="alert alert-warning">{this.state.errorMessage}</div>}
                  </div>
                  <div className="mt-2">
                    <label>Observaciones</label>
                    <Form.Control type="text" placeholder="Observaciones" maxlength="100" onChange={(e)=>this.capturandoObservaciones(e)} value={this.state.observaciones} />
                  </div>
                  <div className="mt-2">
                    <label>Tiempo de entrega aproximado</label>
                    <Form.Control type="text" placeholder="Tiempo aproximado de entrega" maxlength="90" onChange={(e)=>this.capturandoTiempoAproximado(e)} value={this.state.tiempoAproximado}/>
                  </div>
                  <FuenteComponent onSelectCheckbox={this.handleSelectedConocidos.bind(this)}/>
                </Modal.Body>
                <Modal.Footer>
                      <Button variant="primary" onClick={()=> this.comment()}>Guardar</Button>
                </Modal.Footer>
              </Modal>
              <Container className="modal-articulo">
                <Modal dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={ this.state.showArticulo }
                    onHide={this.handleClose.bind(this)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Agregar artículo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Container fluid={true}>
                        <Row className="mt-3">
                          <Col md={2} lg={2} className="mr-2">
                            <Row>
                              <Form.Control type="text" value={this.state.busqueda} placeholder="Articulo a búscar" onChange={ this.changeBusqueda.bind(this)} />
                            </Row>
                          </Col>
                          {
                        ( 
                          this.state.activar  ) 
                          ?
                          
                          <Col md={2} lg={2} className="ml-2">
                            <Row>
                              <Form.Control type="text" name="busquedaAlmacen" value={this.state.busquedaAlmacen} placeholder="En almacen" onChange={ this.changeBusquedaAlmacen.bind(this)} />
                            </Row>
                          </Col>: 
                          <Col md={2} lg={2} className="ml-2">
                            <Row>
                              
                            </Row>
                          </Col>
                          }
                          
                          <Col className="text-center">
                            <ToogleSwitch title="Existencias" value={this.state.existencia} onChange={this.onChangeSwitch.bind(this)} />
                          </Col>
                          <Col>
                            <BotonesSearch clickCamera={this.handleShowQR.bind(this)} clickSearch={this.buscarArticulo.bind(this)} />
                          </Col>
                        </Row>
                        <Row>
                          <ListaArticulos articulos={this.state.articulos} clickArticulo={this.handleSaveArticulo.bind(this)} disponible={this.state.disponible} />
                        </Row>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer>
                  </Modal.Footer>
                </Modal>
            </Container>
            <Container className="modal-qr">
              <Modal size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={ this.state.showQR }
                  onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Escanear artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <Camara onScan={this.handleScanCamara} value={"Camara"}/>
                </Modal.Body>
                <Modal.Footer>
                      <Button variant="primary" onClick={this.handleClose.bind(this)}>Cerrar</Button>
                </Modal.Footer>
              </Modal>
            </Container>
         </Container>
      );
  }
 }

export default BotonesDeCirculo;