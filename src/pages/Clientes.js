import React from 'react';
import CliInputs from '../components/CliInputs';
import Table from '../components/Table';
import '../components/css/clientes.css';
import NewMenu from '../components/NewMenu';
import Loading from '../components/Loading';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Titulo from '../components/Titulo';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import ModalContacto from '../components/ModalContacto'
import ModalUser from '../components/ModalUser';


class Clientes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: [],
            data: [],  
            users: [],
            mostrar:false,
            loading : false,
            mostrarContacto:false,
            contactUser:[],
            tipo:"Clientes",
            clave:"",
        };

      this.manejarMostrar = this.manejarMostrar.bind(this);
      this.manejarCerrar = this.manejarCerrar.bind(this);
    }
    
    manejarMostrar(){
    this.setState({ mostrar: true });
    }

    manejarCerrar(){
    this.setState({ mostrar: false });
    }


    handleChange = e => {
        this.setState({            
                [e.target.name]:e.target.value,
        });
    };

    handleContacto(active){
        this.setState({            
                mostrarContacto:active,
        });
    };

    handleClickButton = e => { 
        this.setHeaders()
        this.getData(this.state.nombre,this.state.apellido,this.state.telefono,this.state.email,this.state.tipo);
    }


    handleClick = (e,objV) =>{  
        this.setNewClient(objV)
        localStorage.setItem("clienteNombre",objV.Nombre)
        localStorage.setItem("clienteCliente", (objV.Cliente) ? objV.Cliente:"")
        localStorage.setItem("clienteTelefonos",objV.Telefonos)
        localStorage.setItem("clienteeMail1",objV.eMail1)
        localStorage.setItem("clienteRFC", objV.RFC);
        this.props.history.push({
            pathname:'/ClientDetail'
        });
        this.clearForm();
    }

    clearForm(){
        this.setState({
            nombre:"",apellido:"",telefono:"",email:"",clave:""
        }
        )
    }

    handleClickContacto = (e,objV) =>{ 
        this.setState({
             mostrarContacto:true,
             contactUser:objV,
        })
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
        var recentClients2 = JSON.parse(localStorage.getItem('recentClients'));
        console.log(recentClients2)
    }

        
    componentDidMount() {
        var recentClients = []
        let recientes = localStorage.getItem('recentClients');
        if(recientes){
            this.setHeaders()
            recentClients = JSON.parse(recientes);
        }
        this.setData(recentClients);
        this.setState({mostrar:localStorage.getItem('condicionModalUsuario')})
    }

    getData(nombre,apellido,telefono,email,tipo){
            this.isLoading(true);
            manager.postData(routes.GET_CLIENTES,{'Nombre':this.state.nombre,'Apellido':this.state.apellido,'Telefono': this.state.telefono,'Email': this.state.email,'Clave':this.state.clave,'Tipo':tipo,UsuarioWeb:localStorage.getItem('user')})
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
        this.setState({loading: active});
    }

    setTipo = e => {
         console.log(e.target.name)
        console.log(e.target.value)
        this.setState({            
                [e.target.name]:e.target.value,
        });
    };

    openModal = texto => {
        this.setState({
            modalShow: true
        });
    }

    handleCloseClientes(){
        //this.props.history.push({pathname: '/carrito'});
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
            <tr key = {objArray.id}  >
                <td onClick= {(e) => this.handleClick(e,objV)} >{objV.Cliente}</td>
                <td onClick= {(e) => this.handleClick(e,objV)} >{objV.Nombre}</td>
                <td onClick= {(e) => this.handleClickContacto(e,objV)} >{objV.Telefonos}</td>
                <td onClick= {(e) => this.handleClickContacto(e,objV)} >{objV.eMail1}</td>
            </tr>
        );        
        this.setState({
            data: data, 
            users: objArray
        });
    }

    modalClose = () =>
    { 
        this.setState({ modalShow: false })
    };
    
    render() {
        return (
            <div>
                <Loading active={this.state.loading}/> 
                <NewMenu/> 
                 <div className="container-fluid" id="body_clientes">
                    <Titulo titulo="Clientes"/>
                    <CliInputs onChange={this.handleChange} tipo={this.setTipo} onButton={this.handleClickButton} handleCloseClientes={this.handleCloseClientes.bind(this)} openModal={this.openModal} />
                     <Table headers={this.state.headers} data={this.state.data} />
                 </div>
                  <Modal size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered show={this.state.mostrar} 
                      onHide={this.manejarCerrar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Aviso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                           Es necesario seleccionar un cliente
                    </Modal.Body>
                    <Modal.Footer>
                          <Button variant="secondary" onClick={this.manejarCerrar}>
                            Cerrar
                          </Button>
                    </Modal.Footer>
                  </Modal>
                  <ModalContacto 
                  WebUsuario={this.state.user}
                  Mov={this.state.movimiento}
                  MovID={this.state.movimiento}
                  mostrarContacto={this.state.mostrarContacto}
                  contactUser={this.state.contactUser} 
                  isShowContacto={this.handleContacto.bind(this)}></ModalContacto>
                  <ModalUser
                    show={this.state.modalShow}
                    onHide={this.modalClose}
                    handleCloseClientes={this.handleCloseClientes.bind(this)} 
                    />
             </div>
        );

    }
}
export default Clientes;



