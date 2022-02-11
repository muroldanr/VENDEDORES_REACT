import React from 'react';
import BotonesDeNumeros from '../components/BotonesDeNumeros';
import Table from '../components/Table';
import Titulo from '../components/Titulo';
import BotonesDeCirculo from '../components/BotonesDeCirculo';
import NewMenu from '../components/NewMenu';
import '../components/css/carrito.css';
import { Col,Row,Container,Button } from 'react-bootstrap';
import Loading from '../components/Loading';
import manager from '../service-manager/api';
import routes from '../service-manager/routes'
import NumberFormat from 'react-number-format';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import BotonFlotante from '../components/BotonFlotante';
import Alert from 'react-bootstrap/Alert';
import ModalClientes from '../components/ModalClientes';
import swal from 'sweetalert';
import ModalUser from '../components/ModalUser';

const cloudprint = window.cloudprint;

class Carrito extends React.Component {

  constructor(props) {

      super(props);

      let user = localStorage.getItem('user');
      let cliente = localStorage.getItem('clienteCliente');

      if (!(cliente)) {
        cliente = localStorage.getItem('clienteUsuarioCliente');
        localStorage.setItem("clienteNombre", "");
        localStorage.setItem("clienteTelefonos", "");
        localStorage.setItem("clienteeMail1", "");
        localStorage.setItem("clienteeCotizacionID", "");
        localStorage.setItem("clienteeMov", "");
      }

      let defaultCliente = localStorage.getItem('clienteUsuarioCliente');

      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);

