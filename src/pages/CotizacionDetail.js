import React from 'react';
import NewMenu from '../components/NewMenu';
import Loading from '../components/Loading';
import BotonFlotante from '../components/BotonFlotante';



class CotizacionDetail extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: false
        };
    }

    isLoading(active){
        this.setState({loading: active});
    }

    render(){
        return (
            <React.Fragment>
                <Loading active={this.state.loading} />
                <NewMenu/>
                <div className="container-fluid" id="body_clientDetail">                                    
                </div>  
                <BotonFlotante/>          
            </React.Fragment>
        );
    }
}
export default CotizacionDetail;