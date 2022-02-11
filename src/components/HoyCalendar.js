import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Col, Row } from 'react-bootstrap'
import timeGrid from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';

class HoyCalendar  extends React.Component{
 state = {
      calendarEvents: [        
          ],
          events: [
            { title: "WhatsApp", id: "1" },
            { title: "LLamada", id: "2" },
            { title: "Correo", id: "3" },            
          ]
    };   

	render(){
		return (
			<div className="animated fadeIn p-4 demo-app">
			   <Row >          
			     <Col lg={9} sm={9} md={9}className="widget-calendar" >
			       <div className="demo-app-calendar" id="mycalendartest">
			         <FullCalendar                  
			           header={{
			             left: 'prev,next',              
			             center: "title",
			             right: "timeGridDay"
			           
			           }}                              
			           buttonIcons={{
			             prev: 'left-single-arrow',
			             next: 'right-single-arrow',			             
			           }} 
                 buttonText= {{timeGridDay:'Hoy'}}
			           titleFormat = {{ year: 'numeric', month: 'long' }}  
			           defaultView ='timeGridDay' 			               			         
			           columnHeader={true}                                                                                          
			           allDaySlot={true}   
			           allDayText= 'hora'                
			           showNonCurrentDates={false}                                                                                                    
			           bootstrapFontAwesome = {true}                               
			           timeZone= 'local'                                                                                                
			           editable={true}
			           droppable={true}
			           plugins={[dayGridPlugin,timeGrid, interactionPlugin, bootstrapPlugin,listPlugin]}                
			           ref={this.calendarComponentRef}
			           weekends={true}                
			           events={this.state.calendarEvents}			                        			          
			           eventClick={this.eventClick}
			           locale= {esLocale}
			           themeSystem = 'bootstrap'                                
			           aspectRatio = {1.75}                 
			           listDayFormat={true} 
			           schedulerLicenseKey= 'GPL-My-Project-Is-Open-Source'              
			           columnHeaderFormat = {{ weekday: 'short' }}  
			                                                                                                           
			         />	
			         </div>
			        </Col>		       
			   </Row>
			 </div> 
			);
	}
}

export default HoyCalendar;