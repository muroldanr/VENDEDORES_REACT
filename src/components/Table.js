import React from 'react';
import Table from 'react-bootstrap/Table';
import './css/principales.css';
import './css/elements.css';
import CondicionalTabla from '../components/CondicionalTabla';

class ClientDetailTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers,
            data: props.data,
            emptyTitulo:(props.data.length === 0)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            headers: props.headers,
            data: props.data
        });
        if(props.data.length === 0){
            this.setState({emptyTitulo:true});
        }else{
            this.setState({emptyTitulo:false});
        }
    }


    render() {
        return (
            <div className="container-fluid">
                <CondicionalTabla active={this.state.emptyTitulo}/>
                <Table responsive={true}  className="tabla mt-3 table-curved ">
                    <thead className="table_title">
                        <tr>
                            {!this.state.emptyTitulo ? this.state.headers:null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ClientDetailTable;