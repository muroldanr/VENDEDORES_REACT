import React from 'react';
import CliInputs from '../components/CliInputs';
import Table from '../components/Table';
import '../components/css/clientes.css';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import '../components/css/seguimiento.css';
import ModalUser from '../components/ModalUser';

class ModalClientes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: [],
            data: [],
            users: [],
            mostrar:false,
            loading : true,
            ID : "",
            movID : "",
            mov : "",
            isCarrito:false,
            tipo:"Clientes"
        };
    }
    
    
    handleCloseClientes(){
        this.setState({ mostrar: false });
        const {isShow} = this.props
        isShow(false)
    }

    handleChange = e => {
        this.setState({            
                [e.target.name]:e.target.value,
        });
    };

    handleClickButton = e => { 
        this.setHeaders()
        this.getData(this.state.nombre,this.state.apellido,this.state.telefono,this.state.email,this.state.tipo,this.state.clave);
    }

    setTipo = e => {
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({            
                [e.target.name]:e.target.value,
        });
    };


    handleClick = (e,objV) =>{  
        if(this.state.isCarrito){
            this.updateClienteCarrito(objV);
        } else{
           this.updateLocalStore(objV) 
        }
        this.clearForm();
    }

    updateClienteCarrito(objV){
        this.isLoading(true);
        manager.postData(routes.UPDATE_USER_CARRITO,{'WebUsuario':localStorage.getItem('user'),'Cliente':localStorage.getItem('clienteCliente'),'ClienteNuevo':objV.Cliente})
        .then(response => {
            this.updateLocalStore(objV);
            this.props.isActualizado(true);
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
        })    
    }

    clearForm(){
        this.setState({
            nombre:"",apellido:"",telefono:"",email:"",clave:""
        }
        )
    }

    updateLocalStore(objV){
        this.setNewClient(objV);
        localStorage.setItem("clienteNombre",objV.Nombre)
        localStorage.setItem("clienteCliente", (objV.Cliente) ? objV.Cliente:null)
        localStorage.setItem("clienteTelefonos",objV.Telefonos)
        localStorage.setItem("clienteeMail1",objV.eMail1)
        localStorage.setItem("clienteeCotizacion", this.state.ID);
        localStorage.setItem("clienteeCotizacionID", this.state.movID);
        localStorage.setItem("clienteeMov", this.state.mov);
        localStorage.setItem("clienteRFC", objV.RFC);
        
        this.props.isShow(false);
    }

    setNewClient(objV){
        var recentClients = []
        let recientes = localStorage.getItem('recentClients');
        if(recientes){
            recentClients = JSON.parse(recientes);
        }

        let cliente = {
            Nombre: objV.Nombre ? objV.Nombre : "",
            Cliente: objV.Cliente ? objV.Cliente : "" ,
            Telefonos: objV.Telefonos ? objV.Telefonos : "",
            eMail1: objV.eMail1 ? objV.eMail1 : "",
            clienteeCotizacion: this.state.ID ? objV.ID : "",
            clienteeCotizacionID: this.state.movID ? objV.movID : "",
            clienteeMov: this.state.mov ? objV.mov : "",
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
        
    componentDidMount() {
        var recentClients = []
        let recientes = localStorage.getItem('recentClients');
        if(recientes){
            JSON.parse(recientes);
            this.setHeaders()
            recentClients = JSON.parse(localStorage.getItem('recentClients'));
        }
        this.setData(recentClients);

      //this.setState({ mostrar: false });
    }


    componentWillReceiveProps(props) {
        this.setState({
            mostrar: props.mostrar,
            isCarrito: props.isCarrito
        });
    }

    getData(nombre,apellido,telefono,email,tipo,clave){
        this.isLoading(true);
        manager.postData(routes.GET_CLIENTES,{'Nombre':nombre,'Apellido':apellido,'Telefono':telefono,'Email':email,'Tipo':tipo,UsuarioWeb:localStorage.getItem('user'),'Clave':clave})
        .then(response => {
            this.setData(response)
            this.isLoading(false);
        })
        .catch(error =>{
            let {code} = error
            if (code === undefined) {
                code=500
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

    isLoading(active){
      if (this.props.loading) {
        this.props.loading(active);
      }
    }

    setHeaders() {
        let headers = ["Cliente", "Nombre", "Telefono", "Email"];

        let headerItems = [];

        headerItems = headers.map((title) => 
                <th key={title} >{title}</th>
         );

        this.setState({
            headers: headerItems
        });
    }

    setData(arrayClientes) {
        let objArray = arrayClientes

        let data = [];

        data = objArray.map((objV) => 
            <tr key = {objArray.id} onClick= {(e) => this.handleClick(e,objV)} >
                <td>{objV.Cliente ? objV.Cliente : ""}</td>
                <td>{objV.Nombre ? objV.Nombre : ""}</td>
                <td>{objV.Telefonos ? objV.Telefonos : ""}</td>
                <td>{objV.eMail1 ? objV.eMail1 : ""}</td>
            </tr>
        );  

        this.setState({
            data: data, 
            users: objArray
        });
    }

    openModal = texto => {
        this.setState({
            modalShow: true
        });
    }

    modalClose = () =>
    { 
        this.setState({ modalShow: false })
    };
    
    render() {
        return (
        <>
            <Modal 
                size="md"
                dialogClassName="modal-90w"
                aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.mostrar} 
                onHide={this.handleCloseClientes.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title>Clientes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CliInputs onChange={this.handleChange} tipo={this.setTipo} onButton={this.handleClickButton} handleCloseClientes={this.handleCloseClientes.bind(this)} openModal={this.openModal} />
                <Table headers={this.state.headers} data={this.state.data} />
            </Modal.Body>
            </Modal>
            <ModalUser
                show={this.state.modalShow}
                onHide={this.modalClose}
                handleCloseClientes={this.handleCloseClientes.bind(this)} 
            />
        </>
        );
    }
}
export default ModalClientes;
