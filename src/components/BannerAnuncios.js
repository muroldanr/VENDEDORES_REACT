import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import '../components/css/reportes.css';

class BannerAnuncios extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            mensajes: [],
            mensaje: "",
            contador: 0
        };
    }

    componentDidMount() {
      this.reqMensajes();
    }

    reqMensajes() {
      this.isLoading(true);
      manager.postData(routes.GET_BANNERS, {
        Nombre: 'Banner'
      }).then((response) => {
        this.isLoading(false);
        if (typeof response === "object" && response.length > 0) {
          this.setState({
            mensajes: response
          }, function() {
            this.setCarrousel();
          });
          return;
        }
      }).catch((error) => {
        this.isLoading(false);
        console.log(error);
      });
    }

    isLoading(loading) {
      if (this.props.isLoading) {
        this.props.isLoading(loading);
      }
    }

    setCarrousel() {
      let items = [];

      items = this.state.mensajes.map((item, index) =>
        <Carousel.Item key={index} className="item-banner">
          <img
            className="banner-image"
            src={item.RutaDoc}
            alt={item.Descripcion}
          />
          <Carousel.Caption>
            <span>{item.Descripcion}</span>
          </Carousel.Caption>
        </Carousel.Item>
      );

      this.setState({
        itemsCarrusel: items
      });
    }

    render() {
        return (
            <React.Fragment>
              <Container fluid="true">
                  <Row>
                      <Col >
                          { (this.state.itemsCarrusel)
                            ?
                            <Carousel>
                              {this.state.itemsCarrusel}
                            </Carousel>
                            :
                            null
                          }
                      </Col>
                  </Row>
              </Container>
            </React.Fragment>
        );
    }
}
export default BannerAnuncios;