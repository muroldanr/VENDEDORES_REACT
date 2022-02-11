import React from 'react';
import ArtSearch from '../components/ArtSearch';
import ArtCards from '../components/ArtCards';
import '../components/css/articulos.css';
import Titulo from '../components/Titulo';
import NewMenu from '../components/NewMenu';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Loading from '../components/Loading';
import BotonFlotante from '../components/BotonFlotante';


class Articulos extends React.Component {

    constructor(props){
        super(props);

        let user = localStorage.getItem('user');

        this.state ={
            pagina:1,
            filtro:'',
            loading: false,
            categorias: [],
            grupos:[],
            objetoCargarArticulo:[],
            familias:[],
            lineas:[],
            fabricantes:[],
            articulos:[],
            user: (user) ? user:'',
            disponible: true
        };
    }

    componentDidMount() {
      //this.cargarFiltro("Categoria");
      //this.cargarFiltro("Grupo");
      //this.cargarFiltro("Familia");
      //this.cargarFiltro("Linea");
      //this.cargarFiltro("Fabricante");
    }

    cargarFiltro(filter) {
        manager.postData(routes.GET_CATEGORIAS,{'Campo': filter})
        .then(response => {
            this.actualizarFiltrosEnState(filter, response);
            this.isLoading(false);
        })
        .catch(error =>{
            console.log(error);
            //const {code, message} = error
            let code = 500;
            if(code === 401){
                console.log(code);
                this.isLoading(false)
            }else {
                console.log(code);
                this.isLoading(false)
            }
        });
    }

    actualizarFiltrosEnState(filter, response) {
        switch (filter) {
            case "Categoria":
                this.setState({categorias:response})
                break;
            case "Grupo":
                this.setState({grupos:response})
                break;
            case "Familia":
                this.setState({familias:response})
                break;
            case "Linea":
                this.setState({lineas:response})
                break;
            case "Fabricante":
                this.setState({fabricantes:response})
                break;
            default:
                break;
        } 
    }

    filtrarArticulos(categoria, grupo, familia, linea, fabricante){
        let data = {};
        this.makeFilterObject(data,categoria, grupo, familia, linea, fabricante);
        this.cargarArticulos(data)

    }

    cargarArticulos(data){

        if (typeof data === "object" && Object.keys(data).length > 0) {
            this.isLoading(true);
            manager.postData(routes.GET_ARTICULOS, data)
            .then(response => {
                this.setState({articulos:response})
                this.isLoading(false);
            })
            .catch(error =>{
                let {code} = error;
                if(code===undefined){
                    code=500;
                }
                if(code === 401){
                    console.log(code);
                    this.isLoading(false)
                }else {
                    console.log(code);
                    this.isLoading(false)
                }
            });
        }
    }

    makeFilterObject(data, categoria, grupo, familia, linea, fabricante) {
        if (categoria !== undefined && categoria.length > 0) {
            data.Categoria = categoria
        }
        if (grupo !== undefined && grupo.length > 0) {
            data.Grupo = grupo
        }
        if (familia !== undefined && familia.length > 0) {
            data.Familia = familia
        }
        if (linea !== undefined && linea.length > 0) {
            data.Linea = linea
        }
        if (fabricante !== undefined && fabricante.length > 0) {
            data.Fabricante = fabricante
        }
    }

    search(busqueda, existencia){
      this.setState({
        disponible: existencia
      });
      this.cargarArticulos({
         UsuarioWeb: this.state.user,
         Articulo: busqueda,
         Disponible: existencia
      });
    }

    selectArticulo(articulo) {
        this.props.history.push({
         pathname:'/productDetail',
          state:{
            valor:articulo
          }
      });
    }

    isLoading(active){
        this.setState({loading: active});
    }

    render() {
        return (
            <div>
                <Loading active={this.state.loading}/> 
                <NewMenu/>
                <div className="container-fluid pb-5" id="body_articulos">
                    <Titulo titulo="Artículos"/>
                    <ArtSearch
                        onsearch={this.search.bind(this)}
                        onSearchFilter={this.filtrarArticulos.bind(this)}
                        categorias={this.state.categorias}
                        grupos={this.state.grupos}
                        familias={this.state.familias}
                        lineas={this.state.lineas}
                        fabricantes={this.state.fabricantes}
                        existencia={this.state.disponible}
                        />
                    <ArtCards
                        filtro={ this.state.filtro }
                        articulos={this.state.articulos}
                        disponible={this.state.disponible}
                        onSelectArticulo={this.selectArticulo.bind(this)}
                        />
                    <BotonFlotante/>
                </div>
            </div>
        );

    }
}
export default Articulos;