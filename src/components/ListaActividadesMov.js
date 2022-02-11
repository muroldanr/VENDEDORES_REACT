import React from 'react';
import routes from '../service-manager/routes';
import swal from 'sweetalert';
import manager from '../service-manager/api';
import Modal from 'react-bootstrap/Modal';
import Table from '../components/Table';

class ListaActividadesMov extends React.Component {

    constructor(props) {
      super(props);

      let headers = ["Movimiento","Vendedor", "Que", "Fecha", "Motivo", "Respuesta"];
      let user = localStorage.getItem('user');

      this.state = {
        actividades: [],
        show: (props.show),
        mov: props.mov,
        movId: props.movId,
        user: (user) ? user:'',
        headers: headers,
        headersView: [],
        data: [],
        dataView: []
      }
    }

    componentDidMount() {
      this.setHeadersActividades();
      this.cargarActividades();
    }

    componentWillReceiveProps(props) {
      if ((props.show) !== this.state.show) {
        this.setState(
          {
            show: (props.show),
            mov: props.mov,
            movId: props.movId
          },
          function() {
            this.cargarActividades();
          }
        );
      }
    }

    cargarActividades() {
      if (this.state.mov && this.state.movId) {
        this.reqActividades();
      }
    }

    reqActividades() {
      this.isLoading(true);
      manager.postData(routes.GET_HISTORICO_ACTIVIDADES, {
        WebUsuario: this.state.user,
        Modulo: 'VTAS',
        Mov: this.state.mov,
        MovID: this.state.movId
      })
      .then(response => {
        if (typeof response === "object") {
          this.setState({
              data: response
            },
            function() {
              this.setDataActividades();
            }
          );
        }
        this.isLoading(false);
      }).catch(error => {
        swal("Ocurrio un Error", "Ocurrio un error al traer la información", "error");
      });
    }

    setHeadersActividades() {
        let headerItems = [];

        headerItems = this.state.headers.map((title, index) =>
            <th key={title + index}>{title}</th>
        );

        this.setState({
            headersView: headerItems
        });
    }
    
    setDataActividades() {

        let data = [];

        data = this.state.data.map((objV, index) =>
            <tr key={objV.Titulo + index}>
                <td>{this.state.mov + ' ' + this.state.movId}</td>
                <td>{objV.AgenteNombre ? objV.AgenteNombre : "Sin información"}</td>
                <td>{objV.Medio ? objV.Medio : "Sin información"}</td>
                <td>{this.formatFecha(objV.FechaEmision)}</td>
                <td>{objV.Titulo ? objV.Titulo : "Sin información"}</td>
                <td>{objV.Solucion ? objV.Solucion : "Sin información"}</td>                            
            </tr>
        );

        this.setState({
            dataView: data
        });
    }

    formatFecha(fecha){
      if (fecha){
        let dateObject = new Date(fecha);
        let formatted_date = dateObject.getDate() + "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();
        return formatted_date;
      } else {
        return "Sin información";
      }
    }

    close() {
      this.setState({
        show: false
      });
      if (this.props.onHide) {
        this.props.onHide();
      }
    }

    isLoading(active) {
      if (this.props.isLoading) {
        this.props.isLoading(active);
      }
    }

    render() {
      return (
        <Modal 
              size="md"
              dialogClassName="modal-90w"
              aria-labelledby="contained-modal-title-vcenter"
              centered 
              show={this.state.show} 
              onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
            <Modal.Title>Actividades - {this.state.mov} {this.state.movId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table headers={this.state.headersView} data={this.state.dataView} />
        </Modal.Body>
      </Modal>
      );
    }
}

export default ListaActividadesMov;