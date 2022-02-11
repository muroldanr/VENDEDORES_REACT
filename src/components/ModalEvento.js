import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import {Container, Row} from 'react-bootstrap';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import './css/fullcalendar.css';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import swal from 'sweetalert';

class ModalEvento extends Component {

    constructor(props){
        super(props);
        let user = localStorage.getItem('user');
        this.state={ 
            user: (user) ? user:'',
            actividad:[
                 {'fecha': "", 'tipo': ""}
            ],
             date: new Date(),
             titulo: "",
             seguimiento:""
        }
    }

    onChange = date => this.setState({ date })


    componentWillReceiveProps(props){
        console.log(props.actividad.tipo)
       this.setState({actividad: props.actividad,date: props.actividad.fecha,seguimiento: props.seguimiento})
    }
    
    isLoading(active){
        this.setState({loading: active});
    }

    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    saveActividad = e => {
        e.preventDefault();
        this.isLoading(true);
        this.props.onHide();

        manager.postData(routes.PUT_ACTIVIDAD,{'WebUsuario': localStorage.getItem("user",""),'Cliente':localStorage.getItem("clienteCliente",""),'Que':this.state.actividad.titulo,'Titulo': this.state.seguimiento,'Reporte':"",'Fechainicio':moment(this.state.date).format("DD/MM/YYYY HH:mm")})
        .then(response => {
            this.setData(response)
            this.isLoading(false);
        })
        .catch(error =>{

            this.isLoading(false);
            let {code} = error;

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code=500
            }

            if(code === 401){

            }
        });
    }

    renderModal(){
        console.log(this.state.seguimiento)
        if(this.state.seguimiento){
            return(
            <Modal
                 {...this.props}
                 size="lg"
                 aria-labelledby="contained-modal-title-vcenter"
                 centered >

            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {localStorage.getItem("clienteNombre","")}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className="mt-0 pt-0 mb-0 pb-0">  
                <Container>   
                    <Row>
                        <div className="col-xs-6 col-md-6 col-lg-6 col-xlg-6 mt-3" >
                            <h4>{this.state.actividad.tipo }</h4>  
                        </div>   
                         <div className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 mt-3" >
                         <div className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 mt-3" >
                            <a href={"https://wa.me/"+localStorage.getItem("clienteTelefonos","")+"?text=Hola"} className="btn btn-outline-secondary mr-1" ><i className="fab fa-whatsapp">{" " + localStorage.getItem("clienteTelefonos","")}</i></a>
                            <a href={"tel:"+localStorage.getItem("clienteTelefonos","")} className="btn btn-outline-secondary mr-1" ><i className="fas fa-phone">{" " + localStorage.getItem("clienteTelefonos","")}</i></a>
                            <a href={"mailto:"+localStorage.getItem("clienteeMail1","")+"?Subject=Hola%"} target="_top" className="btn btn-outline-secondary mr-1"><i className="fas fa-at">{" " + localStorage.getItem("clienteeMail1","")}</i></a>                      
                        </div> 
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
                        </div>

                     </Row>
                </Container>                
                  </Modal.Body>
                  <Modal.Footer className="mt-0 pt-3">                    
                    <Button onClick={this.saveActividad}>Guardar</Button>
                    <Button onClick={this.props.onHide}>Cancelar</Button>
                  </Modal.Footer>
            </Modal>)
          } else {
            return(
             <Modal
                 {...this.props}
                 size="lg"
                 aria-labelledby="contained-modal-title-vcenter"
                 centered >

            <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      {localStorage.getItem("clienteNombre","")}
                      
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="mt-0 pt-0 mb-0 pb-0">  
                <Container>   
                    <Row>
                        <div className="col-xs-6 col-md-6 col-lg-6 col-xlg-6 mt-3" >
                            <h4>{this.state.actividad.tipo }</h4>  
                        </div>   
                        <div className="col-xs-6 col-md-6 col-lg-6 col-xlg-6 mt-3" >   
                            <DateTimePicker
                                onChange={this.onChange}
                                value={this.state.date}
                                disableClock={true}
                                isClockOpen={false}
                            />
                        </div> 
                         <div className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 mt-3" >
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
                        </div>               
                     </Row>
                </Container>                
                  </Modal.Body>
                  <Modal.Footer className="mt-0 pt-3">                    
                    <Button onClick={this.saveActividad}>Guardar</Button>
                    <Button onClick={this.props.onHide}>Cancelar</Button>
                  </Modal.Footer>
              </Modal>)

          }
    }
 
    render() {
        return (
            <React.Fragment>
                {this.renderModal()}
            </React.Fragment>
        	  	 
            
        );
    }
}

export default ModalEvento;