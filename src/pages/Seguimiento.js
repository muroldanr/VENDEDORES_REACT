import React from 'react';
import NewMenu from '../components/NewMenu';
import Table from '../components/Table';
import { Container, Row, Col } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import Titulo from '../components/Titulo';
import Loading from '../components/Loading';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import swal from 'sweetalert';
import Form from 'react-bootstrap/Form';
import StatusComponent from '../components/StatusComponent';
import Termometro from '../components/Termometro';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import ModalAvanzar from '../components/ModalAvanzar';
import ModalDescuento from '../components/ModalDescuento';
import ListaActividadesMov from '../components/ListaActividadesMov';
import ModalContacto from '../components/ModalContacto';
import '../components/css/carrito.css';


class Segimiento extends React.Component {
  constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

       this.handleShow = this.handleShow.bind(this);
       this.handleClose = this.handleClose.bind(this);     
       this.handleClickAvanzar = this.handleClickAvanzar.bind(this);   
      
       
        this.state = {
            headers: [],
            data: [],
            headersCotizaciones:[],
            dataCotizaciones:[],
            show:false,
            nombre:"",
            telefono:"",
            correo:"",
            apellido:"",
            loading : false,
            ID: "",
            user: (user) ? user:'',
            ejercicioStart: new Date().getFullYear(),
            ejercicio: new Date().getFullYear(),
            periodo: new Date().getMonth() + 1,
            movimiento: "Cotizacion",
            movimientoActual: "", 
            situacion: "(Todos)",
            estatus: "(Todos)",
            isCotizacion: true,
            isActivity: false,
            showModalDescuento: false,
            que: "",
            idCliente:"",
            titulo:"",
            mostrar:false,
            mov:"",
            movID:"",
            showTermometro: false,
            mostrarActividades: false,
            reporte:"",
            mostrarContacto:false,
            contactUser:[],
            myID:"",
            globalMovID:""
        };
    }

  onChange = date => this.setState({ date })

  isLoading(active){
    this.setState({loading: active});
  }

  componentDidMount() {
      this.setHeaders();
     /* this.setData(); si lo descomentan no renderiza,aguas ! choca con el getData del componentDidMount*/
     this.getData();        
  }

  handleClose() { 
    this.setState({ show:false ,isActivity: false,});
  }

  handleCloseCallModal() { 
    this.setState({ showCallModal:false});
  }
  handleShow(e,mov) {
    var isMov = false;
    if(mov.Mov === "Cotizacion")
        isMov = true
    this.setState({
        nombre: mov.Nombre ,
        telefono: mov.Telefonos ? mov.Telefonos : "Sin información",
        correo: mov.EMail1 ? mov.EMail1 : "Sin información",
        ID: mov.ID,
        idCliente: mov.Cliente,
        isCotizacion: isMov,
        mov: mov.Mov,
        movID: mov.MovID,
      }
    );

    this.detallesDeCotizacion(e, mov);
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

  registrarActividad(){
    this.registrarUsuarioStorage();
    this.props.history.push({
       pathname:'/agenda',
       state: {
         origen: "seguimiento"
       }
    });
  }

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

  registrarUsuarioStorage() {
    this.setNewClient()
    localStorage.setItem("clienteCliente", this.state.idCliente);
    localStorage.setItem("clienteNombre", this.state.nombre);
    localStorage.setItem("clienteTelefonos",  this.state.telefono);
    localStorage.setItem("clienteeMail1", this.state.correo);
    localStorage.setItem("clienteeCotizacion", this.state.ID);
    localStorage.setItem("clienteeCotizacionID", this.state.movID);
    localStorage.setItem("clienteeMov", this.state.mov);
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

  getData(){  
      this.isLoading(true);
      this.setState({
        movimientoActual: this.state.movimiento
      });
      manager.postData(routes.GET_COTIZACIONES_PENDIENTES,{WebUsuario:this.state.user,Mov:this.state.movimiento,Ejercicio:this.state.ejercicio,Periodo:this.state.periodo,Estatus:this.state.estatus,Situacion:this.state.situacion})
      .then(response => {
        console.log("RESULTADO DEL VENTA PEDIDO: " + this.state.movimiento);
        if(this.state.movimiento==="Venta Pedido"){
          this.setHeadersWithSaldo();
          this.setDataWithSaldo(response);
          this.setState({
            globalMovID: response.MovID
          });
          
        }else{
          this.setHeaders();
          this.setData(response)
        }
         
          this.isLoading(false);
      })
      .catch(error =>{
          let code = error
           this.isLoading(false)
          if (code === undefined) {
            code=500;
          }
          if(code === 401){
              console.log(code);
          }else {
              console.log(code);
          }
      });
  }  

  setHeadersWithSaldo() {     
    let   headers = ["Movimiento","Nombre", "Fecha","Estatus","Última actividad","Descuento", ""];   
    //let   headers = ["Movimiento","Nombre", "Fecha","Estatus","Situación","Última actividad","Descuento", ""];
    //let   headers = ["Movimiento","Nombre", "Saldo", "Fecha","Estatus","Situación","Última actividad","Descuento", ""];
    let headerItems = [];

    headerItems = headers.map((title, index) => 
            <th key={title + index}>{title}</th>
     );

    this.setState({
        headers: headerItems
    });
        
}


  setHeaders() {        
   
    let   headers = ["Movimiento","Nombre","Fecha","Estatus","Situación","Última actividad","Descuento", ""];
    let headerItems = [];

      headerItems = headers.map((title, index) => 
              <th key={title + index}>{title}</th>
       );
  
      this.setState({
          headers: headerItems
      });
          
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

  setDataWithSaldo(arrayCotizaciones) {
      let objArray = arrayCotizaciones
      let data = [];
          data = objArray.map((objV) =>
            <tr key={objV.MovID}>
              <td onClick= {(e) => this.handleShow(e,objV)}>{objV.Mov +" "+objV.MovID}</td>  
              <td onClick= {(e) => this.handleShow(e,objV)}>{objV.Nombre}</td>   
              {/*
              <td onClick= {(e) => this.handleShow(e,objV)}><NumberFormat value={objV.Saldo} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>    
               */}          
              <td onClick= {(e) => this.handleShow(e,objV)}>{this.formatFecha(objV.FechaEmision)}</td>   
              <td onClick= {(e) => this.handleShow(e,objV)}>{objV.Estatus ? objV.Estatus : "Sin información"}</td>    
                            {/*
              <td onClick= {(e) => this.openModalTermometro(objV.ID)}><StatusComponent value={objV.Situacion ? objV.Situacion : "Sin información"}/></td>
                    */}   
              <td onClick= {(e) => this.showActividades(e,objV)}>
                <h6>
                    <span className="icononotaInfo">
                          <i onClick= {(e) => this.showActividades(e,objV)} className="fas fa-eye" ></i>
                    </span>
                    <div>  {objV.UltimaActividad ? objV.UltimaActividad : "Sin información"} </div>
                </h6> 
              </td>
              <td onClick= {(e) => this.showActividades(e,objV)}>{objV.DescuentoEstatus ? objV.DescuentoEstatus : "Sin información"}</td>
              <td className="md">
                <span className="icononota">
                  <i onClick= {(e) => this.handleClickContacto(e,objV)} className="ajustesIconos fas fa-headset" >
                  </i>
                </span>
              </td>
            </tr>
        );
        this.setState({
          data: data, 
          users: objArray            
        });

  }

  setData(arrayCotizaciones) {
    let objArray = arrayCotizaciones
    let data = [];
        data = objArray.map((objV) =>
          <tr key={objV.MovID}>
            <td onClick= {(e) => this.handleShow(e,objV)} >{objV.Mov +" "+objV.MovID}</td>  
            <td onClick= {(e) => this.handleShow(e,objV)}>{objV.Nombre}</td>               
            <td onClick= {(e) => this.handleShow(e,objV)}>{this.formatFecha(objV.FechaEmision)}</td>   
            <td onClick= {(e) => this.handleShow(e,objV)}>{objV.Estatus ? objV.Estatus : "Sin información"}</td>    
            <td onClick= {(e) => this.openModalTermometro(objV.ID)}><StatusComponent value={objV.Situacion ? objV.Situacion : "Sin información"}/></td>
            <td onClick= {(e) => this.showActividades(e,objV)}>
            
                  <span className="icononotaInfo">
                        <i onClick= {(e) => this.showActividades(e,objV)} className="fas fa-eye" ></i>
                  </span>
                  <div>  {objV.UltimaActividad ? objV.UltimaActividad : "Sin información"} </div>
            
            </td>
            <td onClick= {(e) => this.showActividades(e,objV)}>{objV.DescuentoEstatus ? objV.DescuentoEstatus : "Sin información"}</td>
            <td className="md">
              <span className="icononota">
                <i onClick= {(e) => this.handleClickContacto(e,objV)} className="ajustesIconos fas fa-headset" >
                </i>
              </span>
            </td>
          </tr>
      );
      this.setState({
        data: data, 
        users: objArray            
      });

}

  setPedido(){ 
    this.isLoading(true);                
    manager.postData(routes.SET_AVANZAR_PEDIDO,{UsuarioWeb:this.state.user,ID:this.state.ID,Mov:'Pedido '})
    .then(response => {
        this.setDataAvanzarPedido(response)
        this.isLoading(false);                 
    })
    .catch(error =>{
      swal("Error!", "Ocurrrio un error inesperado, vuelva a intentar", "error"); 
        const {code} = error
        if (code === undefined) {
            let code=500
             console.log(code);
        }
        if(code === 401){
            console.log(code); 
            this.isLoading(false);             
        }else {
            console.log(code); 
            this.isLoading(false);             
        }
    })
    this.handleClose();        
    this.getData();  
  }

  setPerdida(){
    this.isLoading(true);          
    manager.postData(routes.SET_AVANZAR_PEDIDO,{UsuarioWeb:this.state.user,ID:this.state.ID,Mov:'Venta Perdida'})
    .then(response => {
        this.setDataVentaPerdida(response)
        this.isLoading(false);                      
    })
    .catch(error =>{
      swal("Error!", "Ocurrrio un error inesperado, vuelva a intentar", "error"); 
        const {code} = error
        if (code === undefined) {
            let code=500
             console.log(code);
             this.isLoading(false);  
        }
        if(code === 401){
            console.log(code); 
            this.isLoading(false);               
        }else {
            console.log(code);  
            this.isLoading(false);              
        }
    })  
    this.handleClose();      
    this.getData();  
  }

  setDataVentaPerdida(arrayVentasPerdidas){
    if (arrayVentasPerdidas[0].OkRef === null ){
    swal("Enviada a Venta Perdida", "Movimiento hecho exitosamente!", "success");   
    this.getData();
    } 
    else {
    swal("Error Intelisis", arrayVentasPerdidas[0].OkRef, "error");
    }    
  }

  setDataAvanzarPedido(arrayPedidosAvanzados){
    if (arrayPedidosAvanzados[0].OkRef === null ){
    swal("Pedido Hecho", "Movimiento hecho exitosamente!", "success");   
    this.getData();
    } 
    else {
    swal("Error Intelisis", arrayPedidosAvanzados[0].OkRef, "error");
    }      
  }

  getYears(){
      let data = [];
      for (var i = 4; i >= 0; i--) {
        data.push(<option key={this.state.ejercicioStart + i}>{this.state.ejercicioStart - i}</option>);
      }
      return(data)
  }

  handleChange  = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleClickContacto = (e,mov) =>{ 
    var isMov = false;
    if(mov.Mov === "Cotizacion")
        isMov = true
      this.setState({
          nombre: mov.Nombre ,
          telefono: mov.Telefonos ? mov.Telefonos : "Sin información",
          correo: mov.EMail1 ? mov.EMail1 : "Sin información",
          ID: mov.ID,
          idCliente: mov.Cliente,
          isCotizacion: isMov,
          mov: mov.Mov,
          movID: mov.MovID,
          mostrarContacto:true,
          contactUser:mov,
        }
      );
   
        //console.log(objV.MovID)
        console.log(this.state.contactUser.MovID);
  }

  getEstatus(){
    if(this.state.movimiento === "Cotizacion"){
       let data = []
        data.push(<option key="todos">(Todos)</option>);
        data.push(<option key="porconfirmar">Por Confirmar</option>);
        return(data)
    }else{
      let data = []
        data.push(<option key="todos1">(Todos)</option>);
        data.push(<option key="pendientes">Pendiente</option>);
        data.push(<option key="concluidos">Concluido</option>);
        return(data)
    }
  }

  detallesDeCotizacion(e,mov){
    let ID = mov.ID;
    this.isLoading(true);
    manager.postData(routes.GET_PEDIDOS_DETALLE,{'ID':ID})
    .then(response => {
      this.registrarUsuarioStorage();
      this.cabeceraTablaModalCotizaciones();
      this.dataTablaModalCotizaciones(response);
      this.isLoading(false);
      this.setState({
        show: true
      });
    })
    .catch(error =>{
        let {code} = error;
        this.isLoading(false)
        if (code === undefined) {
            code = 500;
            this.isLoading(false)
        }
        if(code === 401){
            console.log(code);
            this.isLoading(false)
        }else {
            console.log(code);
            this.isLoading(false)
        }
    })
  }

  detallesDeCotizacionNew(ID){
    console.log("movID: " + ID)
    this.isLoading(true);
    manager.postData(routes.GET_PEDIDOS_DETALLE,{'ID':ID})
    .then(response => {
      this.registrarUsuarioStorage();
      this.cabeceraTablaModalCotizaciones();
      this.dataTablaModalCotizaciones(response);
      this.isLoading(false);
      this.setState({
        show: true
      });
    })
    .catch(error =>{
        let {code} = error;
        this.isLoading(false)
        if (code === undefined) {
            code = 500;
            this.isLoading(false)
        }
        if(code === 401){
            console.log(code);
            this.isLoading(false)
        }else {
            console.log(code);
            this.isLoading(false)
        }
    })
  }

  cabeceraTablaModalCotizaciones(){
    let headers = ["Articulo", "Descripción", "Cantidad","Precio", "Total"];
    let headerItems = [];
     headerItems = headers.map((title, index) =>
        <th key={title + index}>{title}</th>
    );
    this.setState({ headersCotizaciones: headerItems});
  }    


  dataTablaModalCotizaciones(arrayDetallesDeCotizaciones) {
      let objArray = arrayDetallesDeCotizaciones;
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

  activeEdition(activar,que){
    this.setState({isActivity: activar,que:que});
  }

  handleClickAvanzar(active) {
    console.log("ShowAvanzar")
    this.setState({mostrar: active});
  }

  handleClickAvanzarShow(active){
    this.setState({mostrar: active});  
  }

  handleContacto(active){
      this.setState({            
              mostrarContacto:active,
      });
  };

  handleCloseContacto(active){
    console.log("AQUI ENTRO " + active);
    this.setState({            
            mostrarContacto:active,
    });
   

};

  avanzarFinish(){
    this.setState({mostrar: false});
    this.handleClose();
    this.getData();
  }


  saveActividad = e => {
        this.isLoading(true);
        let fecha = new Date();
        manager.postData(routes.PUT_ACTIVIDAD,{'WebUsuario': localStorage.getItem("user",""),'Cliente':this.state.idCliente,'Que':this.state.que,'Titulo': this.state.titulo,'Reporte': this.state.reporte,'Fechainicio':moment(fecha).format("DD/MM/YYYY HH:mm"),'OrigenModulo':"VTAS",'OrigenID':this.state.ID,'Respuesta':this.state.reporte,'Programacion':0})
        .then(response => {
            this.handleClose();
            this.getData();
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

  downloadPdf(event, docName,accion) {

    docName = docName.replace(/ /g,"_");

    let nombreCliente = this.limpiarNombreCliente();

    event.preventDefault();
    console.log("fileName"+accion+":"+ docName + "_" + nombreCliente + "_" + this.state.ID + ".pdf");

    this.isLoading(true);
    manager.getData(routes.PDF_SEND + this.state.ID +"/generarFirma")
    .then(response => {
      if (typeof response === "object") {
        //swal("Documento generado con éxito", "El documento fue generado con éxito", "success");
        let url = "data:application/pdf;base64," + escape(response.data);
        this.openLink(url, docName + "_" + nombreCliente + "_" + this.state.ID + ".pdf");
    
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

  convertDataURIToBinary(base64) {

    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
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
        this.getData();
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

  handleCloseTermometro() {
    this.setState({
      termometroID: undefined,
      showTermometro: false
    });
  }

  getTotal(){
    this.isLoading(true);          
    manager.postData(routes.spWebVentaTotal,{ID:this.state.ID})
    .then(response => {
        this.isLoading(false);    
        this.setState({
          total: response[0].Total
      });                  
      this.showDescuento();
    })
    .catch(error =>{
      swal("Error!", "Ocurrrio un error inesperado, vuelva a intentar", "error"); 
        const {code} = error
        if (code === undefined) {
            let code=500
             console.log(code);
             this.isLoading(false);  
        }
        if(code === 401){
            console.log(code); 
            this.isLoading(false);               
        }else {
            console.log(code);  
            this.isLoading(false);              
        }
    }) 
  
  }

  
  handleCall(active){
    this.setState({            
      showCallModal:active,
    });
  };

  handleModalCall(){
  
    this.isLoading(true);
    manager.postData(routes.GET_PEDIDOS_DETALLE,{'ID':this.state.contactUser.ID})
    .then(response => {
      this.registrarUsuarioStorage();
      this.cabeceraTablaModalCotizacionesCall();
      this.dataTablaModalCotizacionesCall(response);
      this.isLoading(false);
      this.setState({
        showCallModal: true
      });
    })
    .catch(error =>{
        let {code} = error;
        this.isLoading(false)
        if (code === undefined) {
            code = 500;
            this.isLoading(false)
        }
        if(code === 401){
            console.log(code);
            this.isLoading(false)
        }else {
            console.log(code);
            this.isLoading(false)
        }
    })


  }

  cabeceraTablaModalCotizacionesCall(){
    let headers = ["Articulo", "Descripción", "Cantidad","Precio","Subtotal"];
    let headerItems = [];
     headerItems = headers.map((title) =>
        <th>{title}</th>
    );
    this.setState({ headersCotizaciones: headerItems});
  }    


dataTablaModalCotizacionesCall(arrayDetallesDeCotizaciones){        
  let objArray = arrayDetallesDeCotizaciones      
  let data = []; 
   data = objArray.map((objV) =>
      <tr>
          <td>{objV.Articulo ? objV.Articulo : "Sin información"}</td>
          <td>{objV.Descripcion1 ? objV.Descripcion1 : "Sin información"}</td>
          <td><NumberFormat value={objV.Cantidad ? objV.Cantidad : "Sin información"} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/></td>
          <td className="preciosDeModalBotones"><NumberFormat value={objV.Precio ? objV.Precio : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>
          <td className="preciosDeModalBotones"><NumberFormat value={objV.SubTotal ? objV.SubTotal : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} className="spamprecio"/></td>                            
      </tr>
  );
  this.setState({dataCotizaciones: data,
    
  
  });
}


saveRespuestaLlamadaOPC1(){
  if(this.state.motivo && this.state.respuesta !== ''){
    if (this.props.isShowCall) {
      this.props.isShowCall(false);
      this.props.isCloseContacto(false);
  
    
    }
    this.setState({
      mostrar:false,
      mostrarContacto:false,
    });
  
    this.isLoading(true);
    console.log(this.state.WebUsuario);
    console.log(this.state.Mov);
    console.log(this.state.MovID);
    console.log(this.state.ID);
    console.log(this.state.myID);
    manager.postData(routes.spWebSoporteInsert,{'WebUsuario':this.state.user, 'Modulo':'VTAS','Mov':this.state.contactUser.Mov , 'MovID':this.state.contactUser.MovID, 'Medio':"Llamada", 'Titulo':this.state.motivo, 'Solucion': this.state.respuesta})
    .then(response => {
      this.isLoading(false);
      swal("Enviado", "Registro hecho exitosamente!", "success"); 
      //this.props.detallesDeCotizacion(this.state.Mov,this.state.ID)
      this.setState({ showCallModal:false, motivo:"", respuesta:""});
    })
    .catch(error =>{
        let {code} = error;
        this.isLoading(false)
        if (code === undefined) {
            code = 500;
            this.isLoading(false)
        }
        if(code === 401){
            console.log(code);
            this.isLoading(false)
        }else {
            console.log(code);
            this.isLoading(false)
        }
    })
  }else{
    swal("Error", "Completar todos los campos"); 
  }


}

saveRespuestaLlamadaOPC2(){
if(this.state.motivo && this.state.respuesta !== ''){
  if (this.props.isShowCall) {
    this.props.isShowCall(false);
    this.props.isCloseContacto(false);

  
  }
  this.setState({
    mostrar:false,
    mostrarContacto:false,
  });

  this.isLoading(true);
  console.log(this.state.WebUsuario);
  console.log(this.state.Mov);
  console.log(this.state.MovID);
  console.log(this.state.ID);
  console.log(this.state.myID);
  manager.postData(routes.spWebSoporteInsert,{'WebUsuario':this.state.user, 'Modulo':'VTAS','Mov':this.state.contactUser.Mov , 'MovID':this.state.contactUser.MovID, 'Medio':"Llamada", 'Titulo':this.state.motivo, 'Solucion': this.state.respuesta})
  .then(response => {
    this.isLoading(false);
    //swal("Enviado", "Registro hecho exitosamente!", "success"); 
    //this.props.detallesDeCotizacion(this.state.Mov,this.state.ID)
    this.setState({ showCallModal:false});
    this.registrarActividad();
  })
  .catch(error =>{
      let {code} = error;
      this.isLoading(false)
      if (code === undefined) {
          code = 500;
          this.isLoading(false)
      }
      if(code === 401){
          console.log(code);
          this.isLoading(false)
      }else {
          console.log(code);
          this.isLoading(false)
      }
  })

}else{
  swal("Error", "Completar todos los campos"); 
}

}



  render() {
    let href = '#'
    return (
      <div>   
      <Loading active={this.state.loading}/>    
        <div>
            <NewMenu/>
              <Container fluid={true} id="body_seguimiento">
                <Titulo titulo="Seguimiento"/> 
                <Row className="m-1">
                  <Col>
                    <Row>
                      <Col>
                        <Form.Control as="select" id="movimiento" onChange={this.handleChange} value={this.state.movimiento}>
                          <option>Cotizacion</option>
                          <option>Venta Stock</option>
                          <option>Venta Pedido</option>
                          <option>Venta Mostrador</option>
                          <option>Venta Perdida</option>
                        </Form.Control>
                      </Col>
                      <Col>
                         <Form.Control as="select" id="ejercicio" onChange={this.handleChange} value={this.state.ejercicio}>
                          {this.getYears()}
                        </Form.Control>
                      </Col>
                    </Row> 
                  </Col>
                  <Col>
                    <Row>
                      <Col>
                        <Form.Control as="select" id="periodo" onChange={this.handleChange} value={this.state.periodo}>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>2
                          <option>9</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                        </Form.Control>
                      </Col>
                      <Col>
                        <Form.Control as="select" id="estatus" onChange={this.handleChange} value={this.state.estatus}>
                          {this.getEstatus()}
                        </Form.Control>
                      </Col>
                    </Row> 
                  </Col>
                  <Col>
                    <Row>
                      <Col>
                        <Form.Control as="select" id="situacion" onChange={this.handleChange} value={this.state.situacion}>
                          <option>Venta En Frio</option>
                          <option>Venta En Tibio</option>
                          <option>Venta En Caliente</option>
                          <option>(Todos)</option>
                        </Form.Control>
                      </Col>
                      <Col>
                        <Button className="botonsearch btn btn-primary" onClick={this.getData.bind(this)} variant="success">Buscar</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                    <Col>
                        <Table headers={this.state.headers} data={this.state.data}/>
                    </Col>
                </Row>
              </Container>
              <Modal
                  centered 
                  dialogClassName="modal-90w"
                  show={this.state.show} 
                  onHide={this.handleClose}>
                  <Modal.Header closeButton className="botonCerrar">
                    <Row className="row100W">
                      <Col xs={6} sm={6} md={6} >
                        <Modal.Title className="cursor-pointer" onClick={ (e) => this.props.history.push('/clientDetail')}>{this.state.nombre}</Modal.Title>
                        <br/>
                      </Col>
                      <Col xs={6} sm={6} md={6} className="contactCol" >
                        <a onClick={ () => this.activeEdition(true,"WhatsApp") } href={"https://wa.me/521"+ this.state.telefono} className="btn btn-light mr-1" ><i className="fab fa-whatsapp">{" " + this.state.telefono}</i></a>
                        <a onClick={ () => this.activeEdition(true,"Llamada") } href={"tel:"+this.state.telefono} className="btn btn-light mr-1" ><i className="fas fa-phone">{" " + this.state.telefono}</i></a>
                        <a onClick={ () => this.activeEdition(true,"Correo") } href={"mailto:"+this.state.correo+"?Subject=Hola%"} target="_top" className="btn btn-light mr-1"><i className="fas fa-at">{" " + this.state.correo}</i></a>
                      </Col>
                    </Row>
                  </Modal.Header>
                  <Modal.Body>
                    {
                      (this.state.movimientoActual === "Cotizacion" || this.state.movimientoActual === "Venta Stock" || this.state.movimientoActual === "Venta Pedido") ?
                        <React.Fragment>
                          <div className="text-right">
                            <a onClick= {(e) => this.downloadPdf(e, this.state.movimientoActual,"Descarga") } href={href} target="_top" className="btn btn-light mr-1 text-dark">Descargar PDF <i className="fa fa-file-pdf"></i></a>
                            <a onClick= {(e) => this.downloadPdf(e, this.state.movimientoActual,"Imprimir") } href={href} target="_top" className="btn btn-light mr-1 text-dark">Imprimir PDF <i className="fa fa-print"></i></a>
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
                          <Button onClick={ (e) => this.props.history.push("/editarcotizacion/"+this.state.ID)} className="ajusteBotonSeguimiento" variant="success">Editar Cotizacion</Button>
                        </Col>
                        <Col className={this.state.isCotizacion ? "showButton" : "hiddenButton" } xs={3} sm={3} md={3}  lg={3} xl={3}>
                         <Button className="ajusteBotonSeguimiento" variant="success" onClick={(e) => this.handleClickAvanzarShow(true)}>Avanzar</Button>
                        </Col>
                        <Col className="showButton" md={this.state.isCotizacion ? 3 : 12}>
                          <Button onClick= {(e) => this.registrarActividad()} className="ajusteBotonSeguimiento" variant="success">Programar Actividad</Button>
                        </Col>
                        <Col className="showButton" md={this.state.isCotizacion ? 3 : 12}>
                          <Button onClick= {(e) => this.getTotal()} className="ajusteBotonSeguimiento" variant="success">Solicitar Descuento</Button>
                        </Col>
                      </Row>
                      <Row className = {this.state.isActivity ? "showButton" : "hiddenButton"} >
                         <Col className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 m-3" >
                            <div className="input-field" id="inp">
                                 <Form.Control 
                                 as="textarea" 
                                 rows="2"
                                 onChange={this.handleChange}
                                 id="titulo" 
                                 name="titulo"
                                 type="text" 
                                 className="form-control mb-2" 
                                 placeholder="Motivo"
                                 value={this.state.titulo} 
                                 />  

                                 <Form.Control 
                                 as="textarea" 
                                 rows="2"
                                 onChange={this.handleChange}
                                 id="reporte" 
                                 name="reporte"
                                 type="text" 
                                 className="form-control" 
                                 placeholder="Respuesta"
                                 value={this.state.reporte} 
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
                    <Button className="ajusteBotonSeguimiento" onClick={ this.handleCloseTermometro.bind(this) } >Cancelar</Button>
                  </Modal.Body>
               </Modal>
               <ModalDescuento loading={this.isLoading.bind(this)} mostrar={this.state.showModalDescuento} total={this.state.total} ID={this.state.ID} onHide={this.handleCloseDescuento.bind(this)} />
               
            

               <ModalAvanzar
                 mostrar={this.state.mostrar}
                 ID={this.state.ID}
                 loading={this.isLoading.bind(this)}
                 isShow={this.handleClickAvanzar.bind(this)}
                 avanzar={this.avanzarFinish.bind(this)}/>
                
                <ModalContacto 
                 passCall={this.handleModalCall.bind(this)} 
                 mostrarContacto={this.state.mostrarContacto} 
                 contactUser={this.state.contactUser} 
                 isShowContacto={this.handleContacto.bind(this)}
                 isCloseContacto={this.handleCloseContacto.bind(this)}
                 detallesDeCotizacion={this.detallesDeCotizacionNew.bind(this)}
                >
                   
                </ModalContacto>

                <Modal 
                    size="md"
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered 
                    show={this.state.showCallModal} 
                    isShowCall={this.handleCall.bind(this)}
                    onHide={this.handleCloseCallModal.bind(this)}
                   >
                <Modal.Header closeButton className="botonCerrar">
                <Modal.Title className="cursor-pointer" onClick={ (e) => this.props.history.push('/clientDetail')}>{this.state.contactUser.Nombre}</Modal.Title> 
                </Modal.Header>
                <Modal.Body>
                 <h4>{(    this.state.contactUser.Mov +" "+ this.state.contactUser.MovID)}</h4>  
                <Table headers={this.state.headersCotizaciones} data={this.state.dataCotizaciones}/>
                <Container fluid={true} className='mb-3'>
                <Row>
                <Col className="col-xs-6 col-md-6 col-lg-6 col-xlg-6" >
                      <div className="input-field" id="inp">
                            <Form.Control 
                            as="textarea" 
                            rows="3"
                            onChange={this.handleChange}
                            id="motivo" 
                            name="motivo"
                            maxlength="200"
                            type="text" 
                            className="form-control" 
                            placeholder="Motivo de la LLamada"
                            value={this.state.motivo} 
                            />  
                        </div>      
                                        
                    </Col>
                    <Col className="col-xs-6 col-md-6 col-lg-6 col-xlg-6" >
                        
                        <div className="input-field" id="inp">
                            <Form.Control 
                            as="textarea" 
                            rows="3"
                            onChange={this.handleChange}
                            id="respuesta" 
                            name="respuesta"
                            type="text" 
                            className="form-control" 
                            placeholder="Respuesta de la LLamada"
                            maxlength="200"
                            value={this.state.respuesta} 
                            />  
                        </div>                        
                    </Col>

                </Row>

                </Container>
                <Container fluid={true} className='mt-2'>
                  <Row className = {"showButton"} >
                  
                    <Col xs={4} sm={4} md={4}  lg={4} xl={4}>
                      <Button className="ajusteBotonSeguimiento" variant="success"onClick={() => this.saveRespuestaLlamadaOPC1()}>Registrar Actividad</Button>
                    </Col>
                    <Col xs={4} sm={4} md={4}  lg={4} xl={4}>
                      <Button className="ajusteBotonSeguimiento" variant="success"onClick={(e) => this.saveRespuestaLlamadaOPC2()}>Reagendar</Button>
                    </Col>
                    <Col xs={4} sm={4} md={4}  lg={4} xl={4}>
                      <Button className="ajusteBotonSeguimiento" variant="success" onClick={() => this.handleCloseCallModal()}>Cancelar</Button>
                    </Col>
                  </Row>
                  
                </Container>
                </Modal.Body>

                </Modal>
               
                 <ListaActividadesMov isLoading={this.isLoading.bind(this)} show={this.state.mostrarActividades} mov={this.state.mov} movId={this.state.movID} onHide={this.handleCloseActividades.bind(this)} />
            </div>
        </div>
    );
  }
}

export default Segimiento;