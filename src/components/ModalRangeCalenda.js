import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import esLocale from 'moment/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import MonthPickerInput from 'react-month-picker-input';
import "react-month-picker-input/dist/react-month-picker-input.css";
import './css/elements.css';
import DatePicker from 'react-date-picker';
import Form from 'react-bootstrap/Form';

class ModalRangeCalenda extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
      fechaInicialFormateada: "",
      fechaFinalFormateada:"",
      anoSelect:"",
      mes:"",
      focused: false,
      date: null,
      dateAcumulado: new Date(),
      ejercicioStart: new Date().getFullYear(),
      ejercicio: new Date().getFullYear(),
      periodo: new Date().getMonth() + 1,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(date) {
    let fechaInicial = date
    let fechaInicialFormateada = fechaInicial.format('DD/MM/YY');
    this.setState({ fechaInicialFormateada: fechaInicialFormateada ,date});
  }

  handleChange  = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onChangeAcumulado = dateAcumulado => {
    this.setState({dateAcumulado: dateAcumulado});
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  typeBuscar(){
    if(this.props.type==="semana") {
      return <center><Button className="myButtonBuscar" variant="primary" onClick={this.pasar}> Buscar</Button></center>
    }

    if(this.props.type==="mes") {
      //return myButton = <center><Button className="myButtonBuscar" variant="primary" onClick={this.pasarAno}> Buscar </Button></center>
      return null
    }
    
    if(this.props.type==="ano") {
      return null
    }

    if(this.props.type==="acumulado") {
      return <center><Button className="myButtonBuscar" variant="primary" onClick={this.pasarAcumulado}> Buscar</Button></center>
    }

    if(this.props.type==="cohete") {
      return <center><Button className="myButtonBuscar" variant="primary" onClick={this.pasar}> Buscar</Button></center>
    }

  }

  getYears(){
    let data = [];
    for (var i = 4; i >= 0; i--) {
      data.push(<option key={this.state.ejercicioStart + i}>{this.state.ejercicioStart - i}</option>);
    }
    return(data)
  }

    typeSelect(){
      if(this.props.type==="semana"){
        return  <center>
                        <MonthPickerInput
                        className="input-center" 
                        year={2018}
                        month={8}
                        onChange={function(maskedValue,selectedMonth,selectedYear) {
                           this.setState({ mes : selectedMonth, anoSelect : selectedYear })
                           console.log(this.state.anoSelect);
                        }.bind(this)}
                        />
                </center>
      }
      if(this.props.type==="acumulado"){
        return  <center>
                  <React.Fragment>
                    <div>
                      <DatePicker
                        onChange={this.onChangeAcumulado}
                        value={this.state.dateAcumulado}
                      />
                    </div>                   
                  </React.Fragment>
                </center>
      }
      if(this.props.type==="mes") {
        return  <center>
                  <React.Fragment>
                    <Row className="m-1">
                      <Col className="mb-3 cuerpoModal" xs={12} sm={12} md={12}  lg={12} xl={12}>
                         <Form.Control as="select" id="ejercicio" onChange={this.handleChange} value={this.state.ejercicio}>
                          {this.getYears()}
                        </Form.Control>
                      </Col>
                    </Row>
                    <Col className="mb-3 cuerpoModal" xs={12} sm={12} md={12}  lg={12} xl={12}>
                    <Button className="ajusteBotonSeguimiento" variant="success" value={this.state.ejercicio} onClick={this.pasarAno}>Buscar</Button></Col>
                  </React.Fragment>
                </center>
      }

      if (this.props.type === "cohete") {
        return  <center>
                  <React.Fragment>
                    <Row className="m-1">
                      <Col className="mb-3 cuerpoModal" xs={6} sm={6} md={6}  lg={6} xl={6}>
                         <Form.Control as="select" id="ejercicio" onChange={this.handleChange} value={this.state.ejercicio}>
                          {this.getYears()}
                        </Form.Control>
                      </Col>
                      <Col className="mb-3 cuerpoModal" xs={6} sm={6} md={6}  lg={6} xl={6}>
                        <Form.Control as="select" id="periodo" onChange={this.handleChange} value={this.state.periodo}>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                        </Form.Control>
                      </Col>
                    </Row>
                  </React.Fragment>
                </center>
      }

      if(this.props.type==="ano") {
        return  null
      }
    }

  pasarAno = e => {
    this.props.onHide();
    let recibeAno = e.target.value;  
    console.log(this.state.anoSelect);
    this.props.anoSeleccionado(recibeAno);
  }

  pasar = () => {
    this.props.onHide();
    let fechas = [this.state.ejercicio,this.state.periodo];
    this.props.diaSeleccionado(fechas);
  }

    pasarAcumulado = () => {
    this.props.onHide();
    let dia = moment( this.state.dateAcumulado).format('DD/MM/YY');
    this.props.diaAcumulado(dia) 
  }

  imprimirMoment(){     
      
  } 

  render(){
    moment.locale('es', esLocale);
    return(
      <Modal
           {...this.props}
           size="md"
           aria-labelledby="contained-modal-title-vcenter"
           top
          >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <h5>Selecciona una Fecha </h5>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>  
          <Container className="mb-0">
            <Row className="text-center">
              <Col xs={12}>
                    {this.typeSelect()} 
              </Col>
              <Col xs={12} className="mt-3">
                    {this.typeBuscar()}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
    </Modal>
      );
  }

}
export default ModalRangeCalenda;