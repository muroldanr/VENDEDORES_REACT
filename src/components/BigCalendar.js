import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import '@fullcalendar/list/main.css';
import './css/fullcalendar.css';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Col, Row,Container } from 'react-bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import moment from 'moment';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import ModalMovimientoD from '../components/ModalMovimientoD';
import ModalReporte from '../components/ModalReporte';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import NumberFormat from 'react-number-format';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';



class BigCalendar extends React.Component {  

  constructor(props){
    super(props);
    this.state = {
      calendarEvents: [],
      calendarEventsOld:[],
      actividad: [],
      show:false ,
      isActivity: false,
      mov: [],
      loading:false,
      headersCotizaciones:[],
      dataCotizaciones:[],
      seguimiento:"",
      date: new Date(),
      recargar:false,
      mostrarDetalle:false,
      mostrarReporte:false,
    };
  }    

  componentDidMount() {
    if (this.props.autoclick) {
      this.crearMov();
    }
  }  

  componentWillReceiveProps(props) {
    let objArray = []      
    let data = []

    if(Array.isArray(props.calendarEvents)){
      objArray = props.calendarEvents
    }

    data = objArray.map((objV) => {
       let color = "#112D65"
          switch(objV.Medio){
            case 'WhatsApp':
              color = "#075e54" ;
              break;
            case 'Llamada':
              color = "#971A0B" ;
              break;
            case 'Correo':
              color = "#112D65" ;
              break;
            default:
              color = "#2a2f30";
              break;
          }
          let element = {title: objV.Nombre+ " | " + objV.Origen+ " "+ objV.OrigenID +" | "+objV.Titulo, date: objV.FechaInicio, mov: objV, backgroundColor:color } ;
          return element
         });
      this.setState({calendarEvents: data,calendarEventsOld: data});
    }


  crearMov(){
    let cotizacion = localStorage.getItem("clienteeCotizacion") 
    if(cotizacion){
      let fecha = new Date() ; 
      this.detallesDeCotizacion(fecha,true,[])
    }else{
         swal("Selecciona un movimiento para asignarle una actividad", {
        buttons: {
          cancel: "Cancelar",
          catch: {
            text: "Buscar",
            value: "buscar",
          },
        },
      })
      .then((value) => {
        switch (value) {
       
          case "buscar":
            this.irSeguimiento()
            break;
       
          default:
            return;
        }
      });
    }
  }

  irSeguimiento(){
    this.props.history.push({
      pathname:'/seguimiento'
    });
  }

  eventClick = eventClick => {
    let fecha = moment(eventClick.event.start) ; 
    let mov = eventClick.event.extendedProps.mov;
    this.detallesDeCotizacion(fecha,false,mov);
  };

  isLoading(active){
    if (this.props.loading) {
       this.props.loading(active);
    }
  }

  openModal(fecha,mostrarReporte,movNew){
    if(mostrarReporte){
      this.setState({mostrarDetalle: true,mostrarReporte: false,mov:movNew,date:fecha});
    }else{
      this.setState({mostrarDetalle: false,mostrarReporte: true,mov:movNew,date:fecha});
     
    }
  }

  avanzarFinish(){
    if (this.props.recargar) {
       this.props.recargar(true);
    }
    this.setState({mostrarDetalle: false,mostrarReporte:false,show:false ,isActivity: false});
  }

  handleClose() { 
    this.setState({mostrarDetalle: false,mostrarReporte:false,show:false ,isActivity: false});
  }

detallesDeCotizacion(fecha,mostrarReporte,mov){
    let movNew = []
    if(mostrarReporte){
      movNew = {
        nombre: localStorage.getItem('clienteNombre') ? localStorage.getItem('clienteNombre') : "Sin información",         
        telefono: localStorage.getItem('clienteTelefonos') ? localStorage.getItem('clienteTelefonos') : "Sin información",         
        correo: localStorage.getItem('clienteeMail1') ? localStorage.getItem('clienteeMail1') : "Sin información",         
        ID: localStorage.getItem("clienteeCotizacion"),         
        idCliente: localStorage.getItem("clienteCliente"),         
        movID: localStorage.getItem("clienteeCotizacionID"),         
        mov: localStorage.getItem("clienteeMov"),                 
      }
    }else{
      movNew = {
        nombre: mov.Nombre ? mov.Nombre : "Sin información",
        telefono: mov.Telefonos ? mov.Telefonos : "Sin información",
        correo: mov.Email ? mov.Email  : "Sin información",
        ID: mov.VentaID,
        actividadID: mov.ID,
        idCliente: mov.Cliente,
        movID: mov.OrigenID ? mov.OrigenID : "Sin información",
        mov: mov.Origen ? mov.Origen : "Sin información",
        que : mov.Medio ? mov.Medio : "",
        titulo: mov.Titulo ? mov.Titulo : "",
      }
    }
  this.isLoading(true)
  manager.postData(routes.GET_PEDIDOS_DETALLE,{'ID':movNew.ID})
  .then(response => {
    this.cabeceraTablaModalCotizaciones();
    this.dataTablaModalCotizaciones(response);
    this.openModal(fecha,mostrarReporte,movNew)
    this.isLoading(false);
  })
  .catch(error =>{
      this.isLoading(false);
      let {code} = error;
      swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
      if (code === undefined) {
          code = 500;
      }
      if(code === 401){
        this.isLoading(false)
      }
  })
}

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

