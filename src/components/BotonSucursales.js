import React from 'react';
import { Col } from 'react-bootstrap';
import '../components/css/clientDetail.css';

class BotonFlotante extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        showSucursal: false
      }
    }

    componentWillReceiveProps(props) {
      this.setState({
          showSucursal: props.showSucursal ? props.showSucursal : false
      });
    }

    showModal(active){
      if (this.props.onClick) {
        this.props.onClick(active);
      }
    }

    isLoading(active){
      if (this.props.loading) {
        this.props.loading(active);
      }
    }
     
    render() {       
        return ( 
             <div className="botonesFlotantes">
                <button onClick={()=> this.showModal(true)}  className="botonFlotante2" id="botonFlotante"><i className="fas fa-search link"></i></button>
                <Col sm={4} className="colFlotante">
                    <button className="botonFlotante"><i className="fas fa-angle-double-up"></i> {localStorage.getItem('sucursalNombre')? localStorage.getItem('sucursalNombre'): "Seleccione una Sucursal" }</button>
                </Col>
              </div>
            );
    }
}

export default BotonFlotante;