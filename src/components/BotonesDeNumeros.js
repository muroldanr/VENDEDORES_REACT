import React from 'react';
import './css/carrito.css';
import { Container, Row, Col } from 'react-bootstrap';


 class BotonesDeNumeros extends React.Component {
     constructor(props) {
        super(props);
        this.state = { 
          suma:Number(props.cantidad),
          condicion:false
        }
     }

    remNumber(){
        if (this.state.suma > 1){
            this.setState(
                state => ({
                    suma: Number(this.state.suma) - 1,
                    condicion: this.props.condicionG
                }),
            );
            this.sumaEvent(Number(this.state.suma) -1);
        }
    }

    addNumber(){
        this.setState(state => ({
           suma: Number(this.state.suma) + 1,
           condicion:this.props.condicionG
           }),
        );
        this.sumaEvent(Number(this.state.suma) +1);
    }

    sumaEvent(number) {
      if (this.props.suma) {
        this.props.suma(number);
      }
    }

    newCant(cant,ID){
      this.props.count(cant,ID)
      this.setState({
        condicion: false
      });
    }

    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value,
            condicion:this.props.condicionG
        })
    }

    render() {
        return (     
            <Container className="mb-0">
              <Row className="justify-content-md-center">
                <Col md={12} xs={12} sm={12} xl={12} lg={12} className="botonNumero">
                    <input
                      className="vInput"
                      name="suma"
                      type="number"
                      min="1"
                      onChange={this.handleChange}
                      id="suma" 
                      placeholder="Cantidad"
                      value={this.state.suma}/>
                      { this.state.condicion ? <i onClick={(e) =>this.newCant(this.state.suma,this.props.ID)} className="iconoGuardar fas fa-save"/> : ""}
                   {/* <button className="menos" onClick={this.remNumber.bind(this)} >-</button>
                    <label  className="vInput"> <NumberFormat displayType="text" value={this.state.suma} decimalScale={0} /></label>
                    <button className="mas" onClick={this.addNumber.bind(this)} >+</button>
                    { this.state.condicion ? <i onClick={(e) =>this.newCant(this.state.suma,this.props.ID)} className="iconoGuardar fas fa-save"/> : ""}*/}
                </Col>
              </Row>
            </Container>
        );
    }
 }    

   export default BotonesDeNumeros;