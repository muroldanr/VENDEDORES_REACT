import React from 'react';
import Table from '../components/Table';
import { Container, Row, Col } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import NumberFormat from 'react-number-format';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import swal from 'sweetalert';


class ModalMovimiento extends React.Component {
  constructor(props) {
    super(props);
    let user = localStorage.getItem('user');   
    this.state = {
      headersCotizaciones:[],
      dataCotizaciones:[],
      show:false,
      nombre:"",
      telefono:"",
      correo:"",
      apellido:"",
      loading : true,
      ID: "",
      user: (user) ? user:'',
      movimiento: "Cotizacion",
      isCotizacion: true,
      isActivity: true,
      idCliente:"",
      titulo:"",
      mostrarDetalle:false,
      mov:[],
      date: new Date(),
      que:"Llamada",
      today: new Date()
    };
  }

  onChange = date => this.setState({ date })

  isLoading(active){
    if (this.props.loading) {
       this.props.loading(active);
    }
  }

  finishActivity(){
    if (this.props.finish) {
       this.props.finish(false);
    }
  }

  handleCloseDetalle(){ 
    if (this.props.isShow) {
           this.props.isShow(false);
    }
    this.setState({mostrarDetalle:false, show:false ,isActivity: true,});
  }

  registrarActividad(){
    this.props.history.push({
       pathname:'/agenda'
    });
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

  cabeceraTablaModalCotizaciones(){
    let headers = ["Articulo", "Descripción", "Cantidad","Precio","Subtotal"];
    let headerItems = [];
     headerItems = headers.map((title) =>
        <th>{title}</th>
    );
    this.setState({ headersCotizaciones: headerItems});
  }    


  dataTablaModalCotizaciones(arrayDetallesDeCotizaciones){        
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
      this.setState({dataCotizaciones: data});
  }

  activeEdition(activar,que){
    this.setState({isActivity: activar,que:que});
  }

  handleClickAvanzar(active) {
    this.setState({mostrarDetalle: active});
  }

  avanzarFinish(){
    this.setState({mostrarDetalle: false});
    this.handleClose();
    this.getData();
  }

  componentWillReceiveProps(props) {
     this.setState({
            mostrarDetalle: props.mostrarDetalle,
            ID:props.ID,
            headersCotizaciones:props.headers,
            dataCotizaciones:props.data,
            mov:props.mov,
            date: props.date,
    }); 
  }

   saveActividad = e => {
        let minTime = moment('10:00')
        let maxTime = moment('19:00')
        var hrInput = new Date(this.state.date);
        var currentTime = new Date();

        currentTime.setHours( currentTime.getHours() + 0.7)
        

        if( hrInput.getTime() > currentTime.getTime()){
          if(moment(this.state.date).format('LT') >= minTime._i && moment(this.state.date).format('LT') <= maxTime._i ){

            this.isLoading(true);
            manager.postData(routes.PUT_ACTIVIDAD,{'WebUsuario': localStorage.getItem("user",""),'Cliente':this.state.mov.idCliente,'Que':this.state.que ,'Titulo': this.state.titulo,'Reporte': "",'Fechainicio':moment(this.state.date).format("DD/MM/YYYY HH:mm"),'OrigenModulo':"VTAS",'OrigenID':this.state.mov.ID,'Programacion':1})
            .then(response => {
              if (response[0] && typeof response[0] === "object") {
                    let resp = response[0];
                    if ( resp.Ok === null && resp.OkRef === null) {
                        swal("Enviado", "Movimiento hecho exitosamente!", "success"); 
                        this.finishActivity() ;
                    }else {
                        swal("Error!", resp.OkRef ? resp.OkRef : "Ocurrrio un error inesperado, vuelva a intentar", "error"); 
                        this.isLoading(false);
                    }
                }  
                this.isLoading(false);
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
    
            } else {
              swal("Error", "Rango de hora invalido!", "error");
            }

        }else {
            swal("Error", "Rango de hora invalido!\n\n La hora seleccionada debe tener una hora de diferencia a la actual", "error");
        }
    }


  render() {
    return (
        <React.Fragment>    
          <Modal
            centered 
            dialogClassName="modal-90w"
            show={this.state.mostrarDetalle} 
            onHide={this.handleCloseDetalle.bind(this)}>
            <Modal.Header closeButton className="botonCerrar">
            <Row className="row100W">
              <Col xs={6} sm={6} md={6} >
                <Modal.Title >{this.state.mov.nombre}</Modal.Title> 
              </Col>
              <Col xs={6} sm={6} md={6} className="contactCol" >
                <a onClick={ () => this.activeEdition(true,"WhatsApp") } href={"https://wa.me/521"+ this.state.mov.telefono} className="btn btn-light mr-1" ><i className="fab fa-whatsapp">{" " + this.state.mov.telefono}</i></a>
                <a onClick={ () => this.activeEdition(true,"Llamada") } href={"tel:"+this.state.mov.telefono} className="btn btn-light mr-1" ><i className="fas fa-phone">{" " + this.state.mov.telefono}</i></a>
                <a onClick={ () => this.activeEdition(true,"Correo") } href={"mailto:"+this.state.mov.correo+"?Subject=Hola%"} target="_top" className="btn btn-light mr-1"><i className="fas fa-at">{" " + this.state.mov.correo}</i></a>                       
              </Col> 
            </Row>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col className="mt-3" xs={4} sm={4} md={4}  lg={4} xl={4}>
                  <center>
                    <h4>{this.state.mov.mov +" "+ this.state.mov.movID}</h4>  
                  </center>
                </Col>  
                 <Col className="mt-3" xs={4} sm={4} md={4}  lg={4} xl={4}>
                  <center>
                    <Form.Control as="select" id="que" onChange={this.handleChange} value={this.state.que}>
                      <option>WhatsApp</option>
                      <option>Llamada</option>
                      <option>Correo</option>
                      <option>Visita</option>
                    </Form.Control>
                  </center>
                </Col>   
                <Col className="mt-3" xs={4} sm={4} md={4}  lg={4} xl={4}>
                  <center>   
                    <DateTimePicker
                        onChange={this.onChange}
                        value={this.state.date}
                        disableClock={true}
                        isClockOpen={false}
                        minDate= {this.state.today}
                    />
                  </center>
                </Col> 
              </Row>
            <Table headers={this.state.headersCotizaciones} data={this.state.dataCotizaciones}/>
            <Container fluid={true}>
              <hr className="divisorLine" />
              <Row  className = {this.state.isActivity ? "hiddenButton" :"showButton" }>
                <Col className={this.state.isCotizacion ? "showButton" : "hiddenButton" } xs={4} sm={4} md={4}  lg={4} xl={4}>
                  <Button onClick={ (e) => this.props.history.push("/editarcotizacion/"+this.state.ID)} className="ajusteBotonSeguimiento" variant="success">Editar/Enviar Cotizacion</Button>
                </Col>
                <Col className={this.state.isCotizacion ? "showButton" : "hiddenButton" } xs={4} sm={4} md={4}  lg={4} xl={4}>
                 <Button className="ajusteBotonSeguimiento" variant="success" onClick={(e) => this.handleClickAvanzarShow(true)}>Avanzar</Button>
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
                 <Button className="ajusteBotonSeguimiento" variant="success" onClick={() => this.handleCloseDetalle()}>Cancelar</Button>
                </Col>
              </Row>
            </Container>
            </Modal.Body>
          </Modal>
        </React.Fragment> 
    );
  }
}

export default ModalMovimiento;