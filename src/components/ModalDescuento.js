import React from 'react';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { Col, Row, Button } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import NumberFormat from 'react-number-format';

class ModalDescuento extends React.Component {

    constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

        this.state = {
            headers: [],
            data: [],
            users: [],
            mostrar: (props.mostrar) ? true:false,
            loading : true,
            ID: (props.ID) ? props.ID: undefined,
            user: (user) ? user:'',
            total : (props.total) ? props.total: undefined,
            cantidadN : 0,
            porcentajeN : 0,
            cantidad: 0,
            descuento: 0,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            mostrar: (props.mostrar) ? true:false,
            ID: (props.ID) ? props.ID: undefined,
            total : (props.total) ? props.total: undefined,
        });
    }

    solicitarDescuento() {
        if (this.state.ID && this.state.descuento && this.state.descuento > 0) {
            this.reqDescuento();
        }
    }

    reqDescuento() {
        this.isLoading(true);                
        manager.postData(routes.SOLICITAR_DESCUENTO,{
            UsuarioWeb:this.state.user,
            ID:this.state.ID,
            Solicitud:"1",
            DescGlobalAutorizar:this.state.descuento})
        .then(response => {
            this.isLoading(false);

            if (typeof response === "object" && response.length > 0) {
                let resp = response[0];
                if (resp.Ok === null && resp.OkRef === null) {
                    swal("Éxito", "La solicitud de descuento se realizó con éxito", "success"); 
                    this.solicitaResponsables();
                    return;
                }
            }

            swal("Error", (response[0] && response[0].OkRef) ? response[0].OkRef:"Hubo un problema al realizar su solicitud, intentelo más tarde", "error"); 
        })
        .catch(error =>{
            this.isLoading(false);
            let {code} = error;

            if (code === undefined) {
                code=500;
            }

            if(code === 401){

            }
        });
    }

     solicitaResponsables(){
       this.isLoading(true);
        manager.postData(routes.GET_GERENTE,{WebUsuario:localStorage.getItem('user')})
        .then(response => {
            if(response[0].Usuario !== ""){
                for(var i=0; i< response.length; i++){
                 this.reqNotificacion(response[i].Usuario);
                }
                this.isLoading(false);
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
            }
            
        });
     }

    reqNotificacion(responsable) {
        this.isLoading(true)
        manager.postData(routes.ENVIAR_NOTIFICACION, {
            UsuarioWeb: responsable,
            title: "Autorizar Descuento",
            body: "Se ha solicitado una autorización"
        }).then(response => {
            this.isLoading(false)
            console.log(response);
        }).catch( error => {
            this.isLoading(false)
            console.log(error);
        });
    }

    changeDescuento = () => {
        
        let value = this.state.porcentajeN;
        let descuento = Number(value);
        let total = Number(this.state.total);
        let cantidad = (descuento * total) / 100;

        this.setState({
            //descuento:  isNaN(descuento) ? "":descuento,
            cantidad:  isNaN(cantidad) ? "" : cantidad,
        });
    };

    changeCantidad = () => {
        let value = this.state.cantidadN;
        let cantidad = Number(value);
        let total = Number(this.state.total);
        let descuento = (cantidad * 100) / total;
     
        this.setState({
            descuento:  isNaN(descuento) ? "" : descuento,
            //cantidad:  isNaN(cantidad) ? "":cantidad,
        });
    };

    clearValue = (value) => {
        return value.replace(' ', '').replace('$', '').replace('%', '').replace(',', '')
    }

    isLoading(active){
      if (this.props.loading) {
        this.props.loading(active);
      }
    }

    render() {
        return (
              <Modal 
                    size="md"
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered 
                    show={this.state.mostrar} 
                    onHide={this.props.onHide}
                    >
              <Modal.Header closeButton>
                  <Modal.Title>Solicitar descuento</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row>
                    <Col>
                      <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Porcentaje</span>
                            </div>
                            <NumberFormat  decimalScale={2} thousandSeparator={true} suffix={" %"} value={this.state.descuento}  onValueChange={(values) => {
                                const { value} = values;
                                this.setState({porcentajeN: value,descuento: value })
                                
                                }}
                            />
                             <Button onClick= {() =>  this.changeDescuento()} className="ajusteBotonCantidad" variant="success">Calcular</Button>
                        </div>
                    </Col>
                    <Col>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Cantidad</span>
                            </div>
                            <NumberFormat thousandSeparator={true} prefix={"$ "}  value={this.state.cantidad}  onValueChange={(values) => {
                                const { value} = values;
                                this.setState({cantidadN: value,cantidad: value })
                                
                                }}  />
                            <Button onClick= {() => this.changeCantidad()} className="ajusteBotonCantidad" variant="success">Calcular</Button>
                        </div>
                    </Col>
                    <Col>
                        <div >
                            <div >
                                <span >Total</span>
                            </div>
                            <div >
                                <span ><NumberFormat value={this.state.total ? this.state.total  : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$ '} decimalScale={2} /></span>
                            </div>
                        </div>
                    </Col>
                    <Col className="text-center">
                        <Button onClick= {this.solicitarDescuento.bind(this)} className="ajusteBotonSeguimiento" variant="success">Solicitar</Button>
                    </Col>
                  </Row>
              </Modal.Body>
            </Modal>
        );
    }
}
export default ModalDescuento;