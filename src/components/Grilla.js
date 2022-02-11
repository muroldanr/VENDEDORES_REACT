import Card from 'react-bootstrap/Card';
import React from 'react';
import { CardColumns } from 'react-bootstrap';
import './css/home.css';
import NumberFormat from 'react-number-format';
import routes from '../service-manager/routes';

class Grilla extends React.Component {

   constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    recibirClick = (e,objV) =>{ 
           this.props.history.push({
               pathname:'/productDetail',
                state:{
                valor:objV
                }
           });
    }

    componentWillReceiveProps(nextProps) {
         this.setData();
    }

    componentDidMount() {
        this.setData();
    }

    setData() {
        let objArray = []
        if(Array.isArray(this.props.articulos)){
          objArray = this.props.articulos
        }
        let data = [];


        data = objArray.map((objV) => 
                <Card className="Cartas" onClick= {(e) => this.recibirClick(e,objV)} key={Math.random().toString(36)}>
                    <img alt="Cargando..." src={encodeURI(routes.FILES+objV.Articulo)}/>
                   
                    <Card.Body >
                    <hr/>
                      <p className="text-center font-weight-bold">{objV.Descripcion ? objV.Descripcion : " "}</p>
                      <p className="text-center">
                         <NumberFormat value={objV.PrecioLista ? objV.PrecioLista : " "} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
                      </p>
                </Card.Body>
                </Card>
           );

        this.setState({
            data: data
        });
    }

    render() {
        return (
          <CardColumns>
           {this.state.data}
          </CardColumns>
        );
    }
}
export default Grilla;