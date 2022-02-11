import React from 'react';
import ClientDetailBotones from '../components/ClientDetailBotones';
import ClientDetailDatos from '../components/ClientDetailDatos';
import '../components/css/clientDetail.css';
import NewMenu from '../components/NewMenu';
import Loading from '../components/Loading';


class ClientDetail extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false
        };
    }

    onClickOption(option) {
        this.isLoading(true);
        setTimeout(() => {this.isLoading(false)}, 1000);
    }

    isLoading(active){
        this.setState({loading: active});
    }
 
    render(){
        return (
            <div>
                <Loading active={this.state.loading} />
                <NewMenu/>
                <div className="container-fluid" id="body_clientDetail">                    
                    <ClientDetailDatos loading={this.isLoading.bind(this)}/>
                    <ClientDetailBotones history={this.props.history} loading={this.isLoading.bind(this)} onClickOption={this.onClickOption.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default ClientDetail;