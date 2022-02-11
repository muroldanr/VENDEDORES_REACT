import React from 'react';
//import manager from '../service-manager/api'
//import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
//import swal from 'sweetalert';
import '../components/css/seguimiento.css';
import { Container, Row, Col } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';


class ModalContacto extends React.Component {

    constructor(props) {
        super(props);
        this.handleModalCall = this.handleModalCall.bind(this);    
        this.state = {
            mostrarContacto:false,
            telefono:"",
            correo:"",
            mostrar:false,
            callArray: [],
            headersCotizaciones:[],
            dataCotizaciones:[],
       



        };

    }

    componentWillReceiveProps(props) {
    	let email = ""
    	if(props.contactUser.eMail1)
    	{
    		email = props.contactUser.eMail1;
    	}if (props.contactUser.EMail1){
    		email = props.contactUser.EMail1;
    	}
        this.setState({
            mostrarContacto: (props.mostrarContacto) ? true:false,
            //ID: (props.contactUser.ID) ? props.contactUser.ID: undefined,
            telefono : (props.contactUser.Telefonos) ? props.contactUser.Telefonos:"Sin información", 
            correo : (email) ? email:"Sin información", 
            //callArray: props.contactUser.da,
            //WebUsuario:(props.WebUsuario) ? props.WebUsuario: undefined,
           
        });
    }



  saveRespuestaLlamada(){
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


    manager.postData(routes.spWebSoporteInsert,{'WebUsuario':this.state.WebUsuario, 'Modulo':'VTAS','Mov':this.state.Mov, 'MovID':this.state.MovID, 'Medio':"Llamada", 'Titulo':this.state.motivo, 'Solucion': this.state.titulo})
    .then(response => {
      this.isLoading(false);
      //swal("Enviado", "Registro hecho exitosamente!", "success"); 
      this.props.detallesDeCotizacion(this.state.Mov,this.state.ID)
 
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

   
/*
    cabeceraTablaModalCotizaciones(){
      let headers = ["Articulo", "Descripción", "Cantidad","Precio","Subtotal"];
      let headerItems = [];
       headerItems = headers.map((title) =>
          <th>{title}</th>
      );
      this.setState({ headersCotizaciones: headerItems, mostrar:true});
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
    this.setState({dataCotizaciones: data,
      
    
    });
}
  
*/

    isLoading(active){
      if (this.props.loading) {
        this.props.loading(active);
      }
    }

    handleCloseContacto(){ 
    if (this.props.isShowContacto) {
           this.props.isShowContacto(false);
    }
    this.setState({mostrarContacto:false,});
  }

  handleClose(){ 
    if (this.props.isShowCall) {
           this.props.isShowCall(false);
    }
    this.setState({mostrar:false,});
  }

  handleCloseDetalle(){ 
    if (this.props.isShowCall) {
           this.props.isShowCall(false);
    }
    this.setState({mostrar:false,});
  }

  handleCall(active){
    this.setState({            
            mostrarContacto:active,
    });
  };

  handleModalCall(){
    if (this.props.isShowContacto) {
      this.props.isShowContacto(false);
      this.props.passCall();
    }
    this.setState({mostrarContacto:false,});
    
  

  }

  
  handleChange  = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

    render() {
        return (
      <React.Fragment>

          <Modal size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.mostrarContacto}
                onHide={this.handleCloseContacto.bind(this)} >
              <Modal.Header closeButton>
                  <Modal.Title>Contactar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <p>{this.state.message}</p>
             
             	  <Container>
             	    <Row className="text-center">
              			<Col xs={12} sm={12} md={12} className="text-center" >
              			  	<a href={"https://wa.me/521"+ this.state.telefono} className="btn btn-dark p-2" ><i className="fab fa-whatsapp">{"  " + this.state.telefono}</i></a>
              			</Col> 
              			<Col xs={12} sm={12} md={12} className="text-center  mt-3" onClick={this.handleModalCall.bind(this)} >
              			  	<a href={"tel:"+this.state.telefono} className="btn btn-dark p-2" ><i className="fas fa-phone">{"  " + this.state.telefono}</i></a>
              			</Col> 
              			<Col xs={12} sm={12} md={12} className="text-center  mt-3" >
              			  	<a href={"mailto:"+this.state.correo+"?Subject=Hola%"} target="_top" className="btn btn-dark p-2"><i className="fas fa-at">{"  " + this.state.correo}</i></a>                       
              			</Col> 
             	    </Row>
             	  </Container>
              </Modal.Body>

            </Modal>

      </React.Fragment>
   
        );
    }
}
export default ModalContacto;
