import React from 'react';
import CliInputs from '../components/CliInputs';
import Table from '../components/Table';
import '../components/css/clientes.css';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import '../components/css/seguimiento.css';

class ModalClientes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: [],
            data: [],
            users: [],
            mostrar:false,
            loading : true,
            tipo:"Clientes"
        };
      this.mostrarModal = this.mostrarModal.bind(this);
    }
    
    mostrarModal(active){
        this.setState({ mostrar: active });
    }

    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value,
        });
    };

    handleClickButton = e => { 
        this.setHeaders()
        this.getData(this.state.nombre,this.state.apellido,this.state.telefono,this.state.email,this.state.tipo);
    }


    handleClick = (e,objV) =>{  
        if (this.props.onSelectClient) {
            this.props.onSelectClient(objV);
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            mostrar: props.mostrar
        });
    }

    setTipo = e => {
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({            
                [e.target.name]:e.target.value,
        });
    };

    getData(nombre,apellido,telefono,email,tipo){
            this.isLoading(true);
            manager.postData(routes.GET_CLIENTES,{'Nombre':this.state.nombre,'Apellido':this.state.apellido,'Telefono':this.state.telefono,'Tipo':this.state.tipo,'Email':this.state.email,'Clave':this.state.clave,UsuarioWeb:localStorage.getItem('user')})
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

        headerItems = headers.map((title, index) => 
                <th key={title + index} >{title}</th>
         );

        this.setState({
            headers: headerItems
        });
    }

    setData(arrayClientes) {
        let objArray = arrayClientes

        let data = [];

        data = objArray.map((objV, index) => 
            <tr key = {objV.Nombre + index} onClick= {(e) => this.handleClick(e,objV)} >
                <td>{objV.Cliente}</td>
                <td>{objV.Nombre}</td>
                <td>{objV.Telefonos}</td>
                <td>{objV.eMail1}</td>
            </tr>
        );        
        this.setState({
            data: data, 
            users: objArray
        });
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
                  <Modal.Title>Clientes</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <CliInputs onChange={this.handleChange} tipo={this.setTipo} onButton={this.handleClickButton} hideCreate={true}/>
                  <Table headers={this.state.headers} data={this.state.data} />
              </Modal.Body>
            </Modal>
        );
    }
}
export default ModalClientes;
