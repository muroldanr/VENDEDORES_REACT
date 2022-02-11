import React from 'react';
import NewMenu from '../components/NewMenu';
import Pruebas from '../components/Pruebas';

class PipelineAutorizar extends React.Component{
    render(){
        return(
            <React.Fragment>
                <NewMenu/> 
                <div className="container-fluid" id="body_principales-a">
                    <Pruebas/>
                </div>
            </React.Fragment>
        );
    }
}

export default PipelineAutorizar;