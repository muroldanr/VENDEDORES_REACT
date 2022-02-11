import React from 'react'
import { Row, Col } from 'react-bootstrap';
import '../components/css/carrito.css';
 
class Termometro extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      caliente:"Caliente",
      tibio:"Tibio",
      frio:"Frío",
    }
  }

  render() {
    return (
        <Row className="ajusteRowTermometro">
          <Col className="ajusteColTermometroArriba" xs={12} sm={12} md={12}  lg={12} xl={12} >
            <p className="mb-0 mt-3">Caliente</p>
            <button onClick={()=> this.props.termometroClick(this.state.caliente)} className="cuerpoDelTermometro top-termometro">                                                      </button>
          </Col>
          <Col className="ajusteColTermometro" xs={12} sm={12} md={12}  lg={12} xl={12} >
            <button onClick={()=> this.props.termometroClick(this.state.tibio)}className="baseDelTermometro">                                                      </button>
          </Col>
          <Col className="ajusteColTermometro" xs={12} sm={12} md={12}  lg={12} xl={12} >
            <button onClick={()=> this.props.termometroClick(this.state.frio)} className="altoDelTermometro">Frío</button>
          </Col>
        </Row>
    )
  }
}
export default Termometro;