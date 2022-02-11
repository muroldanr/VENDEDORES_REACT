import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import './css/product_details.css';
import swal from 'sweetalert';

class BotonCarrito extends Component {  

    constructor(props) {
      super(props);

      let user = localStorage.getItem('user');
      let cliente = localStorage.getItem('clienteCliente');

      if (cliente === "" || cliente === "null" || cliente === null) {
        localStorage.setItem("clienteCliente", localStorage.getItem('clienteUsuarioCliente'));
        localStorage.setItem("clienteNombre", "Cliente Mostrador");
        localStorage.setItem("clienteTelefonos",  "");
        localStorage.setItem("clienteeMail1", "");
        localStorage.setItem("clienteeCotizacionID", "");
        localStorage.setItem("clienteeMov", "");
        localStorage.setItem("clienteRFC", "");
        cliente = localStorage.getItem('clienteCliente');
      }

      this.state ={
         loading: true,
         user: (user) ? user:'',
         cliente: cliente,
         producto: props.producto
      };
    }

    componentWillReceiveProps(props) {
      this.setState({
        producto: props.producto
      });
    }

    isLoading(active){
       this.setState({loading: active});
    }

    recibirClick = (e,productos) =>{
        this.addcarrito();
    }

    addcarrito() {
        manager.postData(routes.ADD_CARRITO,{
          UsuarioWeb: this.state.user,
          Cliente: this.state.cliente,
          Articulo:this.state.producto.Articulo,
          Precio:this.state.producto.Precio,
          Precio2: (this.state.producto.Precio2) ? this.state.producto.Precio2: this.state.producto.Precio,
          Precio3:this.state.producto.Precio3 ? this.state.producto.Precio3: this.state.producto.Precio,
          Cantidad:this.state.producto.Cantidad,
          Almacen: this.state.producto.Almacen,
          Descripcion: ""
        })
        .then(response => {
            this.setState({response})
            this.isLoading(false);

            this.props.history.push({
               pathname:'/carrito'
            })
        })
        .catch(error =>{

            this.isLoading(false);

            let {code} = error;
            if (code === undefined) {
              code = 500;
            }

            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

            if(code === 401){

            }else {

            }
        });
    }

    render() {
        return (
            <div>                      
                <Button onClick= {(e) => this.recibirClick(e,this.props.producto)} className="miBoton">
                    <FontAwesome className="car"
                        name='cart-plus'
                        size='lg' />
                </Button>    
            </div>
        );
    }
}

export default BotonCarrito;
