import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class BotonesSearch extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        showPlus: true,
      }
    }

    clickSearch() {
      if (this.props.clickSearch) {
        this.props.clickSearch();
      }
    }

    clickCamera() {
      if (this.props.clickCamera) {
        this.props.clickCamera();
      }
    }

    render() {
      return (
        <Container>
            <Row>
              <Col xs={6} md={6} lg={6} xl={6} className="mb-0">
                <center>
                  <Button className="botonsearch" onClick={this.clickSearch.bind(this)}>
                    Buscar
                  </Button>
                </center>
              </Col>
              <Col xs={6} md={6} lg={6} xl={6} className="mb-0">
                <center >
                  <Button className="botonsearch" onClick={this.clickCamera.bind(this)}>
                    Camara
                  </Button>
                </center>
              </Col>
            </Row>
        </Container>
      );
    }
}

export default BotonesSearch;