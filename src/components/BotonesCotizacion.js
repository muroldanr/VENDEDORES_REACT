import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class BotonesCotizacion extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        showPlus: true,
      }
    }

    clickPlus() {
      if (this.props.clickPlus) {
        this.props.clickPlus();
      }
    }

    clickDelete() {
      if (this.props.clickDelete) {
        this.props.clickDelete();
      }
    }

    clickComment() {
      if (this.props.clickComment) {
        this.props.clickComment();
      }
    }

    clickSend() {
      if (this.props.clickSend) {
        this.props.clickSend();
      }
    }

    render() {
      return (
        <Container className="mt-3">
            <Row>
              <Col>
                <center>
                  <Button className="botoncirculo" onClick={this.clickDelete.bind(this)}>
                    <FontAwesome className="car"
                      name='times'
                      size='2x' />
                  </Button>
                </center>
              </Col>
              <Col>
                <center>
                  <Button className="botoncirculo" onClick={this.clickPlus.bind(this)}>
                    <FontAwesome className='car'
                      name='plus'
                      size='2x'/>
                  </Button>
                </center>
              </Col>
              <Col>
                <center>
                    <Button className="botoncirculo" onClick={this.clickComment.bind(this)}>
                      <FontAwesome className="car"
                        name='comment'
                        size='2x' />
                    </Button>
                </center>
              </Col>
              <Col>
              <center>
                  <Button className="botoncirculo" onClick={this.clickSend.bind(this)}>
                        <FontAwesome className='car'
                        name='check'
                        size='2x'/>
                  </Button>
              </center>
             </Col>
            </Row>
        </Container>
      );
    }
}

export default BotonesCotizacion;