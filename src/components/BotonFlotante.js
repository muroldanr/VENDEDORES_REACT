import React from 'react';
import { Col } from 'react-bootstrap';
import '../components/css/clientDetail.css';
import { Link } from 'react-router-dom';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import swal from 'sweetalert';

class BotonFlotante extends React.Component {

    constructor(props) {
      super(props);

      let user = localStorage.getItem('user');
      let cliente = localStorage.getItem('clienteCliente');

      this.state = {
        user: (user) ? user:'',
        cliente: (cliente) ? cliente:'',
        envioActivado: false
      }
    }

    componentWillReceiveProps(props) {
      this.setState({
          user: localStorage.getItem('user'),
          envioActivado: props.envioActivado ? props.envioActivado : false
      });
    }

    showModal(active){
      localStorage.setItem("condicionModalUsuario",false)
      if (this.props.onClickClientes) {
        this.props.onClickClientes(active);
      }
    }

    setClienteMostrado(){
        if(this.state.envioActivado){
            this.updateClienteCarrito();
        } else{
           this.updateLocalStore() 
        }
    }

    updateLocalStore(){
        localStorage.setItem("clienteCliente", localStorage.getItem('clienteUsuarioCliente'));
        localStorage.setItem("clienteNombre", "Cliente Mostrador");
        localStorage.setItem("clienteTelefonos", "");
        localStorage.setItem("clienteeMail1", "");
        localStorage.setItem("clienteeCotizacion", "");
        localStorage.setItem("clienteeCotizacionID", "");
        localStorage.setItem("clienteeMov", "");
        localStorage.setItem("clienteRFC", "");
        let user = localStorage.getItem('user',"");
        let cliente = localStorage.getItem('clienteCliente',"");
        this.setState({user:user,cliente:cliente});  
    }

    updateClienteCarrito(objV){
        this.isLoading(true);
        manager.postData(routes.UPDATE_USER_CARRITO,{'WebUsuario':localStorage.getItem('user'),'Cliente':localStorage.getItem('clienteCliente'),'ClienteNuevo':localStorage.getItem('clienteUsuarioCliente')})
        .then(response => {
            this.updateLocalStore();
            this.props.isActualizado(false);
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

    validar(){
      if (this.state.envioActivado===true) {
        return <div className="botonesFlotantes">
                    <button onClick={()=> this.setClienteMostrado()}  className="botonFlotante2" id="botonFlotante"><i className="fas fa-user-times link"></i></button>
                    <button onClick={()=> this.showModal(true)}  className="botonFlotante2" id="botonFlotante"><i className="fas fa-search link"></i></button>
                    {localStorage.getItem('clienteNombre') ? <button className="botonFlotante2" id="botonFlotante"><Link className="link"to="/clientDetail"><i className="fas fa-info"></i></Link></button>: "" }
                    <Col sm={4} className="colFlotante">
                        <button className="botonFlotante"><i className="fas fa-angle-double-up"></i> {localStorage.getItem('clienteNombre')? localStorage.getItem('clienteNombre'): "Seleccione un Cliente" }</button>
                    </Col>
              </div>
        }
      else {
        return <div className="botonesFlotantes">  
                        <button onClick={()=> this.setClienteMostrado()}  className="botonFlotante2" id="botonFlotante"><i className="fas fa-user-times link"></i></button>                                  
                        <button onClick={()=> this.showModal(true)}  className="botonFlotante2" id="botonFlotante"><i className="fas fa-search link"></i></button>
                        {localStorage.getItem('clienteNombre')? <button className="botonFlotante2" id="botonFlotante"><Link className="link"to="/clientDetail"><i className="fas fa-info"></i></Link></button> : "" }
                        <Col className="colFlotante">
                        <button className="botonFlotante"><i className="fas fa-angle-double-up"></i> {localStorage.getItem('clienteNombre')? localStorage.getItem('clienteNombre'): "Seleccione un Cliente" }</button>
                    </Col>
               </div>
      }
    }
     
    render() {       
        return ( 
             this.validar()
            );

    }
}
export default BotonFlotante;