  activityFinish(active) {
    this.setState({mostrarDetalle: active,mostrarReporte:active});
  }

  handleClickAvanzar(active) {
    this.setState({mostrarDetalle: active,mostrarReporte:active});

  }

  handleClickModal(active){
    this.setState({mostrarDetalle: active,mostrarReporte:active}); 
  }

  render() {      
    return (
     <div className="animated fadeIn p-4 demo-app">
        <Row >          
          <Col lg={12} sm={12} md={12} >
            <div className="demo-app-calendar" id="mycalendartest">
            <Container fluid={true} >
              <FullCalendar                  
                header={{
                  left: 'prevYear,prev,next,nextYear',              
                  center: "title",
                  plugins: [ timeGridPlugin ],
                  right: "timeGridDay,timeGridWeek,dayGridMonth,resourceTimelinePlugin"
                }}                              
                buttonIcons={{
                  prev: 'left-single-arrow',
                  next: 'right-single-arrow',
                  prevYear: 'left-double-arrow',
                  nextYear: 'right-double-arrow'
                }} 
                slotDuration='1:00:00'
                slotLabelInterval= '0:30'
                minTime = '10:00'
                maxTime = '20:00'
                columnHeader={true}
                slotLabelFormat= {{ hour: 'numeric',minute: '2-digit',omitZeroMinute: true,meridiem: 'short' }} 
                titleFormat = {{ year: 'numeric', month: 'short' ,day: '2-digit',weekday: 'short' }} 
                defaultView ='timeGridDay' 
                scrollTime =  '08:00'                
                views={{
                  dayGridPlugin:{
                   resourceTimelinePlugin:{  
                      businessHours:{                      
                        startTime: '10:00', 
                        endTime: '18:00',
                        slotDuration: '1:00:00',  
                        allDayText: 'hora',                                                            
                      },                      
                    }
                    },                
                }}     
                height="auto"                
                resourceTimelinePlugin={{
                  defaultView: 'resourceTimeline'
                }
                }          
                timeGridEventMinHeight={30}                                                                                                        
                allDaySlot={false}   
                allDayText= 'hora'                
                showNonCurrentDates={true}                                                                                                    
                bootstrapFontAwesome = {true}                               
                timeZone= 'local'                                                                                                
                editable={false}
                droppable={false}
                plugins={[timeGridPlugin,dayGridPlugin,timeGrid, interactionPlugin, bootstrapPlugin,listPlugin]}                
                ref={this.calendarComponentRef}
                weekends={true}                
                events={this.state.calendarEvents}
                eventDrop={this.drop}                
                eventReceive={this.eventReceive}
                eventClick={this.eventClick}
                locale= {esLocale}
                themeSystem = 'bootstrap'                                
                aspectRatio = {1.5}                 
                listDayFormat={false} 
                schedulerLicenseKey= 'GPL-My-Project-Is-Open-Source'              
                columnHeaderFormat = {{ weekday: 'short', day: 'numeric' }}  
              />  
            </Container>        
                <div id="external-events">                 
                  <Button onClick={() => this.crearMov()} className="botonsearch mb-2 mt-2"><i className="fa fa-fw fa-plus" style={{ fontSize: '1.75em' }} /></Button> 
                </div>
            </div>
          </Col>
        </Row>
        <ModalMovimientoD 
        	mostrarDetalle={this.state.mostrarDetalle} 
        	mov={this.state.mov} 
        	loading={this.isLoading.bind(this)} 
        	finish={this.avanzarFinish.bind(this)}
          isShow={this.handleClickModal.bind(this)}
        	headers={this.state.headersCotizaciones} 
        	data={this.state.dataCotizaciones}
        	date={this.state.date}
        	/>

        <ModalReporte 
          mostrarReporte ={this.state.mostrarReporte} 
          mov={this.state.mov} 
          loading={this.isLoading.bind(this)} 
          finish={this.avanzarFinish.bind(this)}
          isShow={this.handleClickModal.bind(this)}
          headers={this.state.headersCotizaciones} 
          data={this.state.dataCotizaciones}
          />

      </div> 
      );
  }
}

export default BigCalendar;