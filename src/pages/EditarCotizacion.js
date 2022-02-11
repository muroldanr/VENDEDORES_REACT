import React from 'react';
import '../components/css/editarCotizacion.css';
import Loading from '../components/Loading';
import { Container, Row, Col } from 'react-bootstrap';
import NewMenu from '../components/NewMenu';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import { Button } from 'react-bootstrap';
import Table from '../components/Table';
import Titulo from '../components/Titulo';
import NumberFormat from 'react-number-format';
import BotonesDeNumeros from '../components/BotonesDeNumeros';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import BotonesCotizacion from '../components/BotonesCotizacion';
import BotonesSearch from '../components/BotonesSearch';
import Camara from '../components/Camara';
import ListaArticulos from '../components/ListaArticulos';
import ToogleSwitch from '../components/ToogleSwitch';
import '../components/css/seguimiento.css';
import swal from 'sweetalert';

class EditarCotizacion extends React.Component {

    constructor(props) {

      super(props);


      let user = localStorage.getItem('user');
      let headers = ["","Artículo", "Descripción","Precio","Cantidad","Almacen","Notas","Acción"];

      this.initialState = {
          loading: false,
          header: [],
          data: [],
          viewData: [],
          ID: props.match.params.id,
          user: (user) ? user:'',
          headers: headers,
          headersView: [],
          showObservaciones: false,
          showComment: false,
          showArticulo: false,
          showQR: false,
          comment: '',
          idComment: '',
          tiempoAproximado: '',
          observaciones: '',
          movimiento: undefined,
          busqueda: '',
          articulos: [],
          existencia: false,
          disponible: false,
          headersAlmacenes:[],
          dataAlmacenes:[],
          showAlamacenes:false,
          Condicion: "",
      };

      this.state = this.initialState;
      this.handleScanCamara = this.handleScanCamara.bind(this);
    }

    componentDidMount() {
      this.makeHeaders();
      this.reqCargarCotizacionACarrito();
    }



