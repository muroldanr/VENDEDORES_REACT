import React from 'react';
import '../components/css/principales.css';
import Loading from '../components/Loading';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import swal from 'sweetalert';
import '../components/css/autorizaciones.css';
import { Button , Card , Navbar , Modal,Table ,InputGroup ,FormControl ,Col,Row} from 'react-bootstrap';
import NumberFormat from 'react-number-format';

class Autorizaciones extends React.Component {

    constructor(props) {
        super(props);
        let user = localStorage.getItem('user');
        this.handleClose = this.handleClose.bind(this); 
        this.state = {
            headers: [],
            data: [],
            mostrar: false,
            loading:false,
            user: (user) ? user:"",
            pipelineData: [],
            show:false,
            currentMov:[],
            descuento:"",
        };
    }

    componentDidMount() {
        this.setHeaders();
        this.reqPipelineGraph();
    }
    
    handleChange  = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    isLoading(active){
        this.setState({loading: active});
    }

    reqPipelineGraph() {
        this.isLoading(true);
        manager.postData(routes.REPORTE_PIPELINE,{
            UsuarioWeb: this.state.user
        })
        .then(response => {
            if (typeof response === "object" && response.length > 0) {
                this.setState({
                    pipelineData: response
                });
            }
            this.getData();
        }).catch(error =>{
            this.isLoading(false);
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
        });
    }

    setHeaders() {
        let headers = [];

        let headerItems = [];

        headerItems = headers.map((title, index) =>
                <th key={title + index}>{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }

    getData(){  
        this.isLoading(true);
        manager.postData(routes.GET_LISTA_AUTORIZAR,{UsuarioWeb:localStorage.getItem('user')})
        .then(response => {
            this.setData(response);
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

    setData(response) {
        let objArray = []
        if(response){
            objArray = response
        }
        let data = [];
        data = objArray.map((objV, index) =>
            <tr  onClick= {(e) => this.detalleAutorizacion(objV)} key={index + objV.Nombre} >
                <td>
                <Card className="text-center mb-2">
                 <Card.Header className="cardBlack">{objV.CteNombre}</Card.Header>
                  <Card.Body>
                    <Card.Title>{objV.Mov+" "+objV.MovID}</Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Button variant="primary"><NumberFormat value={objV.SubTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2}/></Button>
                  </Card.Body>
                  <Card.Footer className="text-muted"><center>{"Vendedor : " + objV.AgenteNombre}</center></Card.Footer>
                </Card>
                </td>
            </tr>
        );
        console.log(data)
        if(data.length === 0){
        data =  <td>
                    <Card className="text-center mb-2">
                      <Card.Body>
                        <h4>Sin Información</h4>
                      </Card.Body>
                    </Card>
                </td>
        }
        console.log(data)

        this.setState({
            data: data
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

    detalleAutorizacion(objV){
        this.setState({
            show: true,
            currentMov: objV,
            descuento:objV.DescGlobalAutorizar
        });
    }

    handleClose() { 
        this.setState({ show:false});
    }
    

    sendAutorizacion(autoriza){
        if(autoriza){
            if(this.state.descuento !== ""){
                 this.setDescuento(this.state.descuento)
            }else{
                swal("Error", "Por favor llenar todos los campos.", "error");
            }
       }else{
            this.setDescuento(0)
       }
    }

    setDescuento(descuento){
        this.isLoading(true);
        manager.postData(routes.SET_AUTORIZAR,{UsuarioWeb:localStorage.getItem('user'),ID:this.state.currentMov.ID,DescGlobalAutorizar:descuento,Solicitud:"1", Autorizado: "1" })
        .then(response => {
            console.log(response);
            swal("Enviado", "Autorización hecha exitosamente!", "success"); 
            this.handleClose();
            this.getData();
            this.reqNotificacion();
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

    reqNotificacion() {
        this.isLoading(true)
        manager.postData(routes.ENVIAR_NOTIFICACION, {
            UsuarioWeb: "",
            title: "Autorización completada",
            body: "Se ha autorizado su cotización"
        }).then(response => {
            this.isLoading(false)
            console.log(response);
        }).catch( error => {
            this.isLoading(false)
            console.log(error);
        });
    }

    render() {
        return (              
            <React.Fragment>
                <Loading active={this.state.loading}/> 
                <Navbar bg="dark" variant="dark">  
                    <Navbar.Brand >Autorizaciones</Navbar.Brand>
                </Navbar>                         
                <div className="container-fluid" id="body_autorizaciones">
                     <center>
                     {this.state.data}
                     </center>
                </div>
                
                <Modal
                  centered 
                  dialogClassName="modal-90w"
                  show={this.state.show} 
                  onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                      Solicitud de Autorización
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Table striped bordered hover>
                        <tbody className="text-center">
                            <tr>
                                <td>Movimiento</td>
                                <td>{this.state.currentMov.Mov +" "+this.state.currentMov.MovID}</td>
                            </tr>
                            <tr>
                                <td>Vendedor</td>
                                <td>{this.state.currentMov.AgenteNombre}</td>
                            </tr>
                            <tr>
                                <td>Venta</td>
                                <td><NumberFormat value={this.state.currentMov.SubTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2}/></td>
                            </tr>
                            <tr>
                                <td>Cliente</td>
                                <td >{this.state.currentMov.CteNombre}</td>
                            </tr>
                            <tr>
                                <td>Descuento</td>
                                <td >{this.state.currentMov.DescGlobalAutorizar}</td>
                            </tr>
                            <tr>
                                <td>Situación</td>
                                <td >{this.state.currentMov.Situacion}</td>
                            </tr>
                        </tbody>
                    </Table>
                     <InputGroup className="mb-3">        
                        <FormControl
                         required
                         rows="1"
                         onChange={this.handleChange}
                         id="descuento" 
                         name="descuento"
                         type="number" 
                         placeholder="Descuento"
                         className="text-right"
                         aria-label="Descuento"
                         value={this.state.descuento}
                        />
                        <InputGroup.Append>    
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <Row className="text-center">
                        <Col xs={6} sm={6} md={6}  lg={6} xl={6}>
                            <Button variant="secondary" onClick={() => this.sendAutorizacion(false)}>No Autorizar</Button>
                        </Col>
                        <Col xs={6} sm={6} md={6}  lg={6} xl={6}>
                            <Button variant="secondary" onClick={() => this.sendAutorizacion(true)}>Autorizar</Button>
                        </Col>
                    </Row>
                  </Modal.Body>
                </Modal>
            </React.Fragment>
        );

    }
}
export default Autorizaciones;