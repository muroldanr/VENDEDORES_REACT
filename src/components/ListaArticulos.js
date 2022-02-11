import React from 'react';
import Card from 'react-bootstrap/Card';
import routes from '../service-manager/routes';
import ArtCards from '../components/ArtCards';

class ListaArticulos extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        articulos: (props.articulos) ? props.articulos:[],
        articulosView: [],
        disponible: (props.disponible)
      }
    }

    componentWillMount() {
      this.setData();
    }

    componentWillReceiveProps(props) {
      this.setState({
          articulos: (props.articulos) ? props.articulos:[],
          disponible: (props.disponible)
        },
        function() {
          this.setData();
        }
      );
    }

    clickArticulo(articulo) {
      if (this.props.clickArticulo) {
        this.props.clickArticulo(articulo);
      }
    }

    makeUrl(articulo) {
      return routes.FILES + encodeURI(articulo);
    }

    setData(articulos) {

      let articulosArray = [];
      let listaArticulos = [];

       if(Array.isArray(this.props.articulos)){
          articulosArray = this.props.articulos;
       }

      listaArticulos = articulosArray.map((articulo, index) =>
          <Card className="mb-3 cursor-pointer" key={articulo + index} onClick={()=> this.clickArticulo(articulo)} style={{ width:"100%" }}>
            <Card.Body>
              <Card.Text className="imagenDeObjetos">
                <Card.Img variant="top" src={ this.makeUrl(articulo.Articulo) } />
              </Card.Text>
              <div className="TextoDeCartaDeObjetos card-text">
                <React.Fragment>
                  <h4 className="textoObjetoArticulos">{articulo.Descripcion}</h4>
                  <p>{articulo.Articulo}</p>
                </React.Fragment>
              </div>
            </Card.Body>
          </Card>
        );

      this.setState({
        articulosView: listaArticulos
      });
    }

    render() {
      return (
        <ArtCards 
          filtro=""
          articulos={this.state.articulos}
          disponible={this.state.disponible}
          onSelectArticulo={this.clickArticulo.bind(this)}
        />
      );
    }
}

export default ListaArticulos;