    reqCargarCotizacionACarrito() {
      this.isLoading(true);
      manager.postData(routes.SET_RECARGAR_CARRITO,{
          UsuarioWeb: this.state.user,
          ID: this.state.ID
      }).then(response => {
        if (response[0] && typeof response[0] === "object") {
          let resp = response[0];
          if ( (resp.Ok === null && resp.OkRef === null) || resp.OkRef === "Ya Existe Un Carrito Abierto") {
            this.reqArticulosCotizacion();
            return;
          }

          let message = 'Error de servidor, intentelo más tarde.';

          if (resp.Ok === 10015) {
            message = 'Esta cotización ya no se puede editar';
          }

          swal({
            type: 'error',
            title: '¡Ocurrio un Error!',
            text: message,
            showCancelButton: false,
            confirmButtonText: "ok",
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((parameter) => {
            this.props.history.push('/principales');
          });
        }
      }).catch(error => {
        this.isLoading(false);
        let {code} = error;

        if (code === undefined) {
            code=500;
        }

        if(code === 401){

        } else {

        }

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

      });
    }

    reqArticulosCotizacion() {

      this.isLoading(true);

      manager.postData(routes.GET_INFO_COTIZACION,{
          UsuarioWeb: this.state.user,
          Modulo:'VTAS',
          ModuloID: this.state.ID
      }).then(response => {

          this.isLoading(false);

          if (response) {
              if (response.length > 0) {
                this.setState({
                    data: response
                });
                this.reqInfoCotizacion();
                return;
              }
          }

          swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      }).catch(error =>{

        this.isLoading(false);
        let {code} = error;

        if (code === undefined) {
            code=500;
        }

        if(code === 401){

        } else {
          swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
        }
      });
    }

    reqInfoCotizacion() {

      this.isLoading(true);

      manager.postData(routes.GET_INFO_VENTA, {
          ID: this.state.ID
      }).then(response => {
        this.isLoading(false);
        if (response.length > 0) {
          this.setState({
            movimiento: response[0]
          });
        }
        this.setData();
      })
      .catch(error =>{
        this.isLoading(false);
        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      });
    }

    reqSaveObservaciones() {
      this.isLoading(true);
      manager.postData(routes.spWebVentaActualizarCampos,{
          ID: this.state.ID,
          UsuarioWeb: this.state.user,
          Observaciones: this.state.observaciones,
          Comentarios: this.state.tiempoAproximado
      }).then(response => {
        this.isLoading(false);
        if (response && response.length > 0) {
          let resp = response[0];
          if (resp.Ok === null && resp.OkRef === null) {
            this.reqInfoCotizacion();
            return;
          }
        }

        swal("Ocurrio un Error", response[0].OkRef , "error");
      })
      .catch(error =>{
        this.isLoading(false);
        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      });
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
          articulos: response
        });
      })
      .catch(error =>{
        this.isLoading(false);
        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      });
    }

    eliminarArticulo(obj) {
      if (obj.Renlong) {
        this.eliminarArticuloRenglon(obj);
      } else {
        this.eliminarArticuloSinRenglon(obj);
      }
    }

    deshacerEliminacion(obj) {
      this.isLoading(true);
      manager.postData(routes.CREATE_PROCEDURE, {
        'ID': obj.ID ,
        'GenerarVenta': 1
      })
      .then(response => {
        this.isLoading(false);
        if (response && response.length > 0) {
          if (response[0].Message === "Ok") {
            this.reqArticulosCotizacion();
            return;
          }
        }

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      })
      .catch(error =>{
          this.isLoading(false);
          let {code} = error;
          swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
          if (code === undefined) {
            code=500;
          }
          if(code === 401){
          }else {
          }
      });
    }

    eliminarArticuloSinRenglon(obj) {

      this.isLoading(true);

      manager.postData(routes.DELETE_PRODUCTO_CARRITO,{
          ID: obj.ID
      }).then(response => {

        this.isLoading(false);

        if (response && response.length > 0) {
          let resp = response[0];
          if (resp.Message === "Ok") {
            this.reqArticulosCotizacion();
            return;
          }
        }

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      })
      .catch(error =>{
        this.isLoading(false);
        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      });
    }

    eliminarArticuloRenglon(obj) {

      this.isLoading(true);

      manager.postData(routes.DELETE_KIT_CARRITO, {
        UsuarioWeb: this.state.user,
        ID: this.state.ID,
        Renglon: obj.Renglon
      }).then(response => {

        this.isLoading(false);

        if (response && response.length > 0) {
          let resp = response[0];
          if (resp.Ok === null && resp.OkRef === null) {
            this.reqArticulosCotizacion();
            return;
          }
        }

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      })
      .catch(error =>{
        this.isLoading(false);
        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      });
    }

    eliminarCarritoCompleto(obj) {

      if (this.state.data.length < 1) {
        return;
      }

      this.isLoading(true);
      manager.postData(routes.DELETE_CARRITO,{'UsuarioWeb': localStorage.getItem('user'),'Cliente':  localStorage.getItem('clienteCliente')})
      .then(response => {
          this.isLoading(false);
          if (response && response.length > 0) {
            if (response[0].Message === "Ok") {
              this.reqArticulosCotizacion();
              return;
            }
          }
          swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      })
      .catch(error =>{
          this.isLoading(false)
          let {code} = error
          if (code === undefined) {
              code=500;
          }
          if(code === 401){

          }else {
              swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
          }
      });
    }

    actualizarCantidad(cantidad, ID) {
      this.isLoading(true);
      manager.postData(routes.CREATE_PROCEDURE,{ 'ID': ID ,'Cantidad':cantidad })
      .then(response => {
        this.isLoading(false);
        this.reqArticulosCotizacion();
        swal("Cantidad actualizada", "Cantidad actualizada con éxito", "success");
      })
      .catch(error =>{
          this.isLoading(false);
          let {code} = error;
          if (code === undefined) {
            code=500;
          }
          if(code === 401){
          }else {
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
          }
      });
    }

    handleShowComment(obj) {
      this.setState({
        showComment: true,
        comment: obj.DescripcionExtra,
        idComment: obj.ID
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

    handleShowQR() {
      this.setState({
        showQR: true
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
        showComment: false,
        showObservaciones: false,
        showArticulo: showArticulo,
        showQR: false,
        showAlamacenes : false,
      });
    }

    handleSave(event) {

      this.isLoading(true);

      manager.postData(routes.CREATE_PROCEDURE, {
        ID: this.state.idComment,
        Descripcion: this.state.comment
      })
      .then(response => {
          this.isLoading(false);
          this.reqArticulosCotizacion();
      })
      .catch(error =>{
          this.isLoading(false);
          let {code} = error;
          swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
          if (code === undefined) {
            code = 500;
          }
          if (code === undefined) {
              let code=500
              console.log(code);
          }
          if(code === 401){
              console.log(code);
          }else {
              console.log(code);
          }
      });

      this.setState({
        showComment: false,
        comment: '',
        idComment: ''
      });
    }

    handleSaveObservaciones(event) {
      this.reqSaveObservaciones();
      this.handleClose();
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


    reqBuscarArticulos() {
        this.isLoading(true);

        manager.postData(routes.GET_ARTICULOS,{
            UsuarioWeb: this.state.user,
            Articulo: this.state.busqueda,
            Disponible: this.state.existencia
        })
        .then(response => {
            this.isLoading(false);
            this.setState({
                articulo: undefined,
                articulos: response,
                articuloView: []
            });
            this.condicionalDetalle();
        })
        .catch(error =>{

            this.isLoading(false);

            let {code} = error;

            if(code===undefined){
                code = 500;
            }
            if(code === 401){}
            else {}
        });
    }

    condicionalDetalle() {
        if (this.state.articulos.length > 0) {
            if (this.state.articulos.length === 1) {
                this.setState({
                    articulo: this.state.articulos[0],
                    articulos: []
                });
                this.reqCargarPrecios();
                return;
            }

            this.handleShowArticulos();
        }
    }

    reqCargarPrecios(clickArticulo) {

        let articulo = this.state.articulo;
        console.log(clickArticulo)

        if (articulo === undefined) {

            this.setState({
                articulo: clickArticulo
            });

            articulo = clickArticulo;
        }

        this.isLoading(true);
        manager.postData(routes.GET_PRECIO_POLITICA_LISTA, {'WebUsuario': localStorage.getItem('user'), 'Articulo': articulo.Articulo, 'Almacen': articulo.Almacen })
        .then(response => {
            this.setData(response);
            this.reqCargarAlmacenes();
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

    handleShowArticulos() {
        this.setState({
            showArticulos: true
        });
    }

    handleSaveArticulo(articulo) {
      this.isLoading(true);
      manager.postData(routes.ADD_CARRITO, {
        UsuarioWeb: this.state.user,
        Cliente: this.state.movimiento.Cliente,
        Articulo: articulo.Articulo,
        Precio: articulo.PrecioLista,
        Precio2: (articulo.Precio2) ? articulo.Precio2: articulo.PrecioLista,
        Precio3: (articulo.Precio2) ? articulo.Precio3: articulo.PrecioLista,
        Cantidad: 1,
        Descripcion: '',
        Almacen: articulo.Almacen,
        Modulo: 'VTAS',
        ModuloID: this.state.ID
      })
      .then(response => {
          this.handleClose();
          this.isLoading(false);
          this.reqArticulosCotizacion();
      })
      .catch(error =>{
          this.isLoading(false);

          let {code} = error;

          if (code === undefined) {
            code = 500;
          }

          if(code === 401){
              
          }else {
              swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
          }
      });
    }

    handleSend() {
      this.isLoading(true);
      manager.postData(routes.SINCRONIZAR_COTIZACION, {
        ID: this.state.ID,
        UsuarioWeb: this.state.user
      })
      .then(response => {
          this.isLoading(false);
          if (response[0] && typeof response[0] === "object") {
            let resp = response[0];
            if (resp.Ok === null && resp.OkRef === null) {
              swal({
                type: 'success',
                title: 'Éxito',
                text: 'Operacion realizada con éxito',
                showCancelButton: false,
                confirmButtonText: "ok",
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then((parameter) => {
                this.props.history.push('/principales');
              });
            }
          }
      })
      .catch(error =>{

          this.isLoading(false);

          let {code} = error;

          if (code === undefined) {
            code = 500;
          }

          if(code === 401){
          }else {
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
          }
      });
    }

    changeComment(event) {
      let comment = event.target.value;
      this.setState({
        comment: comment
      });
    }

    changeTiempoAproximado(event) {
      let tiempo = event.target.value;
      this.setState({
        tiempoAproximado: tiempo
      });
    }

    changeObservaciones(event) {
      let observaciones = event.target.value;
      this.setState({
        observaciones: observaciones
      });
    }

    changeBusqueda(event) {
      let busqueda = event.target.value;
      this.setState({
        busqueda: busqueda
      });
    }

    onChangeSwitch(existencia) {
      this.setState({
          existencia: existencia
      });
    }

    buscarArticulo() {
      this.setState({
        disponible: this.state.existencia
      });
      if (this.state.busqueda.length > 0) {
        this.reqSearchArticulos();
      }
    }

    makeHeaders() {
      let headersView = [];
      headersView = this.state.headers.map((header, index) => <th key={header + index}>{header}</th>);
      this.setState({
        headersView: headersView
      });
    }

    setData() {

      let viewData = [];

      viewData = this.state.data.map((obj) =>
        <tr key={obj.ID} className={(obj.GenerarVenta === "0") ? "renglon-disable":''}>
          <td className="md">
            { (obj.GenerarVenta === "1") ?
              <img className="imagen" alt="" src={ routes.FILES + encodeURI(obj.Articulo) } />
              :
              <React.Fragment>Articulo eliminado de la cotización</React.Fragment>
            }
          </td>
          <td className="md">{obj.Articulo}</td>
          <td className="md">{obj.Descripcion}</td>
          <td className="md">
              <NumberFormat value={obj.Precio} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
          </td>
          <td className="md">
            { (obj.GenerarVenta === "1") ?
              <BotonesDeNumeros cantidad={obj.Cantidad} condicionG={true} count={this.actualizarCantidad.bind(this)} ID={obj.ID} />
              :
              <NumberFormat value={obj.Cantidad} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/>
            }
          </td>
          <td onClick= { (e) => this.getAlamcenDisponible(obj.Articulo,obj.ID) } className="md">
            {obj.Almacen}
          </td>
          <td className="md">
            <span className="icononota">
              {
                (obj.GenerarVenta === "1") ?
                  <i onClick= {(e) => this.handleShowComment(obj)} className={"ajustesIconos fas fa-comment-alt " + (obj.DescripcionExtra ? "comment ": "")}></i>
                  :
                  <i className="not-allowed fas fa-comment-slash" ></i>
              }
            </span>
          </td>
          <td className="md">
            <span className="iconos">
              { (obj.GenerarVenta === "1") ?
                <i className="ajustesIconos fas fa-times" onClick= {(e) => this.eliminarArticulo(obj)}></i>
                :
                <i className="ajustesIconos fas fa-undo" onClick= {(e) => this.deshacerEliminacion(obj)}></i>
              }
            </span>
          </td>
        </tr>
      );

     this.setState({
          viewData: viewData,
          Condicion : this.state.Condicion === "" ? this.state.data[0].Condicion : this.state.Condicion,
      });
    }

    isLoading(active){
      this.setState({loading: active});
    }

    getAlamcenDisponible(articulo,ID){
      this.isLoading(true);
      manager.postData(routes.DISPONIBLE_ALMACEN,{ 'UsuarioWeb':localStorage.getItem('user') ,'Articulo':articulo })
      .then(response => {
          this.setHeadersAlmacenes()
          this.setDataAlamacenes(response,ID)
          this.isLoading(false);

      })
      .catch(error =>{
          const {code} = error
          this.isLoading(false)
          if (code === undefined) {
              let code=500
              console.log(code);
          }
          if(code === 401){
              console.log(code);
          }else {
              console.log(code);
          }
      })
  }

  setHeadersAlmacenes() {
      let headers = ["", "Almacén","Cantidad"];
      let headerItems = [];

      headerItems = headers.map((title) => 
              <th key={title} ><center>{title}</center></th>
      );

      this.setState({
          headersAlmacenes: headerItems
      });
  }

  setDataAlamacenes(response,ID) {
    let objArray = []
    if(Array.isArray(response)){
      objArray = response
    }
    let data = [];
    data = objArray.map((objV) => 
        <tr key={objV.Articulo} onClick= {(e) => this.actualizarAlmacen(objV,ID)} >
          <td>{objV.Almacen ? objV.Almacen : "Sin información"}</td>
          <td>{objV.Nombre ? objV.Nombre : "Sin información"}</td>     
          <td>{objV.Disponible ? objV.Disponible : "Sin información"}</td> 
        </tr>
      );
    this.setState({
        dataAlmacenes: data,
        showAlamacenes: true,
    });
  }

  actualizarAlmacen(almacen,ID){
    console.log(almacen)
      this.isLoading(true);
      manager.postData(routes.UPDATE_ALMACEN,{ 'ID': ID ,'Almacen':almacen.Almacen})
      .then(response => {
          this.handleClose();
          this.reqCargarCotizacionACarrito();
      })
      .catch(error =>{
          const {code} = error
          this.isLoading(false)
          if (code === undefined) {
              let code=500
              console.log(code);
          }
          if(code === 401){
              console.log(code);
          }else {
              console.log(code);
          }
      })
  }

  actualizarCondicion = () => {
      let condicionLocal = "";
      if(this.state.Condicion === 'Contado'){
        condicionLocal = '12 Meses'
      }else{
        condicionLocal = 'Contado'
      }
      this.isLoading(true);
      manager.postData(routes.spWebCarritoPrecioActualizar,{ 'WebUsuario':localStorage.getItem('user'), 'ModuloID': this.state.ID ,'Condicion': condicionLocal})
      .then(response => {
          this.handleClose();
          this.setState({Condicion : condicionLocal})
          this.reqCargarCotizacionACarrito();
      })
      .catch(error =>{
          const {code} = error
          this.isLoading(false)
          if (code === undefined) {
              let code=500
              console.log(code);
          }
          if(code === 401){
              console.log(code);
          }else {
              console.log(code);
          }
      })
  }


    render() {
      console.log(this.state.viewData)
      return(
        <React.Fragment>
          <Loading active={this.state.loading}/>
          <div className="body-container" id="body_EditarCotizacion">
            <NewMenu/>
            <Titulo titulo="Editar Cotizacion"/>
            { (this.state.movimiento) ?
              <Container className="info-movimiento">
                <Row>
                  <Col md={4}>Empresa: {this.state.movimiento.Empresa}</Col>
                  <Col md={4}>Condición:                         
                        <Button className="ml-2" variant="secondary" onClick={() => this.actualizarCondicion()}>
                          {this.state.Condicion}
                        </Button> 
                        </Col>
                  <Col md={4}>{this.state.movimiento.Mov + this.state.movimiento.MovID}</Col>
                  <Col md={4}>Agente: {this.state.movimiento.NombreAgente}</Col>
                  <Col md={4}>Almacen: {this.state.movimiento.NombreAlmacen}</Col>
                  <Col md={4}>Sucursal: {this.state.movimiento.NombreSucursal}</Col>
                </Row>
              </Container>
              :
              null
            }
            <Container fluid={true}>
              <Table headers={this.state.headersView} data={this.state.viewData}/>
            </Container>
            <BotonesCotizacion
                clickComment={this.handleShowObservaciones.bind(this)}
                clickDelete={ this.eliminarCarritoCompleto.bind(this)}
                clickPlus={ this.handleShowArticulo.bind(this) }
                clickSend={ this.handleSend.bind(this) }
              />
            <Container className="modal-nota">
              <Row>
                <Modal size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.showComment}
                    onHide={this.handleClose.bind(this)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Nota</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Form.Control type="text" placeholder="Escribe tu nota aqui..." maxlength="40" name="actividad" value={this.state.comment} onChange={this.changeComment.bind(this)} />
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                          Cerrar
                        </Button>
                        <Button variant="primary" onClick={ this.handleSave.bind(this) }>
                          Guardar nota
                        </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
            </Container>
            <Container className="modal-observaciones">
              <Modal size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={ this.state.showObservaciones }
                  onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Comentarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <label className="mt-2">Tiempo aproximado de entrega</label>
                  <Form.Control type="text" value={this.state.tiempoAproximado} placeholder="Tiempo aproximado de entrega" onChange={ this.changeTiempoAproximado.bind(this)} />
                  <label className="mt-2">Observaciones</label>
                  <Form.Control type="text" value={this.state.observaciones} placeholder="Observaciones" onChange={this.changeObservaciones.bind(this)} />
                </Modal.Body>
                <Modal.Footer>
                      <Button variant="primary" onClick={this.handleSaveObservaciones.bind(this)}>Guardar</Button>
                </Modal.Footer>
              </Modal>
            </Container>
            <Container >
              <Modal 
                  dialogClassName="modal-90w"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={ this.state.showArticulo }
                  onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Container  fluid={true}>
                      <Row className="mt-3">
                        <Col>
                          <Row >
                            <Form.Control type="text" value={this.state.busqueda} placeholder="Articulo a búscar" onChange={ this.changeBusqueda.bind(this)} />
                          </Row>
                        </Col>
                        <Col className="text-center">
                          <ToogleSwitch title="Existencias" value={this.state.existencia} onChange={this.onChangeSwitch.bind(this)} />
                        </Col>
                        <Col>
                          <BotonesSearch clickCamera={this.handleShowQR.bind(this)} clickSearch={this.buscarArticulo.bind(this)} />
                        </Col>
                      </Row>
                      <Row>
                        <ListaArticulos articulos={this.state.articulos} clickArticulo={this.handleSaveArticulo.bind(this)} disponible={this.state.disponible}/>
                      </Row>
                  </Container>
                </Modal.Body>
                <Modal.Footer>
                      <Button variant="primary" onClick={this.handleClose.bind(this)}>Cerrar</Button>
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
                  <Camara onScan={this.handleScanCamara.bind(this)} value={"Camara"}/>
                </Modal.Body>
                <Modal.Footer>
                      <Button variant="primary" onClick={this.handleClose.bind(this)}>Cerrar</Button>
                </Modal.Footer>
              </Modal>
            </Container>
          </div>
          <Modal 
            dialogClassName="modal-90w"
            aria-labelledby="contained-modal-title-vcenter"
            centered show={ this.state.showAlamacenes }
            onHide={this.handleClose.bind(this)}>
                  <Modal.Header closeButton>
                       <Modal.Title>Selecciona un Almacén</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                     <Container fluid={true}>
                         <Row>
                            <Table headers={this.state.headersAlmacenes} data={this.state.dataAlmacenes}/>
                         </Row>
                     </Container>
                   </Modal.Body>
                   <Modal.Footer>
                   </Modal.Footer>
                </Modal>
        </React.Fragment>
      );
    }
}

export default EditarCotizacion;