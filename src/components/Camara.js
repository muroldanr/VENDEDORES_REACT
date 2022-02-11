import React from 'react'
import QrReader from 'react-qr-reader'
import { Container } from 'react-bootstrap';
 
class Camara extends React.Component {

  constructor(props) {
    super(props)

    this.handleScan = this.handleScan.bind(this);

    this.state = {
      result: ''
    }
  }


  handleScan(event){
    if(event){
      this.props.onScan(event);
      this.setState({result:event})
      console.log(event);
    }
  }

  handleError = err => {
    console.error(err)
  }
  render() {
    return (
      <Container >
        <QrReader delay={300} onError={this.handleError} onScan={this.handleScan} value={this.props.value} className="camaraContenedor"/>
          <p className="camaraContenedor">{this.state.result}</p>
      </Container>
    )
  }
}
export default Camara;