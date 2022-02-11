import React from 'react';
import NewMenu from '../components/NewMenu';
import Titulo from '../components/Titulo';
import Table from '../components/Table';
import '../components/css/Historicoventas.css';

class HistoricoVentas extends React.Component {

    constructor(props) {
      super(props);
        this.state = {
          headers: [],
          data: [],
        };
    }

      setHeaders() {

      let headers = ["Estatus", "Sucursal","Fecha de emisión ","Movimiento"];
      let headerItems = [];

     headerItems = headers.map((title) => 
              <th><center>{title}</center></th>
      );

      this.setState({
          headers: headerItems
      });
    }

    setData() {
        let objArray = [
            {
                Estatus: "PENDIENTE",
                Sucursal: "Sucursal Monterrey",
                Fecha: "20/8/2018",
                Movimiento: "Pedido - 14237",
                
            },
            {
                Estatus: "Enviado",
                Sucursal: "Matriz",
                Fecha: "J26/12/2013",
                Movimiento: "Pedido - 14235",
            },
            {
                Estatus: "PENDIENTE",
                Sucursal: "Sucursal Monterrey",
                Fecha: "20/8/2018",
                Movimiento: "Pedido - 14237",
            },
            {
                Estatus: "Enviado",
                Sucursal: "Matriz",
                Fecha: "J26/12/2013",
                Movimiento: "Pedido - 14235",
            }
        ]
        let data = [];

        data = objArray.map((objV) => 
                <tr>
                    <td>{objV.Estatus}</td>
                    <td>{objV.Sucursal}</td>
                    <td>{objV.Fecha}</td>
                    <td>{objV.Movimiento}</td>
                </tr>
        );

        this.setState({
            data: data
        });
    }

    componentDidMount() {
      this.setHeaders()
      this.setData()
  }

    render() {
        return (    
            <div>
                <NewMenu/> 
              <div className="container-fluid" id="body_principales-a">
              <Titulo titulo={"historial de ventas de " + localStorage.getItem('user')}/>
              <Table headers={this.state.headers} data={this.state.data}/>
              </div>

            </div>     
        );
    }
}


export default HistoricoVentas;