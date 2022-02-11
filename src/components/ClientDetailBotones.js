import React from 'react';
import './css/clientDetail.css';
import '../components/css/carrito.css';
import {Container, Row, Col } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Table from '../components/Table';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import NumberFormat from 'react-number-format';
import StatusComponent from '../components/StatusComponent';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import ModalAvanzar from '../components/ModalAvanzar';
import swal from 'sweetalert';
import Termometro from '../components/Termometro';
import ListaActividadesMov from '../components/ListaActividadesMov';
import ModalDescuento from '../components/ModalDescuento';
import moment from 'moment';

const cloudprint = window.cloudprint;

class ClientDetailBotones extends React.Component {
    constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

        this.state = {
            headers: [],
            headersModal:[],
            headersCotizaciones:[],
            dataCotizaciones:[],
            loading: false,
            condicionalSpiner:false,
            condicionalSpinerCotizaciones:false,
            show: false,
            mostrar:false,
            data: [],
            dataModal:[],
            objetoCotizaciones:[],
            user: (user) ? user:'',
            idCotizacion:"",
            nombre:"",
            telefono:"",
            correo:"",
            idCliente:"",
            ID:"",
            mov:"",
            movID:"",
            termometroID: undefined,
            showTermometro: false,
            mostrarActividades: false,
            showModalDescuento: false,
            titulo:""
        };
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.manejarMostrar = this.manejarMostrar.bind(this);
      this.manejarCerrar = this.manejarCerrar.bind(this);
      this.manejarCerrarBoton = this.manejarCerrarBoton.bind(this);  
      this.handleClickAvanzar = this.handleClickAvanzar.bind(this);   
    }

    handleClose() {
        this.setState({ show: false,isActivity: false });
    }

    handleShow(e,mov) {

        let isMov = false;
        let clienteNombre = localStorage.getItem('clienteNombre');
        let telefonos = localStorage.getItem('clienteTelefonos');
        let email = localStorage.getItem('clienteeMail1');
        let Cliente = localStorage.getItem('clienteCliente');

        if(mov.Mov === "Cotizacion") {
            isMov = true
        }

        if (clienteNombre === "null" || clienteNombre === "" || clienteNombre === null) {
            clienteNombre = "Sin información";
        }

        if (telefonos === "null" || telefonos === "" || telefonos === null) {
            telefonos = "Sin información";
        }

        if (email === "null" || email === "" || email === null) {
            email = "Sin información";
        }

        this.setState({
          nombre: clienteNombre,
          telefono: telefonos,
          correo: email,
          ID: mov.ID,
          idCliente: Cliente,
          isCotizacion: isMov,
          mov: mov.Mov,
          movID: mov.MovID,
        });
        this.detallesDeCotizacion(mov.ID);   
    }

    showActividades(e, mov) {
      this.setState({
        mov: mov.Mov,
        movID: mov.MovID,
        mostrarActividades: true
      });
    }

    handleCloseActividades() {
        this.setState({
            mostrarActividades: false
        });
    }

    handleClickAvanzarShow(active){
        this.setState({mostrar: active});  
    }

    handleClickAvanzar(active) {
        this.setState({mostrar: active});
    }

    avanzarFinish(){
        this.setState({mostrar: false});
        this.handleClose();
        this.datosCotizaciones()
    }

    detallesDeCotizacion(ID) {
        this.isLoading(true);
        manager.postData(routes.GET_PEDIDOS_DETALLE,{'ID': ID})
        .then(response => {
          this.cabeceraTablaModalCotizaciones();
          this.dataTablaModalCotizaciones(response);
          this.isLoading(false);
          this.setState({
            show: true
          });
        })
        .catch(error =>{

            let {code} = error;
            this.isLoading(false);

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){

            }
        })
    }

    manejarMostrar(idObjeto) {
        this.setState({ mostrar: true });
        this.setState({idCotizacion:idObjeto});
    }

    manejarCerrar() {
        this.setState({ mostrar: false });
    }

    manejarCerrarBoton(id) {
        this.setState({ mostrar: false });
        this.props.history.push('/editarcotizacion/'+id);
    }

    isLoading(active){
        //this.setState({loading: active});
        this.props.loading(active);
    }

    formatFecha(fecha){
        if (fecha){
            let dateObject = new Date(fecha);
            let formatted_date = dateObject.getDate() + "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear(); 
            return formatted_date
        } else {
            return "Sin información";
        }
    }
    /* ACTIVIDADES*/
    datosActividad(){
        this.isLoading(true);
        manager.postData(routes.GET_ACTIVIDADES,{'WebUsuario':this.state.user,'Cliente':localStorage.getItem('clienteCliente')})
        .then(response => {
           this.setHeadersActividades();
           this.setDataActividades(response);
        })
        .catch(error =>{

            this.isLoading(false);
            let {code} = error;

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(code === 401) {

            }
        })

    }

    /*COTIZACIONES*/
    datosCotizaciones(){
        this.isLoading(true);
        manager.postData(routes.GET_COTIZACIONES,{'Empresa':localStorage.getItem('empresa'),'Cliente':localStorage.getItem('clienteCliente')})
        .then(response => {
            this.setHeadersCotizaciones();
            this.setDataCotizaciones(response);
            this.isLoading(false);
        })
        .catch(error => {

            this.isLoading(false)
            let {code} = error;

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){

            }
        })
    }

    registrarActividad(){
        this.setNewClient()
        localStorage.setItem("clienteCliente", this.state.idCliente);
        localStorage.setItem("clienteNombre", this.state.nombre);
        localStorage.setItem("clienteTelefonos",  this.state.telefono);
        localStorage.setItem("clienteeMail1", this.state.correo);
        localStorage.setItem("clienteeCotizacion", this.state.ID);
        localStorage.setItem("clienteeCotizacionID", this.state.movID);
        localStorage.setItem("clienteeMov", this.state.mov);
        this.props.history.push({
            pathname:'/agenda'
        });
    }

    setNewClient(){
        var recentClients = []
        let recientes = localStorage.getItem('recentClients'); 

        if(recientes){
            recentClients = JSON.parse(recientes);
        }

        let cliente = {
            Nombre: this.state.nombre ? this.state.nombre : "",
            Cliente: this.state.idCliente ? this.state.idCliente : "" ,
            Telefonos: this.state.telefono ? this.state.telefono : "",
            eMail1: this.state.correo ? this.state.correo : "",
            clienteeCotizacion: this.state.ID ? this.state.ID : "",
            clienteeCotizacionID: this.state.movID ? this.state.movID : "",
            clienteeMov: this.state.mov? this.state.mov : "",
        }
        for (var i = 0; i < recentClients.length; i++) {
                if(recentClients[i].Cliente === cliente.Cliente ){
                    recentClients.splice(i, 1); 
                }
            }
        recentClients.unshift(cliente);
        var recentClientsNew = recentClients.slice(0, 6);
        localStorage.setItem('recentClients', JSON.stringify(recentClientsNew));
    }


  cabeceraTablaModalCotizaciones(){
    let headers = ["Articulo", "Descripción", "Cantidad","Precio", "Total"];
    let headerItems = [];
     headerItems = headers.map((title, index) =>
        <th key={title + index}>{title}</th>
    );
    this.setState({ headersCotizaciones: headerItems});
  }    


  dataTablaModalCotizaciones(arrayDetallesDeCotizaciones){        
      let objArray = arrayDetallesDeCotizaciones      
      let data = []; 
       data = objArray.map((objV, index) =>
          <tr key={objV.Articulo + index}>
              <td>{objV.Articulo ? objV.Articulo : "Sin información"}</td>
              <td>{objV.Descripcion1 ? objV.Descripcion1 : "Sin información"}</td>
              <td><NumberFormat value={objV.Cantidad ? objV.Cantidad : "Sin información"} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/></td>
              <td className="preciosDeModalBotones"><NumberFormat value={objV.Precio ? objV.Precio : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>
              <td className="preciosDeModalBotones"><NumberFormat value={objV.TotalNeto ? objV.TotalNeto : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>
          </tr>
      );
      this.setState({dataCotizaciones: data});
  }

    /*COMPRAS*/
    datosCompras(){
        this.isLoading(true);
        manager.postData(routes.GET_COMPRAS,{'Empresa':localStorage.getItem('empresa'),'Cliente':localStorage.getItem('clienteCliente')})
        .then(response => {
            this.setHeadersCompras();
            this.setDataCompras(response);
        })
        .catch(error =>{

            let {code} = error;
            this.isLoading(false)

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){
            }
        })
    }

    /*EMBARQUES*/
    datosEmbarques(){
        this.isLoading(true);
        manager.postData(routes.GET_EMBARQUES,{'Empresa':localStorage.getItem('empresa'),'Cliente':localStorage.getItem('clienteCliente')})
        .then(response => {
           this.setHeadersEmbarques();
           this.setDataEmbarques(response);
        })
        .catch(error =>{

            let {code} = error;
            this.isLoading(false)

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(error.code === 401){
                
            }
        });
    }
    /*ESTADO DE CUENTA*/
    datosEstadoCuenta(){
        this.isLoading(true);
        manager.postData(routes.GET_CXC_PENDIENTES,{'Empresa':localStorage.getItem('empresa'),'Cliente':localStorage.getItem('clienteCliente')})
        .then(response => {
          this.setHeadersCuentas();
          this.setDataCuentas(response);
        })
        .catch(error =>{

            let {code} = error;
            this.isLoading(false);

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){
                
            }
        })
    }

        /*PEDIDOS*/
    datosPedidos(){
        manager.postData(routes.GET_PEDIDOS,{'Empresa':localStorage.getItem('empresa'), 'Cliente':localStorage.getItem('clienteCliente')})
        .then(response => {
          this.setHeadersPedidos();
          this.setDataPedidos(response);
        })
        .catch(error =>{

            let {code} = error;
            this.isLoading(false)

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }
            if(code === 401){

            }
        });
    }

           /*SALDO PENDIENTE*/
           datosSaldo(){
            manager.postData(routes.spWebVentaPendienteSaldoCte,{'WebUsuario':localStorage.getItem('user'),'Mov':'0', 'Cte':localStorage.getItem('clienteCliente')})
            .then(response => {
              this.setHeadersSaldo();
              this.setDataSaldo(response);
            })
            .catch(error =>{
    
                let {code} = error;
                this.isLoading(false)
    
                swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
    
                if (code === undefined) {
                    code = 500;
                }
                if(code === 401){
    
                }
            });
        }

    /* Tabla del modal detalles de pedido*/
    cabeceraTablaModal(){
        let headers = ["Articulo", "Descripción", "Cantidad","Precio", "Total"];

        let headerItems = [];

         headerItems = headers.map((title, index) =>
            <th key={title + index} className="cabeceraDeModalBotones">{title}</th>
        );

        this.setState({
            headersModal: headerItems
        });

    }  

    handleChange  = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
  


    dataTablaModal(arrayDetallesDePedido){        
        let objArray = arrayDetallesDePedido      
        let data = []; 
         data = objArray.map((objV, index) =>
            <tr key={objV.Articulo + index} className="cabeceraDeModalBotones">
                <td>{objV.Articulo ? objV.Articulo : "Sin información"}</td>
                <td>{objV.Descripcion1 ? objV.Descripcion1 : "Sin información"}</td>
                <td><NumberFormat value={objV.Cantidad ? objV.Cantidad : "Sin información"} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/></td>
                <td className="preciosDeModalBotones"><NumberFormat value={objV.Precio ? objV.Precio : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>
              <td className="preciosDeModalBotones"><NumberFormat value={objV.TotalNeto ? objV.TotalNeto : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>
            </tr>
        );
        this.setState({
            dataModal: data,loading:false
        });
    }


     /*Tabla Actividades*/
    setHeadersActividades() {
        let headers = ["Movimiento","Vendedor", "Que", "Cuando", "Motivo", "Respuesta"];
        let headerItems = [];

        headerItems = headers.map((title, index) =>
            <th key={title + index}>{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }
    
    setDataActividades(arrayActividad) {
        let objArray = arrayActividad
        if (!objArray) {
            objArray = [];
        }
        let data = [];        
        data = objArray.map((objV, index) =>
            <tr key={objV.Titulo + index}>
                <td>{objV.Origen ? objV.Origen+" "+objV.OrigenID  : "Sin información"}</td>
                <td>{objV.Nombre ? objV.Nombre : "Sin información"}</td>
                <td>{objV.Medio ? objV.Medio : "Sin información"}</td>
                <td>{this.formatFecha(objV.FechaEmision)}</td>
                <td>{objV.Titulo ? objV.Titulo : "Sin información"}</td>
                <td>{objV.Respuesta ? objV.Respuesta : "Sin información"}</td>
            </tr>
        );
        this.setState({
            data: data,loading:false
        });
    }

/*Tabla Cotizaciones*/
    setHeadersCotizaciones() {
        let headers = ["MovID", "Estatus","FechaEmision", "Sucursal", "Termomentro", "Última actividad"];

        let headerItems = [];

        headerItems = headers.map((title, index) =>
            <th key={title + index}>{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }

    setDataCotizaciones(arrayCotizaciones) {
        let objArray = arrayCotizaciones
        let data = [];
        data = objArray.map((objV) =>                
            <tr key={objV.MovID}>
               {/* 
                <td onClick= {(e) => this.handleShow(e,objV)} >{objV.Mov+objV.MovID? objV.Mov+" "+objV.MovID : "Sin información"}</td>
                <td onClick= {(e) => this.handleShow(e,objV)} >{objV.Estatus ? objV.Estatus : "Sin información"}</td>
                <td onClick= {(e) => this.handleShow(e,objV)} >{this.formatFecha(objV.FechaEmision)}</td>
                <td onClick= {(e) => this.handleShow(e,objV)} >{objV.Nombre ? objV.Nombre : "Sin información"}</td>
                <td onClick= {(e) => this.openModalTermometro(objV.ID)} ><center><StatusComponent value={objV.Termometro ? objV.Termometro : "Sin información"}/></center></td>
    <td onClick= {(e) => this.showActividades(e,objV)}>{objV.UltimaActividad ? objV.UltimaActividad : "Sin información"}</td>
                */}

                <td  >{objV.Mov+objV.MovID? objV.Mov+" "+objV.MovID : "Sin información"}</td>
                <td  >{objV.Estatus ? objV.Estatus : "Sin información"}</td>
                <td  >{this.formatFecha(objV.FechaEmision)}</td>
                <td  >{objV.Nombre ? objV.Nombre : "Sin información"}</td>
                <td  ><center><StatusComponent value={objV.Termometro ? objV.Termometro : "Sin información"}/></center></td>
                <td  >{objV.UltimaActividad ? objV.UltimaActividad : "Sin información"}</td>
            </tr>
        );
        this.setState({
            data: data
        });
    }
/*Tabla Compras */
    setHeadersCompras() {
        let headers = ["Articulo","Descripcion", "Fecha", "Sucursal", "Pagado", "Forma"];

        let headerItems = [];

        headerItems = headers.map((title, index) =>
            <th key={title + index}>{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }

    setDataCompras(arrayCompras) {
        let objArray = arrayCompras
        let data = []; 

         data = objArray.map((objV, index) =>
            <tr key={objV.Articulo + index}>
                <td>{objV.Articulo ? objV.Articulo : "Sin información"}</td>
                <td>{objV.Descripcion ? objV.Descripcion : "Sin información"}</td>  
                <td>{this.formatFecha(objV.FechaEmision)}</td>
                <td>{objV.Nombre ? objV.Nombre : "Sin información"}</td>
                <td><NumberFormat value={objV.ImporteTotal ? objV.ImporteTotal : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '}  decimalScale={2} className="spamprecio"/></td>
                <td>{objV.FormaPago ? objV.FormaPago : "Sin información"}</td>                             
            </tr>
        );

        this.setState({
            data: data,
            loading:false
        });
    }
/*Tabla Embarques */
    setHeadersEmbarques() {
        let headers = ["Articulo","Cantidad", "Fecha", "Llega","Estatus", "Factura"];

        let headerItems = [];

        headerItems = headers.map((title, index) =>
            <th key={title + index} >{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }

    setDataEmbarques(arrayEmbarques) {
        let objArray = arrayEmbarques 
        console.log(objArray)       
        let data = []; 
         data = objArray.map((objV, index) =>
            <tr key={objV.MovID + index}>
                <td>{objV.Descripcion1 ? objV.Descripcion1 : "Sin información"}</td>
                <td><NumberFormat value={objV.Cantidad ? objV.Cantidad : "Sin información"} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/></td>
                <td>{this.formatFecha(objV.EmbarqueFecha)}</td>
                <td>{this.formatFecha(objV.FechaRequerida)}</td>
                <td>{objV.Estado ? objV.Estado : "Sin información"}</td>
                <td>{objV.MovID ? objV.MovID  : "Sin información"}</td>                             
            </tr>
        );
        this.setState({
            data: data,loading:false
        });
    }
    /* Tabla Estados de Cuenta */
    setHeadersCuentas(){
        let headers = ["Documento", "Monto", "Saldo"];

        let headerItems = [];

         headerItems = headers.map((title) =>
            <th>{title}</th>
        );

        this.setState({
            headers: headerItems
        });

    }    


    setDataCuentas(arrayEstadoCuenta){        
        let objArray = arrayEstadoCuenta 
        console.log(objArray)       
        let data = []; 
         data = objArray.map((objV, index) =>
            <tr key={objV.Documento + index}>
                <td>{objV.Documento ? objV.Documento : "Sin información"}</td>
                <td><NumberFormat value={objV.Monto ? objV.Monto : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>
                <td><NumberFormat value={objV.Saldo ? objV.Saldo : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>                                          
            </tr>
        );
        this.setState({
            data: data,loading:false
        });
    }

       /*Tabla Pedidos */
    setHeadersPedidos(){
        let headers = ["Saldo", "Sucursal", "Fecha de emisión", "Movimiento"];

        let headerItems = [];

         headerItems = headers.map((title, index) =>
            <th key={title + index} >{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }  

       /*Tabla Pedidos */
       setHeadersSaldo(){
        //let headers = ["Nombre", "E-mail", "Telefono", "Saldo"];
       // let   headers = ["Movimiento", "Fecha","Estatus","Última actividad","Descuento","Saldo"];
        let   headers = ["Movimiento", "Fecha","Estatus","Descuento","Saldo"];

        let headerItems = [];

         headerItems = headers.map((title, index) =>
            <th key={title + index} >{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    } 

    setDataPedidos(arrayPedidos){
        let objArray = arrayPedidos       
        let data = []; 
         data = objArray.map((objV, index) =>
            <tr key={objV.MovID + index} onClick= {(e) => this.handleShow(e,objV)}>
                <td>{objV.Estatus ? objV.Estatus : "Sin información"}</td>
                <td>{objV.Nombre ? objV.Nombre : "Sin información"}</td>
                <td>{objV.FechaEmision ? this.formatFecha(objV.FechaEmision) : "Sin información"}</td>                                  
                <td>{objV.Mov + objV.MovID ? objV.Mov + " - " + objV.MovID: "Sin información"}</td>                             
            </tr>
        );

        this.setState({
            data: data,loading:false
        });
    } 

    setDataSaldo(arrayPedidos){
        let objArray = arrayPedidos       
        let data = []; 
         data = objArray.map((objV, index) =>
            <tr key={index}>
                <td onClick= {(e) => this.handleShow(e,objV)} >{objV.Mov +" "+objV.MovID}</td>  
                <td onClick= {(e) => this.handleShow(e,objV)}>{this.formatFecha(objV.FechaEmision)}</td>   
                <td onClick= {(e) => this.handleShow(e,objV)}>{objV.Estatus ? objV.Estatus : "Sin información"}</td>    
                 {/*
                <td onClick= {(e) => this.showActividades(e,objV)}>
                <h6>
                    <span className="icononotaInfo">
                            <i onClick= {(e) => this.showActividades(e,objV)} className="fas fa-eye" ></i>
                    </span>
                    <div>  {objV.UltimaActividad ? objV.UltimaActividad : "Sin información"} </div>
                </h6> 
                </td>
                */}

                <td onClick= {(e) => this.showActividades(e,objV)}>{objV.DescuentoEstatus ? objV.DescuentoEstatus : "Sin información"}</td>
                <td onClick= {(e) => this.handleShow(e,objV)}><NumberFormat value={objV.Saldo} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>              
               {/*
                <td className="md">
                <span className="icononota">
                    <i onClick= {(e) => this.handleClickContacto(e,objV)} className="ajustesIconos fas fa-headset" >
                    </i>
                </span>
                </td> */}
            </tr>
        );

        this.setState({
            data: data,loading:false
        });
    } 

    /*Funciones*/

    clickActividad = () => {
        //this.setHeadersActividades();
        //this.setDataActividades();
        this.datosActividad()
        this.props.onClickOption('actividad');
    }

    clickCotizacion = () => {
        this.datosCotizaciones();
        this.props.onClickOption('cotizacion');
    }

    clickCompras = () => {
        this.datosCompras();        
        this.props.onClickOption('compras');
    }

    clickEmbarques = () => {
       this.datosEmbarques();
       this.props.onClickOption('embarques');
    }
    clickCuenta = () => {
       this.datosEstadoCuenta();
       this.props.onClickOption('cuenta');
    }

    clickPedidos = () => {
       this.datosPedidos();
       this.props.onClickOption('pedidos');
    }

    clickSaldoPendiente = () => {
        //CHECKPOINT 
        this.datosSaldo();
        this.props.onClickOption('saldo');
     }

  
  /*** DESCARGAR PDF ***/
  downloadPdf(event, documentName) {

    event.preventDefault();

    this.isLoading(true);
    manager.getData(routes.PDF_SEND + this.state.ID +"/generarFirma")
    .then(response => {
      if (typeof response === "object") {
        let nombreCliente = this.limpiarNombreCliente();
        swal("Documento generado con éxito", "El documento fue generado con éxito", "success");
        let url = "data:application/pdf;base64," + escape(response.data);
        this.openLink(url, documentName+ "_" + nombreCliente + "_" +this.state.ID + ".pdf");
      }
      this.isLoading(false);
    })
    .catch(error =>{
      this.isLoading(false);
      swal("Ocurrio un Error!", "Error al generar el pdf, contacte a su administrador", "error");
    });
  }

  limpiarNombreCliente() {

    let nombreCliente = this.state.nombre;

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
        //var openWindow = window.open(url, "_blank");
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

  enviarEmail(user, cliente) {
    this.isLoading(true);
    manager.getData(routes.PDF_SEND + this.state.ID +"/enviar")
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

  /*** DESCARGAR PDF ***/


  /*** Logica de termometro ***/
  openModalTermometro(ID) {
    this.setState({
      termometroID: ID,
      showTermometro: true
    });
  }

  updateTermometro(valor) {

    let termometro = 0;

    if (valor === "Caliente") {
      termometro = 3;
    } else if (valor === "Tibio") {
      termometro = 2;
    } else {
      termometro = 1;
    }

    if (this.state.termometroID) {
      this.reqActualizarTermometro(termometro);
    }
  }

  reqActualizarTermometro(termometro) {
    this.isLoading(true);
      manager.postData(routes.SET_TERMOMETRO,{
        UsuarioWeb: this.state.user,
        'ID': this.state.termometroID,
        Termometro: termometro
      })
      .then(response => {
        this.isLoading(false);
        swal("Termómetro actualizado", "Termómetro actualizada con éxito", "success");
        this.handleCloseTermometro();
        this.datosCotizaciones();
      })
      .catch(error =>{

          this.isLoading(false);
          let {code} = error;

          swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

          if (code === undefined) {
            code=500;
          }

          if(code === 401){

          }
      });
  }

  handleCloseTermometro() {
    this.setState({
      termometroID: undefined,
      showTermometro: false
    });
  }
  /*** FIN lógica de termometro ***/

  showDescuento() {
    this.setState({
      showModalDescuento: true
    });
  }

  handleCloseDescuento() {
    this.setState({
      showModalDescuento: false
    });
  }

    activeEdition(activar,que){
    this.setState({isActivity: activar,que:que});
  }

    saveActividad = e => {
        this.isLoading(true);
        let fecha = new Date();
        manager.postData(routes.PUT_ACTIVIDAD,{'WebUsuario': localStorage.getItem("user",""),'Cliente':this.state.idCliente,'Que':this.state.que,'Titulo': this.state.que,'Reporte': this.state.titulo,'Fechainicio':moment(fecha).format("DD/MM/YYYY HH:mm"),'OrigenModulo':"VTAS",'OrigenID':this.state.ID,'Programacion':0})
        .then(response => {
            this.handleClose();
            this.datosCotizaciones();
            this.props.onClickOption('cotizacion');
            this.isLoading(false)
        })
        .catch(error =>{
            this.isLoading(false)
            let {code} = error
            if (code === undefined) {
                code=500
            }
            if(code === 401){

            }else {
                
            }
        });
    }

  render() {
      let href = "#";
      return (
          <React.Fragment>                
              <Container fluid={true} className="buttonsContainer mt-4">
                  <Row>
                      <Col xs={12}>
                          <Nav fill variant="tabs">
                              <Nav.Item>
                                  <Nav.Link onClick={this.clickActividad}>
                                      Actividad                                       
                                  </Nav.Link>                                
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="link-1" onClick={this.clickCotizacion}>
                                      Cotizaciones {this.state.condicionalSpinerCotizaciones ? <Spinner animation="border" className="mt-2 spinerClientes"variant="success" /> : ""}                                     
                                  </Nav.Link>                                   
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="link-2" onClick={this.clickCompras}>
                                      Ventas Terminadas                                     
                                  </Nav.Link>                                
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="link-3" onClick={this.clickEmbarques}>
                                      Embarques                                    
                                  </Nav.Link>                                
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="link-4" onClick={this.clickCuenta}>
                                      Estado de Cuenta                                   
                                  </Nav.Link>                                
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="link-5" onClick={this.clickPedidos}>
                                      Ventas Pendientes {this.state.condicionalSpiner? <Spinner animation="border" className="mt-2 spinerClientes"variant="success" /> : ""}                                   
                                  </Nav.Link>                                
                              </Nav.Item>    
                              {/* 
                              <Nav.Item>
                                  <Nav.Link eventKey="link-6" onClick={this.clickSaldoPendiente}>
                                      Saldo Pendiente                                   
                                  </Nav.Link>                                
                              </Nav.Item>     
                              */}                    
                          </Nav>
                      </Col>
                      <Col>
                          <Table headers={this.state.headers} data={this.state.data} />
                      </Col>
                      <Modal
                          centered 
                          dialogClassName="modal-90w"
                          show={this.state.show} 
                          onHide={this.handleClose}>
                          <Modal.Header closeButton className="botonCerrar">
                          <Row className="row100W">
                            <Col xs={6} sm={6} md={6} >
                              <Modal.Title >{this.state.nombre}</Modal.Title>
                            </Col>
                            <Col xs={6} sm={6} md={6} className="contactCol" >
                              <a onClick={ () => this.activeEdition(true,"WhatsApp") } href={"https://wa.me/521"+ this.state.telefono} className="btn btn-light mr-1" ><i className="fab fa-whatsapp">{" " + this.state.telefono}</i></a>
                              <a onClick={ () => this.activeEdition(true,"Llamada") } href={"tel:"+this.state.telefono} className="btn btn-light mr-1" ><i className="fas fa-phone">{" " + this.state.telefono}</i></a>
                              <a onClick={ () => this.activeEdition(true,"Correo") } href={"mailto:"+this.state.correo+"?Subject=Hola%"} target="_top" className="btn btn-light mr-1"><i className="fas fa-at">{ (this.state.correo && this.state.correo !== "Sin información") ? this.state.correo.substr(this.state.correo.indexOf('@') + 1): "Sin información" }</i></a>
                            </Col> 
                          </Row>
                          </Modal.Header>
                          <Modal.Body>
                          {
                              (this.state.movimientoActual === "Cotizacion" || this.state.movimientoActual === "Venta Stock" || this.state.movimientoActual === "Venta Pedido") ?
                                <React.Fragment>
                                  <div className="text-right">
                                    <a onClick= {this.printPdf.bind(this)} href={href} target="_top" className="btn btn-light mr-1 text-dark">Descargar PDF <i className="fa fa-file-pdf"></i></a>
                                    <a onClick= {this.printPdf.bind(this)} href={href} target="_top" className="btn btn-light mr-1 text-dark">Imprimir PDF <i className="fa fa-print"></i></a>
                                    <a onClick= {this.enviarEmail.bind(this)} href={href} target="_top" className="btn btn-light mr-1 text-dark">Enviar PDF <i className="far fa-envelope"></i></a>
                                  </div>
                                </React.Fragment>
                                :
                                null
                            }
                          <Table headers={this.state.headersCotizaciones} data={this.state.dataCotizaciones}/>
                          <Container fluid={true}>
                            <hr className="divisorLine" />
                             <Row  className = {this.state.isActivity ? "hiddenButton" :"showButton" }>
                              <Col className={this.state.isCotizacion ? "showButton" : "hiddenButton" } xs={3} sm={3} md={3}  lg={3} xl={3}>
                                <Button onClick={ (e) => this.props.history.push("/editarcotizacion/"+this.state.ID)} className="ajusteBotonSeguimiento" variant="success">Editar/Enviar Cotizacion</Button>
                              </Col>
                              <Col className={this.state.isCotizacion ? "showButton" : "hiddenButton" } xs={3} sm={3} md={3}  lg={3} xl={3}>
                               <Button className="ajusteBotonSeguimiento" variant="success" onClick={(e) => this.handleClickAvanzarShow(true)}>Avanzar</Button>
                              </Col>
                              <Col className="showButton" md={this.state.isCotizacion ? 3 : 12}>
                                <Button onClick= {(e) => this.registrarActividad()} className="ajusteBotonSeguimiento" variant="success">Programar Actividad</Button>
                              </Col>
                              <Col className="showButton" md={this.state.isCotizacion ? 3 : 12}>
                                  <Button onClick= {(e) => this.showDescuento()} className="ajusteBotonSeguimiento" variant="success">Solicitar Descuento</Button>
                              </Col>
                        </Row>
                            <Row className = {this.state.isActivity ? "showButton" : "hiddenButton"} >
                               <Col className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 m-3" >
                                  <div className="input-field" id="inp">
                                       <Form.Control 
                                       as="textarea" 
                                       rows="3"
                                       onChange={this.handleChange}
                                       id="titulo" 
                                       name="titulo"
                                       type="text" 
                                       className="form-control" 
                                       placeholder="Detalle"
                                       value={this.state.titulo} 
                                       />  
                                  </div>                        
                              </Col>
                              <Col xs={6} sm={6} md={6}  lg={6} xl={6}>
                               <Button className="ajusteBotonSeguimiento" variant="success"onClick={this.saveActividad}>Registrar Actividad</Button>
                              </Col>
                              <Col xs={6} sm={6} md={6}  lg={6} xl={6}>
                               <Button className="ajusteBotonSeguimiento" variant="success" onClick={() => this.activeEdition(false,"")}>Cancelar</Button>
                              </Col>
                            </Row>
                          </Container>
                          </Modal.Body>
                      </Modal>
                      <Modal
                        centered 
                        dialogClassName="modal-90w"
                        show={this.state.showTermometro} 
                        onHide={this.handleCloseTermometro.bind(this) }>
                        <Modal.Header closeButton className="botonCerrar">
                          <Modal.Title >Actualizar termometro</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Termometro termometroClick={ this.updateTermometro.bind(this) } />
                          <Button className="ajusteBotonSeguimiento" onClick={ this.handleCloseTermometro.bind(this) }>Cancelar</Button>
                        </Modal.Body>
                      </Modal>
                      <ModalDescuento loading={this.isLoading.bind(this)} mostrar={this.state.showModalDescuento} ID={this.state.ID} onHide={this.handleCloseDescuento.bind(this)} />
                      <ModalAvanzar
                          mostrar={this.state.mostrar}
                          ID={this.state.ID}
                          loading={this.isLoading.bind(this)}
                          isShow={this.handleClickAvanzar.bind(this)}
                          avanzar={this.avanzarFinish.bind(this)}
                          />
                  </Row>
                  <ListaActividadesMov
                      isLoading={this.isLoading.bind(this)}
                      show={this.state.mostrarActividades}
                      mov={this.state.mov}
                      movId={this.state.movID}
                      onHide={this.handleCloseActividades.bind(this)}
                    />
              </Container>
          </React.Fragment>
      );
  }
}

export default ClientDetailBotones;