import React from 'react';
import Calendar from 'react-calendar';
import {Container } from 'react-bootstrap';
import Modal from '../components/Modal';

class AgendaCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            date: new Date(),
            diaSelect:{},            
        };
        console.log(this.props.actividad)
    }

    daySelected(date) {    
            
        let myVariable = date.getDate()  + "/" + (date.getMonth()+1) + "/" + date.getFullYear();        
        this.setState({
        modalShow: true,
        diaSelect:myVariable,        
        
         });
   
    }

    render() {
        let modalClose = () => this.setState({ modalShow: false });
        return (
            <div>                
                <Container fluid={true}>
                    <Calendar className="react-calendar"                        
                        value={this.state.date}
                        onClickDay={this.daySelected.bind(this)}/>                        
                <Modal
                    show={this.state.modalShow}
                    onHide={modalClose}   
                    date={this.state.diaSelect}
                    act={this.props.actividad}                                    
                    />
                </Container>      
            </div>
            );

    }
}
export default AgendaCalendar;