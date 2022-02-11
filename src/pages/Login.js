import React from 'react';
import { Row, Col ,Container,Modal} from 'react-bootstrap';
import Sesion from '../components/Sesion';
import '../components/css/login.css';
import BotonSucursales from '../components/BotonSucursales';
import Table from '../components/Table';
import routes from '../service-manager/routes';
import Loading from '../components/Loading';
import manager from '../service-manager/api';



class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            loading : false,
            showSucursales : false,
            headersSucursales: [],
            dataSusursales: [],
            sucursal:"",
        }
        let sucursal = localStorage.getItem('sucursalNombre');
        if(!sucursal){
            this.getDataSucursales();
        }
    }

    handleClose() {
    this.setState({
        showSucursales : false,
    });

    }

    isLoading(active){
        this.setState({loading: active});
    }

    submit(){
        let role = localStorage.getItem("role");

        if (role === "Recepcion") {
            this.props.history.push({
                pathname: '/registroVisitantes'
            });
        } else if(role === "Gerente"){
            this.props.history.push({
                pathname: '/home'
            });
        } else {
            this.props.history.push({
                pathname: '/home'
            });
        }
    }

    getDataSucursales(){
    this.isLoading(true);
        manager.postData(routes.GET_SUCURSALES)
        .then(response => {
            this.setHeadersSucursales()
            this.setDataSucursales(response)
            this.isLoading(false);

        }).catch(error =>{
            const {code} = error
            this.isLoading(false)
            if (code === undefined) {
                let code=500
                console.log(code);
            }
            if(code === 401){
                console.log(code);
            }else {
                console.log(code);
            }
        })
    }
    
    setHeadersSucursales() {
        let headers = ["", "Sucursal"];
        let headerItems = [];
    
        headerItems = headers.map((title) => 
             <th key={title} ><center>{title}</center></th>
        );
    
        this.setState({headersSucursales: headerItems});
    }

    setDataSucursales(response) {
      let objArray = []
      if(Array.isArray(response)){
        objArray = response
      }
      let data = [];
      data = objArray.map((objV) => 
          <tr key={objV.Sucursal} onClick= {(e) => this.actualizarSucursal(objV)} >
             <td>{objV.Sucursal ? objV.Sucursal : "Sin información"}</td>
             <td>{objV.Nombre ? objV.Nombre : "Sin información"}</td>     
          </tr>
         );
      this.setState({
          dataSusursales: data,
          showSucursales: true,
        });
    }

    actualizarSucursal(objV){
        localStorage.setItem("sucursal", objV.Sucursal)
        localStorage.setItem("sucursalNombre", objV.Nombre)
        localStorage.setItem("Categoria", objV.Categoria)
        this.handleClose()
        this.setState({sucursal:objV.Sucursal});
    }


    render() {
        console.log(localStorage.getItem("user"));

        if(localStorage.getItem("user") && localStorage.getItem("role")){
            this.submit();
        }
        return (
            <div>
                <Loading active={this.state.loading}/>
                <Row>
                    <Col>
                        <Sesion newSucursal={this.state.sucursal} successLogin={this.submit.bind(this)} history={this.props.history} />
                        <BotonSucursales onClick={() => this.getDataSucursales()} />
                    </Col>
                </Row>
                <Modal 
                        aria-labelledby="contained-modal-title-vcenter"
                        centered show={ this.state.showSucursales }
                        onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona una Sucursal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container fluid={true}>
                            <Row>
                                <Table headers={this.state.headersSucursales} data={this.state.dataSusursales}/>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal> 
            </div>
        );
    }
}

export default Login;