      this.state = {
          headers: [],
          data: [],
          emptyTitulo:true,
          loading: false,
          show: false,
          nota:[],
          condicionRegular:true,
          condicionContado:false,
          condicionMeses:false,
          valorRegular:0,
          valorContado:0,
          valorMeses:0,
          user: (user) ? user:'',
          avisoModal:"",
          cantidadNueva:0,
          cliente: (cliente) ? cliente:'',
          clienteNuevo: (defaultCliente === cliente),
          condicion:true,
          envioActivado:false,
          ID: null,
          comment: null,
          showMessage: false,
          message: "",
          titleMessage: "",
          showEmailSended: false,
          dataEmail: "",
          termometro: "",
          observaciones: "",
          tiempoEstimado: "",
          moduloID: "",
          showClienteNuevo: false,
          clienteNuevoNombre: "",
          clienteNuevoEmail: "",
          clienteNuevoTelefono: "",
          clienteNuevoTelefonoContacto:"",
          conocidos: "",
          headersAlmacenes:[],
          dataAlmacenes:[],
          showAlamacenes:false,
          totalRegular: 0,
          totalMeses:0, 
          totalContado:0,
          dataArticulos:[],
          modalShowUser: true,
          monthlyDiscount:0.0,
          countedDiscount:0.0
      };
  }

  getData(){
      this.isLoading(true);
      manager.postData(routes.GET_CARRITO,{ 'Cliente': localStorage.getItem('clienteCliente'), 'UsuarioWeb': localStorage.getItem('user') })
      .then(response => {
            if (Array.isArray(response)) {
              if (response[0]["Message"]){
                this.setState({avisoModal:response[0].Message,emptyTitulo:true,loading: false})
                this.manejarMostrar()
                response = [];
                this.setData(response);
                console.log("if1")}
              else {
                if (response[0].ID) {
                  this.setState({ ID: response[0].ID,emptyTitulo:false,loading: false });
                  this.setHeaders();
                  this.setData(response);
                  console.log("if2")}
                else{
                  this.setState({avisoModal:response[0].Message,emptyTitulo:true,loading: false})
                  console.log("if3")
                  this.setData(response);}}
              }else {
              this.setState({avisoModal:response[0].Message,emptyTitulo:true,loading: false})
              console.log("if4");
              this.setData(response); 
            }
          })
      .catch(error =>{
          this.setState({emptyTitulo:true,loading: false})
          this.setData("null");
      })
  }

  getDataActualizar(){
    this.setState({ clienteNuevo : false })
    this.getData()
  }

  getDataActualizarMostrador(){
    this.setState({ clienteNuevo : true })
    this.getData() 
  }

  isLoading(active){
      this.setState({loading: active});
  }

  componentDidMount() {
    this.getData();
  }

  recibirClick = (e,objV) =>{
    this.props.history.push({
        pathname:'/productDetail',
        state:{
          valor:objV
        }
    });
  }

  eventoclick(evento, termometro, observaciones, tiempoEstimado, conocidos){
    

    let clienteNuevo;
    if(localStorage.getItem('clienteNombre') ===  "" || localStorage.getItem('clienteNombre') ===  "Cliente Mostrador" ){
      clienteNuevo = true;
    }else{
      clienteNuevo = false;
    }

    this.setState({
      termometro: termometro,
      observaciones: observaciones,
      tiempoEstimado: tiempoEstimado,
      showClienteNuevo: clienteNuevo,
      conocidos: conocidos,
    });

    if (!clienteNuevo) {
      this.setCarrito();
    }
  }

  handleChangeNuevoNombre(event) {
    let nombre = event.target.value;
    this.setState({
      clienteNuevoNombre: nombre
    });
  }

  handleChangeNuevoEmail(event) {
    let email = event.target.value;
    this.setState({
      clienteNuevoEmail: email
    });
  }

  handleChangeNuevoTelefono(event) {
    let telefono = event.target.value;
    this.setState({
      clienteNuevoTelefono: telefono
    });
  }

  handleChangeNuevoTelefonoContacto(event) {
    let telefono = event.target.value;
    console.log(telefono)
    this.setState({
      clienteNuevoTelefonoContacto: telefono
    });
  }


  onChangeCheked(event, articulo) {
    this.isLoading(true);
    manager.postData(routes.CREATE_PROCEDURE, {
      ID: articulo.ID,
      GenerarVenta: event.target.checked
    })
    .then(response => {

        this.isLoading(false);
        if (typeof response === "object" && response.length > 0) {
          if (response[0].Message && response[0].Message === "Ok") {
              this.getData();
            return;
          }
        }
        this.getData();
        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
    })
    .catch(error =>{
        this.isLoading(false);
        let {code} = error;

        if (code === undefined) {
          code = 500;
        }

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
        if(code === 401){

        }
    });
  }


  capturandoCambioNotas(event){
    let value = event.target.value;
    if (this.state.comment) {
      let updatedComment = this.state.comment;
      updatedComment.Descripcion = value;
      this.setState(updatedComment);
    }
  }

  handleClose() {
    this.setState({
      show: false,
      comment: null,
      showClienteNuevo: false,
      showAlamacenes : false,
    });
  }

  handleSave(ID) {
    this.actualizarComentario(this.state.comment);
    this.setState({
      show: false,
      comment: null
    });
  }

  actualizarData() {
    if (this.state.moduloID) {
      let termometro = null;

      if (this.state.termometro === "Caliente") {
        termometro = 3;
      } else if (this.state.termometro === "Tibio") {
        termometro = 2;
      } else {
        termometro = 1;
      }

      manager.postData(routes.SET_TERMOMETRO, {
        UsuarioWeb: this.state.user,
        ID: this.state.moduloID,
        Termometro: termometro,
        Observaciones: this.state.observaciones,
        Atencion: this.state.tiempoEstimado,
        RefCanal: this.state.conocidos
      })
      .then(response => {
        this.getData();
        this.isLoading(false);
      })
      .catch(error => {
          this.isLoading(false)
          let {code} = error
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
      return;
    }

    this.isLoading(false);
    console.log("Error al actualizar el termometro y las observaciones");
  }

  actualizarComentario(comment) {
    this.isLoading(true);
      manager.postData(routes.CREATE_PROCEDURE, comment)
      .then(response => {
          this.getData();
          this.isLoading(false);
      })
      .catch(error =>{
          this.isLoading(false);
          let {code} = error;
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
  }

  actualizarCondicion(condicion) {
    this.isLoading(true);
      manager.postData(routes.CREATE_PROCEDURE, condicion)
      .then(response => {
          this.getData();
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
      });
  }

  handleShow(ID,Descripcion) {
    this.setState({ show: true,
      Descripcion: Descripcion
     });
    this.setState({comment: {
      ID: ID,
      Descripcion: Descripcion
    }});
  }

  setHeaders() {

      let headers = ["","Artículo", "Descripción","Precio Regular","Precio Meses","Precio Contado","Cantidad","Almacén","Notas","Eliminar"];
      let headerItems = [];

      headerItems = headers.map((title) => 
              <th key={title} ><center>{title}</center></th>
      );

      this.setState({
          headers: headerItems
      });
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



  selectPrecio(objV, nuevaCondicion) {
    let condicion = {
      ID: objV.ID,
      Condicion: nuevaCondicion
    }
    this.actualizarCondicion(condicion);
  }

  classPrice(condicion, value) {
    if (condicion === value) {
      return "precio-selected";
    } else {
      return "precio-selected-disable";
    }
  }

  classPriceDescount(condicion, value) {
    if (condicion === value) {
      return "badge-custom-selected";
    } else {
      return "badge-custom";
    }
  }

  setData(response) {
      let objArray = []
      let data = [];
      let suma = 0;
      let sumaMeses = 0;
      let sumaContado = 0;
      if(Array.isArray(response)){
        objArray = response


        data = objArray.map((objV) => {
          
  
          if (objV.Condicion === null) {
            objV.Condicion = "Contado";
          }

          if (objV.GenerarVenta === "1") {
            suma = Number(suma) + (Number(objV.Cantidad) * Number(objV.Precio));
            sumaContado = Number(sumaContado) +(objV.Precio2 ? ( Number(objV.Cantidad) * Number(objV.Precio2) ):  ( Number(objV.Cantidad) * 0 ));
            sumaMeses = Number(sumaMeses) + (objV.Precio3 ? ( Number(objV.Cantidad) * Number(objV.Precio3) ):  ( Number(objV.Cantidad) * 0 ))
          }

       
           let monthlyDiscount =  ( (objV.Precio3 / objV.Precio) * 100 ) - 100;
           let countedDiscount = ( (objV.Precio2 / objV.Precio3) * 100 ) - 100;



          return <tr key={objV.ID} >
                    <td className="md">
                      <input type="checkbox" className="check" defaultChecked={(objV.GenerarVenta === "1")} onChange={ (e) => this.onChangeCheked(e, objV) }/>
                    </td>
                    <td onClick= {(e) => this.recibirClick(e,objV)} className="md"><img className="imagen" alt="articulos" src={ routes.FILES + encodeURI(objV.Articulo) } /></td>
                    <td className="md">{objV.Descripcion}</td>
                    <td className="md">
                        <NumberFormat value={objV.Precio} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
                    </td>
                    <td className="md" onClick= { (e) => this.selectPrecio(objV, "12 Meses") } className={"md precio-option " +  this.classPrice(objV.Condicion, "12 Meses") }>
                        <NumberFormat value={objV.Precio3} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
                        <div className="row justify-content-center" > 
                          <div className={"md precio-option " +  this.classPriceDescount(objV.Condicion, "12 Meses")}> <NumberFormat value={objV.DescuentoMeses} displayType={'text'} thousandSeparator={true} suffix={'%'} decimalScale={2} className="spamprecioDescuento"/></div>
                        </div>
                    </td>
                    <td  className="md" onClick= { (e) => this.selectPrecio(objV, "Contado") } className= {"md precio-option " + this.classPrice(objV.Condicion, "Contado") }>
                        <NumberFormat value={objV.Precio2} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
                        <div className="row justify-content-center">
                          <div className={"md precio-option " +  this.classPriceDescount(objV.Condicion, "Contado")}> <NumberFormat value={objV.DescContado} displayType={'text'} thousandSeparator={true} suffix={'%'} decimalScale={2} className="spamprecioDescuento"/></div>
                        </div>
                    </td>
                    <td className="md">
                        <BotonesDeNumeros cantidad={objV.Cantidad} condicionG={this.state.condicion} count={this.cambiarValoresDelCarrito.bind(this)} ID={objV.ID} />
                    </td>
                    <td onClick= { (e) => this.getAlamcenDisponible(objV.Articulo,objV.ID) } className="md">
                      {objV.Almacen}
                    </td>
                    <td className="md">
                      <span className="icononota">
                        <i onClick= {(e) => this.handleShow(objV.ID,objV.DescripcionExtra )} className={"ajustesIconos fas fa-comment-alt " + (objV.DescripcionExtra ? "comment ": "")}>
                        </i>
                      </span>
                    </td>
                    <td className="md">
                      <span className="iconos">
                        <i className="ajustesIconos fas fa-times" onClick= {(e) => this.eliminarArticulo(e,objV.ID)}>
                        </i>
                      </span>
                    </td>
            </tr>
          });
      
        data.push(
          <tr key='total'>
            <td className="md"></td>
            <td className="md"></td>
            <td className="md"><b>Sub-total</b></td>
            <td className="md">
                <NumberFormat value={this.state.valorRegular ? this.state.valorRegular : suma} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
            </td>
            <td className="md">
                <NumberFormat value={this.state.valorMeses ? this.state.valorMeses : sumaMeses} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
            </td>
            <td className="md">
                <NumberFormat value={this.state.valorContado ? this.state.valorContado : sumaContado} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
            </td>
            <td className="md">{/*<b>Total</b><*/}</td>
            <td className="md" colSpan="3">{/*<NumberFormat value={ sumaContado + sumaMeses } displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>*/}</td>
          </tr>
        );
      }

      this.setState({
          data: data,
          totalRegular: suma,
          totalMeses: sumaMeses, 
          totalContado: sumaContado ,
          dataAriculos : objArray ,
      });
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

  actualizarAlmacen(almacen,ID){
    console.log(almacen)
      this.isLoading(true);
      manager.postData(routes.UPDATE_ALMACEN,{ 'ID': ID ,'Almacen':almacen.Almacen})
      .then(response => {
          this.handleClose();
          this.getData();
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

  cambiarValoresDelCarrito(cantidad, ID){
      this.isLoading(true);
      manager.postData(routes.CREATE_PROCEDURE,{ 'ID': ID ,'Cantidad':cantidad })
      .then(response => {
          this.getData();
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

  setCarrito = (user,nuevo) => {
      this.isLoading(true);
      let dataReq = {'UsuarioWeb': this.state.user , Cliente:localStorage.getItem('clienteCliente'),Mov:'Cotizacion' };

      if (nuevo) {
        dataReq.RefNombre  = user.RefNombre;
        dataReq.RefTelefono  = user.RefTelefono;
        dataReq.PersonalTelefonos  = user.PersonalTelefonos;
        dataReq.RefEmail  = user.RefEmail;
        dataReq.RFC  = user.RFC;
        dataReq.Direccion  = user.Direccion;
        dataReq.DireccionNumero  = user.DireccionNumero;
        dataReq.DireccionNumeroInt  = user.DireccionNumeroInt;
        dataReq.Colonia  = user.Colonia;
        dataReq.Poblacion  = user.Poblacion;
        dataReq.Estado  = user.Estado;
        dataReq.CodigoPostal  = user.CodigoPostal;
        dataReq.PersonalDireccion   = user.PersonalDireccion ;
        dataReq.PersonalDireccionNumero  = user.PersonalDireccionNumero;
        dataReq.PersonalDireccionNumeroInt  = user.PersonalDireccionNumeroInt;
        dataReq.PersonalColonia  = user.PersonalColonia;
        dataReq.PersonalPoblacion  = user.PersonalPoblacion;
        dataReq.PersonalEstado = user.PersonalEstado ;
        dataReq.PersonalCodigoPostal  = user.PersonalCodigoPostal;

        localStorage.setItem('clienteTelefonos',user.RefTelefono);
      }

      manager.postData(routes.SAVE_CARRITO, dataReq)
      .then(response => {
        var titleMessage = 'Error';
          if (response[0] && typeof response[0] === "object") {
            if (response[0].Ok === null) {
              titleMessage = "Cotización creada con éxito";
              this.setState({
                moduloID: response[0].ModuloID,
                showMessage: true
              });
              this.actualizarData();
            } else {
              swal("Ocurrio un Error", "Existe un problema \n\n" + (response[0].OkRef ? response[0].OkRef : ""), "error");
              this.getData();
              this.isLoading(false)
            }
          }

          this.setState({
            message: response[0].OkRef,
            titleMessage: titleMessage,
            data: []
          });
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

  closeMessage() {
    this.setState({
      showMessage: false,
      message: "",
      titleMessage: "",
      data: []
    });
    this.getData();
  }

  closeEmailSended() {
    this.setState({
      showEmailSended: false,
      dataEmail: ""
    });
  }

  comentario(observaciones, tiempoEstimado) {
    this.setState({
      observaciones: observaciones,
      tiempoEstimado: tiempoEstimado
    });
  }

  eliminarArticulo(e,ID){
    this.isLoading(true);
    console.log(ID);
    manager.postData(routes.DELETE_PRODUCTO_CARRITO,{ 'ID': ID })
    .then(response => {
        this.getData();
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




  eliminarCarritoCompleto(e,ID){
    this.isLoading(true);
    manager.postData(routes.DELETE_CARRITO,{'UsuarioWeb': localStorage.getItem('user'),'Cliente':  localStorage.getItem('clienteCliente') })
    .then(response => {
        this.isLoading(false);
        window.location.reload();
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

  enviarEmail(user, cliente) {
    this.isLoading(true);
    manager.getData(routes.PDF_SEND + this.state.moduloID +"/enviar")
    .then(response => {
      this.isLoading(false);
      if (typeof response === "object" && response.data) {
        let resp = response.data;
        if (resp.Message && resp.Message === "Ok") {
          swal("Documento enviado con éxito", "El documento se envío con éxito al cliente", "success");
        } else {
          swal("Ocurrio un Error!", (resp.Error) ?  resp.Error:"Error al generar el pdf, contacte a su administrador", "error");
        }
        return;
      }

      swal("Ocurrio un Error!", "Error al generar el pdf, contacte a su administrador", "error");
    })
    .catch(error =>{
      this.isLoading(false);
      swal("Ocurrio un Error!", "Error al generar el pdf, contacte a su administrador", "error");
    });
  }

  downloadPdf(accion) {
    this.isLoading(true);
    let nombreCliente = this.limpiarNombreCliente();
    console.log("fileName"+accion+":Cotizacion_"+nombreCliente+"_"+this.state.moduloID+".pdf");
    manager.getData(routes.PDF_SEND + this.state.moduloID +"/generarFirma")
    .then(response => {
      if (typeof response === "object") {
        let url = "data:application/pdf;base64," + escape(response.data);
        this.openLink(url, "Cotizacion_" + nombreCliente + "_" + this.state.moduloID + ".pdf");
        this.isLoading(false);
      }
      this.isLoading(false);
    })
    .catch(error =>{
      this.isLoading(false);
      swal("Ocurrio un Error!", "Error al generar el pdf, contacte a su administrador", "error");
    });
  }

  
  limpiarNombreCliente() {
    let nombreCliente = localStorage.getItem("clienteNombre");

    if (this.state.clienteNuevoNombre) {
      nombreCliente = this.state.clienteNuevoNombre;
    }

    if (!(nombreCliente)) {
      nombreCliente = "desconocido";
    }

    return nombreCliente.replace(/ /g, "_");
  }

  printPdf(event) {

    event.preventDefault();

    this.isLoading(true);
    manager.getData(routes.PDF_SEND + this.state.ID +"/generarFirma")
    .then(response => {
      if (typeof response === "object") {
        //let url = "data:application/pdf;base64," + escape(response.data);
        //let html = '<embed width="100%" "height=100%" type="application/pdf" src="'+ url +'" ></embed>'
        //var openWindow = window.open(url,"_blank");
        //openWindow.document.write(html);
        //openWindow.print();
        //printJS({printable: response.data, type: 'pdf', base64: true});
        var gadget = new cloudprint.Gadget();
        gadget.setPrintDocument("application/pdf", "Impresión", response.data, 'base64');
        gadget.openPrintDialog();
      }
      this.isLoading(false);
    })
    .catch(error =>{
      this.isLoading(false);
      swal("Ocurrio un Error!", "Error al generar el pdf, contacte a su administrador", "error");
    });
  }

  stringWhatsapp() {
    let telefonos = localStorage.getItem('clienteTelefonos');

   /* if (this.state.clienteNuevo) {
      telefonos = this.state.clienteNuevoTelefono;
    }*/

    if (telefonos === null) {
      telefonos = "";
    }

    let mensaje = "Hola, buen día. Adjunto la cotización de los muebles que vio en nuestra tienda.";
    let lada = '521';

    if (telefonos) {
      this.openLink('https://wa.me/'+ lada + telefonos + '?text=' + encodeURI(mensaje));
      return
    }

    swal("Ocurrio un Error!", "El teléfono del cliente no parece estar configurado", "error");
  }

  openLink(url, name) {
    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    if (name) {
      downloadLink.download = name;
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  handleClickClientes(active) {
    this.setState({mostrar: active});
  }

  modalClose = () =>
  { 
      this.setState({ modalShowUser: false })
  };


  userSet = (user) =>{
    this.handleClose()
    this.setCarrito(user,true);
  }

  render() {
    let href = '#';
    return (
        <div>
            <Loading active={this.state.loading}/>
            <div>
                <NewMenu/> 
                <div className="container-fluid" id="body_principales-a">
                     <Titulo titulo="Carrito"/>
                     <Col md={12}  lg={12} xl={12}>
                       { (this.state.cliente === null) ? <Alert key="info-alert" variant="info"> Es necesario seleccionar un cliente </Alert>: null }
                       <Table id="tablacarrito" headers={this.state.headers} data={this.state.data}/>
                     </Col>
                     <Row >
                       <Col className="sm-9 mt-4" xs={12}>
                          <BotonesDeCirculo
                            toComment={this.comentario.bind(this) }
                            eliminarCarrito={(e)=>{this.eliminarCarritoCompleto(e,this.state.ID)}}
                            data={this.getData.bind(this)}
                            history={this.props.history}
                            click={this.eventoclick.bind(this)}
                            validacion={this.state.emptyTitulo}
                            isLoading={this.isLoading.bind(this)}
                            observaciones={this.state.observaciones}
                            tiempoAproximado={this.state.tiempoEstimado}
                            />
                       </Col>
                       <Col sm={3}>
                          <ModalClientes mostrar={this.state.mostrar} isCarrito={true} isActualizado={() => this.getDataActualizar()} loading={this.isLoading.bind(this)} isShow={this.handleClickClientes.bind(this)}/>
                          <BotonFlotante onClickClientes={this.handleClickClientes.bind(this)} envioActivado={true} loading={this.isLoading.bind(this)} isActualizado={() => this.getDataActualizarMostrador()} getenviarEmail={this.enviarEmail.bind(this)}/>
                       </Col>
                     </Row>
                </div>
            </div>
                <Modal size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.show}
                    onHide={this.handleClose}>
                  <Modal.Header closeButton>
                      <Modal.Title>Nota</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Form.Control type="email" placeholder="Escribe tu nota aqui..." maxlength="40" value={this.state.Descripcion} name="actividad" onChange={this.capturandoCambioNotas.bind(this)} />
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
                <Modal size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.showMessage}
                    onHide={this.closeMessage.bind(this)} >
                  <Modal.Header closeButton>
                      <Modal.Title>{this.state.titleMessage }</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <p>{this.state.message}</p>
                      <div>
                        { (this.state.moduloID !== "") ?
                            <React.Fragment>
                              <Row>
                                <Col className="text-center">
                                  <button className="botoncirculo btn btn-primary" onClick={ this.stringWhatsapp.bind(this) }>
                                    <a className="link" href={href}  >
                                      <i className="fab fa-whatsapp"></i>
                                    </a>
                                  </button>
                                </Col>
                                <Col className="text-center">
                                  <button className="botoncirculo btn btn-primary" onClick={this.enviarEmail.bind(this)}>
                                    <a className="link" href={ href } onClick={(e) => { e.preventDefault(); }}>
                                      <i className="far fa-envelope-open"></i>
                                    </a>
                                  </button>
                                </Col>
                                <Col className="text-center">
                                  <button className="botoncirculo btn btn-primary" onClick={ (e) => this.downloadPdf("Descarga")}>
                                    <a className="link" href={href}  >
                                      <i className="fa fa-file-pdf"></i>
                                    </a>
                                  </button>
                                </Col>
                                <Col className="text-center">
                                  <button className="botoncirculo btn btn-primary" onClick={(e) =>  this.downloadPdf("Imprimir")}>
                                    <a className="link" href={href}  >
                                      <i className="fa fa-print"></i>
                                    </a>
                                  </button>
                                </Col>
                              </Row>
                            </React.Fragment>
                            :
                            null
                        }
                      </div>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeMessage.bind(this)}>
                          Cerrar
                        </Button>
                  </Modal.Footer>
                </Modal>
                {/*                
                <Modal size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.showClienteNuevo}
                    onHide={this.handleClose.bind(this)} >
                  <Modal.Header closeButton>
                      <Modal.Title>Datos del cliente</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {(this.state.message) ? <p className="alert alert-warning">{this.state.message}</p>: null}
                      <Form.Control className="m-2" type="text" placeholder="Nombre" name="nombre" onChange={this.handleChangeNuevoNombre.bind(this)} />
                      <Form.Control className="m-2" type="email" placeholder="Correo electrónico" name="email" onChange={this.handleChangeNuevoEmail.bind(this)} />
                      <Form.Control className="m-2" type="phone" placeholder="Teléfono principal" name="phone" onChange={this.handleChangeNuevoTelefono.bind(this)} />
                      <Form.Control className="m-2" type="phone" placeholder="Teléfono contacto" name="phoneC" onChange={this.handleChangeNuevoTelefonoContacto.bind(this)} />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleSaveClienteNuevo.bind(this)}>
                      Guardar
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>   
                */} 
                <Modal size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.showEmailSended}
                    onHide={this.closeEmailSended.bind(this)} >
                  <Modal.Header closeButton>
                      <Modal.Title>Información de la solicitud</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {this.state.dataEmail}
                  </Modal.Body>
                  <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeEmailSended.bind(this)}>
                          Cerrar
                        </Button>
                  </Modal.Footer>
                </Modal>
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
                </Modal> 
                <ModalUser
                    show={this.state.showClienteNuevo}
                    onHide={this.handleClose}
                    carrito={true}
                    user={this.userSet}
                />              
        </div>
    );
  }
}
export default Carrito;