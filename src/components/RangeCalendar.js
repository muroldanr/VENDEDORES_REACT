import React from 'react';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './css/seguimiento.css';
import moment from 'moment';



class RangeCalendar extends React.Component{	
	constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
  }

render(){
return(
	<React.Fragment>
		<Container fluid={true} className="mb-4">
			<Row className="justify-content-center">
				<Card border="primary" style={{ width: '30rem' }} id="cardView" >
				  <Card.Header className="cardHeader text-center">Seleccione un Rango de Fechas</Card.Header>
				    <Container className="mb-3">
						<Row className="row align-items-center">						
							<Col xs={8} className="text-center mt-3">							
								<DateRangePicker
									//propiedades esteticas
									startDateId="startDate"																																									   
								    endDateId="endDate"																																																																
									small={true}									
								    showDefaultInputIcon={true}
									numberOfMonths={1}
									startDatePlaceholderText="Inicial"
									endDatePlaceholderText="Final"
									displayFormat="DD MMM YYYY"											
								    //propiedades funcionales 
								    isOutsideRange={day => (moment().diff(day) < 0)}
								    startDate={this.state.startDate}
								    endDate={this.state.endDate}
								    onDatesChange={({ startDate, endDate }) => { this.setState({ startDate, endDate })}}
								    focusedInput={this.state.focusedInput}
								    onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
								  />												  
								</Col>								
							<Col xs={4} className="mt-3 align-self-start">
								<Button className="myButtonBuscar"variant="primary"> Buscar </Button>										
							</Col>																																
						</Row>						
					</Container>
				</Card>					
			</Row>
		</Container>
	</React.Fragment>
	);
}
}
export default RangeCalendar;