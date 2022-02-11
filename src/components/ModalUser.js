import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import swal from 'sweetalert';
import strings from '../utils/strings';
import Loading from '../components/Loading';
import '../components/css/modalUser.css';
import Table from '../components/Table';

class ModalUser extends Component {

    constructor(props){
        super(props);
        let user = localStorage.getItem('user');
        let nombreCliente = undefined;
        let telefonoCliente = undefined;
        let emailCliente = undefined;

        this.state={
            user: (user) ? user:'',
            loading : false,
            nombre: nombreCliente,
            telefono: telefonoCliente,
            correo: emailCliente,
            rfc: "XAXX010101000",
            direccion:"",
            nExt:"",
            nInt:"",
            codigoPostal:"",
            colonia:"",
            poblacion:"",
            estado:"",
            pais:"México",
            headers:[],
            data:null,
            direccionP:"",
            nExtP:"",
            nIntP:"",
            coloniaP:"",
            lpoblacionP:"",
            estadoP:"",
            codigoPostalP:"",
            PersonalTelefonos:"",
        }

        let {carrito} = this.props

        if(carrito){
            console.log(carrito)
        }else{
            console.log("NO")
        }

    }

    isLoading(active){
        if (this.props.isLoading) {
            this.props.isLoading(active);
        } else {
            this.setState({loading: active});
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

//0: {Clave: "104655"}
    saveClient = e => 
    {
        if(this.state.nombre /* && this.state.apellido */ && (/*this.state.telefono && this.state.correo && */this.state.rfc ))
        {
            e.preventDefault();
            if(this.props.carrito){
               
                let nombre = this.state.nombre
                let telefono = this.state.telefono
                let correo = this.state.correo
                let rfc = this.state.rfc
                let direccion = this.validNull(this.state.direccion)
                let nExt =this.validNull(this.state.nExt)
                let nInt =this.validNull(this.state.nInt)
                let codigoPostal =this.validNull(this.state.codigoPostal)
                let colonia =this.validNull(this.state.colonia)
                let poblacion =this.validNull(this.state.poblacion)
                let estado =this.validNull(this.state.estado)

                let direccionP = this.validNull(this.state.direccionP)
                let nExtP =this.validNull(this.state.nExtP)
                let nIntP =this.validNull(this.state.nIntP)
                let coloniaP =this.validNull(this.state.coloniaP)
                let poblacionP =this.validNull(this.state.poblacionP)
                let estadoP =this.validNull(this.state.estadoP)
                let codigoPostalP =this.validNull(this.state.codigoPostalP)
                let personalTelefonos =  this.validNull(this.state.PersonalTelefonos)


                if (rfc === null || rfc === "" || rfc === "null") {
                    rfc = "XAXX010101000";
                }

                let user = {
                    'RefNombre': nombre,
                    'RefTelefono': telefono,
                    'PersonalTelefonos': personalTelefonos,
                    'RefEmail':correo,
                    'RFC':rfc,
                    'Direccion':direccion,
                    'DireccionNumero':nExt,
                    'DireccionNumeroInt':nInt,
                    'Colonia':colonia,
                    'Poblacion':poblacion,
                    'Estado':estado,
                    'CodigoPostal':codigoPostal,
                    'PersonalDireccion':direccionP,   
                    'PersonalDireccionNumero':nExtP, 
                    'PersonalDireccionNumeroInt':nIntP, 
                    'PersonalColonia':coloniaP, 
                    'PersonalPoblacion':poblacionP, 
                    'PersonalEstado':estadoP, 
                    'PersonalCodigoPostal':codigoPostalP, 
                }

                this.props.user(user);
                
            }else{    
                this.isLoading(true);
                let rfc = this.state.rfc
                let direccion = this.validNull(this.state.direccion)
                let nExt =this.validNull(this.state.nExt)
                let nInt =this.validNull(this.state.nInt)
                let codigoPostal =this.validNull(this.state.codigoPostal)
                let colonia =this.validNull(this.state.colonia)
                let poblacion =this.validNull(this.state.poblacion)
                let estado =this.validNull(this.state.estado)

                let direccionP = this.validNull(this.state.direccionP)
                let nExtP =this.validNull(this.state.nExtP)
                let nIntP =this.validNull(this.state.nIntP)
                let coloniaP =this.validNull(this.state.coloniaP)
                let poblacionP =this.validNull(this.state.poblacionP)
                let estadoP =this.validNull(this.state.estadoP)
                let codigoPostalP =this.validNull(this.state.codigoPostalP)

                if (rfc === null || rfc === "" || rfc === "null") {
                    rfc = "XAXX010101000";
                }

                manager.postData(routes.SET_CLIENTE_NUEVO,{
                    'WebUsuario':this.state.user,  
                    'Nombre':this.state.nombre,
                    'Telefono':this.state.telefono,
                    'Email':this.state.correo,
                    'RFC':rfc,
                    'Tipo':null,
                    'Direccion':direccion,
                    'DireccionNumero':nExt,
                    'DireccionNumeroInt':nInt,
                    'Colonia':colonia,
                    'Poblacion':poblacion,
                    'Estado':estado,
                    'CodigoPostal':codigoPostal,
                    'PersonalDireccion':direccionP,   
                    'PersonalDireccionNumero':nExtP, 
                    'PersonalDireccionNumeroInt':nIntP, 
                    'PersonalColonia':coloniaP, 
                    'PersonalPoblacion':poblacionP, 
                    'PersonalEstado':estadoP, 
                    'PersonalCodigoPostal':codigoPostalP, 

                })
                .then(response => {
                    console.log(response)
                    this.isLoading(false);
                    this.props.onHide();
                    if (response["OkRef"]) {
                        swal("Ocurrio un Error",response["OkRef"] , "error");
                        return;
                    } else if (response[0]["Clave"]) {
                        swal("El cliente fue agregado correctamente!", {
                            buttons: {
                            catch: {
                                text: "Usar Cliente",
                                value: "Usar",
                                },
                            },
                        })
                        .then((value) => {
                            switch (value) {
                            
                            case "Usar":
                                this.updateClienteCarrito(response[0]["Clave"]);
                                break;
                            
                                default:
                                this.setState({
                                    nombre: "",
                                    telefono: "",
                                    correo: "",
                                    rfc: "XAXX010101000",
                                    direccion:"",
                                    nExt:"",
                                    nInt:"",
                                    codigoPostal:"",
                                    colonia:"",
                                    poblacion:"",
                                    estado:"",
                                    pais:"México",
                                });
                                return;
                            }
                        });
                        return;
                    }
                })
                .catch(error =>{
                    this.isLoading(false)
                    swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
                    console.log(error);
                });
            }
        }else{
            swal("Datos vacios", "Ingrese los datos correspondientes", "Intentelo de nuevo");
        }
    }

    closeModal = e => 
    {
        this.clearState();
        this.props.onHide();
    }

    updateClienteCarrito(objV){
        this.isLoading(true);
        manager.postData(routes.UPDATE_USER_CARRITO,{'WebUsuario':localStorage.getItem('user'),'Cliente':localStorage.getItem('clienteCliente'),'ClienteNuevo':objV})
        .then(response => {
            this.updateLocalStore(objV);
            this.isLoading(false);
        })
        .catch(error =>{
            this.isLoading(false);
            let {code} = error;
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
            console.log(error);
            if (code === undefined) {
                code=500
            }
            if(code === 401){
                
            }
        })    
    }

    validNull(value){
        if (value === null || value === "" || value === "null") {
           return "NULL";
        }else{
            return value;
        }

    }

    updateLocalStore(objV){
        localStorage.setItem("clienteNombre",this.state.nombre)
        localStorage.setItem("clienteCliente", (objV) ? objV:null)
        localStorage.setItem("clienteTelefonos",this.state.telefono)
        localStorage.setItem("clienteeMail1",this.state.correo)
        localStorage.setItem("clienteRFC", this.state.rfc);
        
        this.clearState();

        const {handleCloseClientes} = this.props
        handleCloseClientes();
    }

    clearState(){
        this.setState({
            nombre: "",
            telefono: "",
            correo: "",
            rfc: "XAXX010101000",
            direccion:"",
            nExt:"",
            nInt:"",
            codigoPostal:"",
            colonia:"",
            poblacion:"",
            estado:"",
            pais:"México",
            headers:[],
            data:null,
            direccionP:"",
            nExtP:"",
            nIntP:"",
            coloniaP:"",
            lpoblacionP:"",
            estadoP:"",
            codigoPostalP:"",
            PersonalTelefonos:"",
        });
    }

    searchAddress = (tipo,value) => {
        
        if(tipo !== "personal"){
            if ( this.state.colonia ||  this.state.codigoPostal  || this.state.poblacion ){
                this.getDirecciones(tipo,value)
            }else{
                swal("Datos vacios", "Ingrese los datos correspondientes", "error");
            }
        }else{
            if ( this.state.coloniaP ||  this.state.codigoPostalP  || this.state.poblacionP ){
                this.getDirecciones(tipo,value)
            }else{
                swal("Datos vacios", "Ingrese los datos correspondientes", "error");
            } 
        }
    }


    getDirecciones(tipo,value){
        this.isLoading(true);
        let codigoPostal = ""
        let colonia = ""
        let poblacion = ""

        if(tipo !== "personal"){
            switch (value) {
                case "codigoPostal":
                    codigoPostal = this.validNull(this.state.codigoPostal)
                break;
                case "colonia":
                    colonia = this.validNull(this.state.colonia)
                break;
                case "poblacion":
                    poblacion = this.validNull(this.state.poblacion)
                break;
                default:
                    codigoPostal = this.validNull(this.state.codigoPostal)
                    colonia = this.validNull(this.state.colonia)
                    poblacion = this.validNull(this.state.poblacion)
                break;
            }

        } else {
            switch (value) {
                case "codigoPostalP":
                    codigoPostal = this.validNull(this.state.codigoPostalP)
                break;
                case "coloniaP":
                    colonia = this.validNull(this.state.coloniaP)
                break;
                case "poblacionP":
                    poblacion = this.validNull(this.state.poblacionP)  
                break;  
                default:
                    codigoPostal = this.validNull(this.state.codigoPostalP)
                    colonia = this.validNull(this.state.coloniaP)
                    poblacion = this.validNull(this.state.poblacionP)
                break;
            }   
        }

        manager.postData(routes.GET_CODIGO_POSTAL,{
            'Colonia':colonia,  
            'Delegacion':poblacion,
            'CodigoPostal':codigoPostal,
        })
        .then(response => {
            console.log(response)
            this.isLoading(false);
            this.setHeaders();
            this.setData(response,tipo); 
        })
        .catch(error =>{
            this.isLoading(false)
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
        });
    }


    setHeaders() {
        let headers = ["C.P.", "Colonia", "Poblacion", "Estado"];

        let headerItems = [];

        headerItems = headers.map((title) =>
                <th key={title} >{title}</th>
         );

        this.setState({
            headers: headerItems
        });
    }

    setData(arrayClientes,tipo) {
        let objArray = arrayClientes

        let data = [];

        data = objArray.map((objV) =>
            <tr key = {objArray.id}  >
                <td onClick= {(e) => this.setInfo(e,objV,tipo)} >{objV.CodigoPostal}</td>
                <td onClick= {(e) => this.setInfo(e,objV,tipo)} >{objV.Colonia}</td>
                <td onClick= {(e) => this.setInfo(e,objV,tipo)} >{objV.Delegacion}</td>
                <td onClick= {(e) => this.setInfo(e,objV,tipo)} >{objV.Estado}</td>
            </tr>
        );
        this.setState({
            data: data,
        });

    }

    setInfo = (e,objV,tipo) =>{

        if(tipo !== "personal")
        {
            this.setState({
                codigoPostal: objV.CodigoPostal,
                poblacion: objV.Delegacion,
                colonia: objV.Colonia,
                estado: objV.Estado,
            });
        }else{
            this.setState({
                codigoPostalP: objV.CodigoPostal,
                poblacionP: objV.Delegacion,
                coloniaP: objV.Colonia,
                estadoP: objV.Estado,
            });
        }

    }

    tableAddress() {
        if(this.state.data){
            return   (<div className="col-12 text-center"> 
                        <button className="btn btn-light center-block" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">+</button>
                          <div className="collapse show" id="collapseExample">
                            <Table headers={this.state.headers} data={this.state.data} ></Table>
                          </div>
                      </div>)
        } else {
            return <p></p>
        }
    }

    copyData = () =>{
        this.setState({
            direccionP: this.state.direccion,
            nExtP: this.state.nExt,
            nIntP: this.state.nInt,
            coloniaP: this.state.colonia,
            poblacionP: this.state.poblacion,
            estadoP: this.state.estado,
            codigoPostalP: this.state.codigoPostal,

        });
    }

    render() {
        return (
            <Modal
                dialogClassName="modal-90w"
                show={this.props.show}
                onHide={this.props.onHide}
                size={(this.props.size) ? this.props.size:"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                scrollable="true"
               >
            <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Registrar Cliente
                    </Modal.Title>
            </Modal.Header>
                  <Modal.Body className="mt-0 pt-0 mb-0 pb-0">
                  <Loading active={this.state.loading}/>
                    <Row className="mb-3">
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input
                                onChange={this.handleChange}
                                id="nombre" 
                                name="nombre"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.NOMBRE_CLIENTE}
                                value={this.state.nombre}
                                />
                            </div>
                        </div>
                       {/** <div className="col-xs-12 col-md-4 col-lg-6 col-xlg-6 mt-3" >
                            <div className="input-field" id="inp">
                                <input
                                onChange={this.handleChange}
                                id="apellido" 
                                name="apellido"
                                type="text" 
                                className="form-control" 
                                placeholder="Apellidos"
                                value={this.state.apellido}
                                />
                            </div>
                        </div>**/}
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="telefono" 
                                name="telefono"
                                type="number" 
                                className="form-control" 
                                placeholder={strings.TELEFONO_PRINCIPAL}
                                value={this.state.telefono}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-4 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="rfc" 
                                name="rfc"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.RFC}
                                value={this.state.rfc}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="correo" 
                                name="correo"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.CORREO}
                                value={this.state.correo}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 m-0" >
                                <input className="BarraHorizontal"/>
                                <h5>Datos de Facturacion</h5>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input
                                onChange={this.handleChange}
                                id="direccion" 
                                name="direccion"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.DIRECCION}
                                value={this.state.direccion}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field " >
                                <input 
                                onChange={this.handleChange}
                                id="nExterior" 
                                name="nExt"
                                type="number" 
                                className="form-control" 
                                placeholder={strings.N_EXTERIOR}
                                value={this.state.nExt}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="nInterior" 
                                name="nInt"
                                type="number" 
                                className="form-control" 
                                placeholder={strings.N_INTERIOR}
                                value={this.state.nInt}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="estado" 
                                name="estado"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.ESTADO}
                                value={this.state.estado}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="codigoPostal" 
                                name="codigoPostal"
                                type="number"
                                className="form-control" 
                                placeholder={strings.CODIGO_POSTAL}
                                value={this.state.codigoPostal}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("fiscal","codigoPostal")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="poblacion" 
                                name="poblacion"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.POBLACION}
                                value={this.state.poblacion}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("fiscal","poblacion")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field  input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="colonia" 
                                name="colonia"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.COLONIA}
                                value={this.state.colonia}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("fiscal","colonia")}>?</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field  input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="PersonalTelefonos" 
                                name="PersonalTelefonos"
                                type="number"
                                className="form-control" 
                                placeholder={strings.TELEFONO_CONTACTO}
                                value={this.state.PersonalTelefonos}
                                />
                            </div>
                        </div>

                        {/*Informacion De entrega*/}

                        <div className="col-xs-12 col-md-12 col-lg-12 col-xlg-12 m-0" >
                                <input className="BarraHorizontal"/>
                                <Row className="mb-3">
                                    <h5  className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3">Datos de Entrega</h5> 
                                </Row>
                        </div>
                      
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input
                                onChange={this.handleChange}
                                id="direccionP" 
                                name="direccionP"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.DIRECCION}
                                value={this.state.direccionP}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field " >
                                <input 
                                onChange={this.handleChange}
                                id="nExteriorP" 
                                name="nExtP"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.N_EXTERIOR}
                                value={this.state.nExtP}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="nInteriorP" 
                                name="nIntP"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.N_INTERIOR}
                                value={this.state.nIntP}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3" >
                            <div className="input-field" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="estadoP" 
                                name="estadoP"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.ESTADO}
                                value={this.state.estadoP}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3 " >
                            <div className="input-field input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="codigoPostalP" 
                                name="codigoPostalP"
                                type="number" 
                                className="form-control" 
                                placeholder={strings.CODIGO_POSTAL}
                                value={this.state.codigoPostalP}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() => this.searchAddress("personal","codigoPostalP")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3 " >
                            <div className="input-field input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="poblacionP" 
                                name="poblacionP"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.POBLACION}
                                value={this.state.poblacionP}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("personal","poblacionP")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3 " >
                            <div className="input-field  input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="coloniaP" 
                                name="coloniaP"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.COLONIA}
                                value={this.state.coloniaP}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() => this.searchAddress("personal","coloniaP")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3 col-lg-3 col-xlg-3 mt-3 " >
                            <div className="input-field  input-group mb-3" id="inp">
                                <Button variant="light" onClick={this.copyData} >Copiar de Facturacion</Button>
                            </div>
                        </div>
                    </Row>
                        {this.tableAddress()}
                </Modal.Body>
                <Modal.Footer className="mt-0 pt-3 overflow-auto">
                    <Button onClick={this.saveClient}>Guardar</Button>
                    <Button onClick={this.closeModal}>Cancelar</Button>
                </Modal.Footer>

            </Modal>

        );
    }
}

export default ModalUser;
