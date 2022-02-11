import React from 'react';
import './css/articulos.css';
import NumberFormat from 'react-number-format';
import Table from '../components/Table';

class ArtCards extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filtro: '',
            dataView: [],
            articulos:[],
            arreglofiltrado:[],
            headers: [],
            headersView: []
        };
    }

    componentWillReceiveProps(props){
      let headers = ["Artículo","Descripción", "Precio lista", "Disponible", "Almacén"];
      if (!props.disponible) {
        headers = ["Artículo","Descripción", "Precio lista"];
      }
      this.setState({
        articulos: (props.articulos) ? props.articulos:[],
        arreglofiltrado: (props.articulos) ? props.articulos:[],
        filtro: (props.filtro) ? props.filtro:'',
        headers: headers
      });
      this.setHeaders();
      this.filtrar();
    }

    recibirClick = (e,objV) =>{
      if (this.props.onSelectArticulo) {
        this.props.onSelectArticulo(objV);
      }
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    setHeaders() {
      let headers = this.state.headers.map((header, index) => <th key={header + index}>{header}</th>);
      this.setState({
        headersView: headers
      });
    }

    filtrar() {

        let filters = [];
        let articulos = [];
        for (var index in this.state.articulos) {
          let articulo = this.state.articulos[index];
          if (articulo && this.state.filtro.length > 0 && (articulo.Articulo.toLowerCase().includes(this.state.filtro.toLowerCase()) ||  articulo.Descripcion.toLowerCase().includes(this.state.filtro.toLowerCase())) ) {
            filters.push(articulo);
          }
        }

        if (this.state.filtro.length === 0) {
          filters = this.state.articulos;
        }
        
        if(Array.isArray(filters)){
          articulos = filters;
        }

        let data = [];

        data = articulos.map((objV, index) => 
          <tr key={objV.Articulo +index} onClick= {(e) => this.recibirClick(e,objV)} className="cursor-pointer">
            <td className="text-center">{objV.Articulo ? objV.Articulo : " "}</td>
            <td className="text-center">{objV.Descripcion ? objV.Descripcion : " "}</td>
            <td className="text-center">
              <NumberFormat value={objV.PrecioLista} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/>
            </td>
            { (objV.Disponible) ? <td className="text-center">{objV.Disponible}</td>:null }
            { (objV.Almacen) ? <td className="text-center">{objV.Almacen}</td>:null }
          </tr>
        );

        this.setState({
            dataView: data,
            arreglofiltrado: filters
        });
    }

    render() {
      return (
        <Table id="tablacarrito" headers={this.state.headersView} data={this.state.dataView}/>
      );
    }
}

export default ArtCards;