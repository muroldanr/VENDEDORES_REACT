import React from 'react';
import NewMenu from '../components/NewMenu';
import Pruebas from '../components/Pruebas';

class Favoritos extends React.Component {

    render() {
        return (    
            <div>
                <NewMenu/> 
                <div className="container-fluid" id="body_principales-a">
                    <Pruebas/>
                </div>
            </div>       
        );
    }
}


export default Favoritos;

