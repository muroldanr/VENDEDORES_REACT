import React from 'react';
import Table from '../components/Table';
import Titulo from '../components/Titulo';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-date-picker';
import swal from 'sweetalert';
import "react-datepicker/dist/react-datepicker.css";
import '../components/css/registroVisitantes.css';
import Form from 'react-bootstrap/Form'
import Loading from '../components/Loading';

class RegistroVisitantes extends React.Component {

    constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

        this.state = {
            headers: [],
            headersView: [],
            data: [],
            dataView: [],
            registoVisitante:[],
            UsuariosDropDownAsignado: [],
            DropDownClientes: [],
            show:false,
            showEditForm: false,
            CantidadPersonas:1,
            StringDelNumeroDeTelefono:"",
            StringDelApellido:"",
            StringDelNombre:"",
            celular: "",
            apellidoMaterno: "",
            Agente:undefined,
            clienteNuevo:"No",
            showModalClientes: false,
            cliente: undefined,
            observaciones: "",
            user: (user) ? user:"",
            validText: "",
            ID: 0,
            date: new Date(),
            loading: false,
        };
    }

    componentDidMount() {
        this.reqRegistros();
    }

    componentWillMount() {
        this.reqRegistros();
    }

    traerUsuario(){
        this.isLoading(true);
        manager.postData(routes.spWebAgenteRol, {
            UsuarioWeb: this.state.user
        })
        .then(response => {
            this.isLoading(false);
            this.usuariosDelDropDown(response)
            this.handleShow();
        })
        .catch(error =>{
            this.isLoading(false);
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
            let {code} = error;

            if (code === undefined) {
              code = 500;
            }

            if(code === 401){

            }
        });
    }

    reqRegistros() {
        this.isLoading(true);
        let fecha = this.formatFecha(this.state.date);
        manager.postData(routes.spWebAgenteRegistro, {
            UsuarioWeb: this.state.user,
            Fecha: fecha
        })
        .then(response => {
            this.isLoading(false);
            this.setState({
                data: response
            });

            this.setHeaders();
            this.setData();
        })
        .catch(error =>{
            this.isLoading(false);
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
            let {code} = error;

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){

            }
        });
    }

    handleShow() {
        
        this.setState({
            show: true,
            validText: ""
        })
    }

    handleClose() {
        this.setState({
            show: false,
            showEditForm: false,
            showListMov:false
        });
        this.resetInfo();
    }

    handleCloseClientes() {
        this.setState({
            showModalClientes: false,
        });
    }

    EnviarDatosVisitantes(){
        if (this.state.agente === undefined) {
            this.setState({
                validText: "El agente es requerido"
            });
            return;
        }
        this.isLoading(true);
        manager.postData(routes.SAVE_REGISTRO, {
            WebUsuario: this.state.user,
            NoPersonas: this.state.CantidadPersonas,
            Agente: this.state.agente.Agente,
            Observaciones: this.state.observaciones,
            PrimerVisita: (this.state.clienteNuevo === "Sí") ? 1:0,
            Visita: (this.state.clienteVisita === "Sí") ? 1:0,
            Oportunidad: (this.state.clienteOportunidad === "Sí") ? 1:0,
        })
        .then(response => {
            this.isLoading(false);
            if (typeof response === "object" && response.length > 0) {
                let obj = response[0];
                if (obj.Ok === null && obj.OkRef === null) {
                    this.resetInfo();
                    this.reqRegistros();
                    swal("Éxito", "Registro guardado exitosamente", "success");
                    return;
                }
            }

            swal("Ocurrio un Error", (response[0] && response[0].OkRef) ? response[0].OkRef: "Error al salvar el registro, intentelo más tarde", "error");
        })
        .catch(error =>{
            this.isLoading(false);
            let {code} = error;
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){

            }
        });
    }

    isLoading(active){
        this.setState({loading: active});
    }


    reqEditarRegistro(tipo) {

        let eliminar = 0;
        if(tipo === "eliminar"){
            eliminar= 1;
        }

        let data = {
            ID: this.state.ID,
            WebUsuario: this.state.user,
            NoPersonas: this.state.CantidadPersonas,
            Agente: this.state.agente.Agente,
            PrimerVisita: (this.state.clienteNuevo === "Sí") ? 1:0,
            Visita: (this.state.clienteVisita === "Sí") ? 1:0,
            Oportunidad: (this.state.clienteOportunidad === "Sí") ? 1:0,
            Eliminar: eliminar,
        }

        manager.postData(routes.EDITAR_REGISTRO, data)
        .then(response => {
            if (typeof response === "object" && response.length > 0) {
                let obj = response[0];
                if (obj.Ok === null && obj.OkRef === null) {
                    this.resetInfo();
                    if(tipo === "eliminar"){
                        swal("Éxito", "Registro eliminado exitosamente", "success");
                    }else {
                        swal("Éxito", "Registro actualizado exitosamente", "success");
                    }
                    this.handleClose();
                    this.reqRegistros();
                    return;
                }
            }

            swal("Ocurrio un Error", (response[0] && response[0].OkRef) ? response[0].OkRef: "Error al salvar el registro, intentelo más tarde", "error");
        })
        .catch(error =>{

            let {code} = error;
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if (code === undefined) {
                code = 500;
            }
            if(code === 401){

            }
        });
    }

    resetInfo() {
        this.setState({
            show:false,
            showModalClientes: false,
            showEditForm: false,
            CantidadPersonas:1,
            StringDelNumeroDeTelefono:"",
            StringDelApellido:"",
            StringDelNombre:"",
            celular: "",
            apellidoMaterno: "",
            agente: undefined,
            clienteNuevo:"No",
            clienteOportunidad:"No",
            clienteVisita:"No",
            cliente: undefined,
            observaciones: "",
            validText: ""
        });
    }

    capturarCantidadPersonas(cantidad){
        this.setState({CantidadPersonas:cantidad})
    }

    capatandoCheck(e){

        let isChecked = e.target.checked;

        if (isChecked){
            this.setState({clienteNuevo:"Sí"});
            this.setState({clienteOportunidad:"Sí"});
            this.setState({clienteVisita:"No"});
        }else{
            this.setState({clienteNuevo:"No"});
            this.setState({clienteOportunidad:"No"});
        }
    }

    capatandoCheckOportunidad(e){
        let isChecked = e.target.checked;

        if (isChecked){
            this.setState({clienteOportunidad:"Sí"});
            //this.setState({clienteNuevo:"Sí"});
            this.setState({clienteVisita:"No"});
        }else{
           // this.setState({clienteVisita:"Sí"});
            this.setState({clienteOportunidad:"No"});
        }
    }

    capatandoCheckVisita(e){
        let isChecked = e.target.checked;

        if (isChecked){
            this.setState({clienteVisita:"Sí"});
            this.setState({clienteOportunidad:"No"});
            this.setState({clienteNuevo:"No"});
        }else{
           // this.setState({clienteVisita:"Sí"});
            this.setState({clienteVisita:"No"});
        }
    }

    changeDate(date) {
        this.setState({
            date: date
        });
    }

    searchRegistros() {
        if (this.state.date) {
            this.reqRegistros();
        }
    }

    capturandoUsuarioAsignado(agente){
        this.setState({agente:agente})
    }


    usuariosDelDropDown(Users){
        let usuariosAsignado = [];

        usuariosAsignado = Users.map((objV, index) => 
            <Dropdown.Item key={objV.Nombre + index} onClick={(e)=>this.capturandoUsuarioAsignado(objV)}> {objV.Nombre}</Dropdown.Item>
        );

        this.setState({
            UsuariosDropDownAsignado: usuariosAsignado,
        });
    }

    selectedCliente(cliente) {
        this.setState({
            cliente: cliente
        });
        this.handleCloseClientes();
    }

    showEditarRegistro(registro) {
        this.setState({
            showEditForm: true,
            CantidadPersonas: registro.NoPersonas,
            agente: {
                Agente: registro.Agente,
                Nombre: registro.AgenteNombre
            },
            clienteNuevo: (registro.PrimerVisita === "1") ? 'Sí':'No',
            ID: registro.ID,
            clienteVisita :(registro.Visita === "1") ? 'Sí':'No',
            clienteOportunidad :(registro.Oportunidad === "1") ? 'Sí':'No',
        });
    }

    showGetMov(registro){
        this.isLoading(true);
        let fecha = this.formatFecha(this.state.date);
        manager.postData(routes.spWebVisitasEditarLista, {
            WebUsuario: this.state.user,
            Fecha: fecha,
            Agente: registro.Agente,
        })
        .then(response => {
            this.isLoading(false);
            this.setHeadersDetails();
            this.setDataDetails(response);
        })
        .catch(error =>{
                this.isLoading(false);
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
            let {code} = error;

            if (code === undefined) {
                code = 500;
            }

            if(code === 401){

            }
        });    
    }

    editarRegistro = (tipo) => {

        if (this.state.ID && this.state.ID > 0) {
            this.reqEditarRegistro(tipo);
        }
    }

    formatFecha(fecha){
        if (fecha){
            let dateObject = new Date(fecha);
            //let formatted_date = (dateObject.getMonth() + 1)+ "/" + dateObject.getDate() + "/" + dateObject.getFullYear();
            let formatted_date = dateObject.getDate()+ "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();
            return formatted_date;
        } else {
            return "Sin información";
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
        console.log(this.state.CantidadPersonas)
    }

    setHeaders() {

        let headers = ["Agente","Contactos","Correos","Oportunidades","Visitas","Presupuestos","Cierres"];

        let headerItems = [];

        headerItems = headers.map((title, index) => 
                <th key={title + index}>{title}</th>
        );

        this.setState({
            headersView: headerItems
        });
    }

    setData() {

        let data = [];

        data = this.state.data.map((objV, index) => 
                <tr key={objV.ID} onClick={ (e) => this.showGetMov(objV) }>
                    <td>{objV.Nombre}</td>
                    <td>{objV.Contactos}</td>
                    <td>{objV.Correos}</td>
                    <td>{objV.Oportunidades}</td>
                    <td>{objV.Visitas}</td>
                    <td>{objV.Presupuesto}</td>
                    <td>{objV.Cierre}</td>
                </tr>
        );

        this.setState({
            dataView: data
        });
    }

    setHeadersDetails() {

        let headers = ["Agente","No. Personas","Primer Visita","Oportunidad","Visita","Fecha"];

        let headerItems = [];

        headerItems = headers.map((title, index) => 
                <th key={title + index}>{title}</th>
        );

        this.setState({
            headersDetail: headerItems
        });
    }

    setDataDetails(response) {
        let data = [];
        let objV = [];
        if(Array.isArray(response)){
            objV = response
        }

        data = objV.map((objV, index) => 
                <tr key={objV.ID} onClick={ (e) => this.showEditarRegistro(objV) }>
                    <td>{objV.Nombre}</td>
                    <td>{objV.NoPersonas}</td>
                    <td>{objV.PrimerVisita}</td>
                    <td>{objV.Oportunidad}</td>
                    <td>{objV.Visita}</td>
                    <td>{objV.Fecha}</td>
                </tr>
        );

        this.setState({
            dataDetail: data,
            showListMov: true,
        });
    }

    logout() {
        localStorage.setItem("role","");
        localStorage.setItem("user","");
        localStorage.setItem("clienteNombre", "");
        localStorage.setItem("clienteCliente", "");
        localStorage.setItem("clienteTelefonos", "");
        localStorage.setItem("clienteeMail1", "");
        localStorage.setItem("clienteeCotizacionID", "");
        localStorage.setItem("clienteeMov", "");
        localStorage.setItem("recentClients", "");
        this.props.history.replace("/login");
    }

    render() {
        return (    
            <React.Fragment>
                <Loading active={this.state.loading}/>
                <Container fluid={true} id="body_registroVisitantes">
                    <Col className="mt-3" md={12}>
                        <Titulo titulo="Registro De Visitantes"/>
                    </Col>
                    <Row className="mt-3">
                        <Col md={6} >
                        <center>
                            <DatePicker
                                locale="es"
                                selected={new Date()}
                                onChange={this.changeDate.bind(this)}
                                value={this.state.date}
                                disableClock={true}
                                isClockOpen={false}
                            />
                        </center>
                        </Col>
                        <Col className="text-right" md={6}>
                            <center>
                                <Button className="ajusteBotonSeguimiento" variant="primary" onClick={this.searchRegistros.bind(this)}> Buscar</Button>
                            </center>
                        </Col>
                    </Row>
                    <Row>
                        <Table headers={this.state.headersView} data={this.state.dataView}/>
                    </Row>
                    <Row>
                        <Col md={6} >
                            <center>
                                <Button onClick= {(e) => this.logout()} className="ajusteBotonSeguimiento" variant="success">
                                    <i className="fas fa-sign-out-alt"></i>
                                </Button>
                            </center>
                        </Col>
                        <Col md={6} >
                            <center>
                                <Button onClick= {(e) => this.traerUsuario()} className="ajusteBotonSeguimiento" variant="success">
                                    <i className="fas fa-plus"></i>
                                </Button>
                            </center>
                        </Col>
                    </Row>
                </Container>

                <Container className="modal-articulo crear-registro">
                    <Modal size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered show={ this.state.show }
                        onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar Visitante</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            {
                                (this.state.validText !== "") ?
                                <Alert variant="danger">
                                    {this.state.validText}
                                </Alert>
                                :
                                null
                            }
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Personas</label>
                                </Col>
                                <Col className="text-center">
                                    <Form.Control 
                                    as="textarea" 
                                    rows="1"
                                    onChange={this.handleChange}
                                    id="CantidadPersonas" 
                                    name="CantidadPersonas"
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Cantidad de Personas"
                                    value={this.state.CantidadPersonas} 
                                />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">¿Primera vez?</label>
                                </Col>
                                <Col className="text-center">
                                    <input type="checkbox" onChange={(e)=>this.capatandoCheck(e)} className="check" checked={(this.state.clienteNuevo === "Sí")}/>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Oportunidad</label>
                                </Col>
                                <Col className="text-center">
                                    <input type="checkbox" onChange={(e)=>this.capatandoCheckOportunidad(e)} className="check" checked={(this.state.clienteOportunidad === "Sí")}/>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Visita</label>
                                </Col>
                                <Col className="text-center">
                                    <input type="checkbox" onChange={(e)=>this.capatandoCheckVisita(e)} className="check" checked={(this.state.clienteVisita === "Sí")}/>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Asignado a:</label>
                                </Col>
                                <Col className="text-center">
                                    <Dropdown>
                                    <Dropdown.Toggle>
                                        {(this.state.agente) ? this.state.agente.Nombre :'Selecciona vendedor'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {this.state.UsuariosDropDownAsignado}
                                    </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.EnviarDatosVisitantes.bind(this)}>Guardar</Button>
                    </Modal.Footer>
                </Modal>
                </Container>

                <Container className="modal-articulo editar-registro">
                    <Modal size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered show={ this.state.showEditForm }
                        onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Container>
                            {
                                (this.state.validText !== "") ?
                                <Alert variant="danger">
                                    {this.state.validText}
                                </Alert>
                                :
                                null
                            }
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Personas</label>
                                </Col>
                                <Col className="text-center">
                                    <Form.Control 
                                    as="textarea" 
                                    rows="1"
                                    onChange={this.handleChange}
                                    id="CantidadPersonas" 
                                    name="CantidadPersonas"
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Cantidad de Personas"
                                    value={this.state.CantidadPersonas} 
                                />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">¿Primera vez?</label>
                                </Col>
                                <Col className="text-center">
                                    <input type="checkbox" onChange={(e)=>this.capatandoCheck(e)} className="check" checked={(this.state.clienteNuevo === "Sí")}/>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Oportunidad</label>
                                </Col>
                                <Col className="text-center">
                                    <input type="checkbox" onChange={(e)=>this.capatandoCheckOportunidad(e)} className="check" checked={(this.state.clienteOportunidad === "Sí")}/>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <label className="mt-2">Visita</label>
                                </Col>
                                <Col className="text-center">
                                    <input type="checkbox" onChange={(e)=>this.capatandoCheckVisita(e)} className="check" checked={(this.state.clienteVisita === "Sí")}/>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={ (e)=> this.editarRegistro("eliminar")}>Eliminar</Button>
                        <Button variant="primary" onClick={(e)=> this.editarRegistro("guardar")}>Guardar</Button>
                    </Modal.Footer>
                </Modal>
                </Container>

                <Container className="modal-articulo editar-registro">
                    <Modal dialogClassName="modal-90w"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered show={ this.state.showListMov}
                        onHide={this.handleClose.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Lista de Movimientos</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container>
                                <Table headers={this.state.headersDetail} data={this.state.dataDetail}/>
                            </Container>
                        </Modal.Body>
                    </Modal>
                </Container>
            </React.Fragment>
        );
    }
}


export default RegistroVisitantes;