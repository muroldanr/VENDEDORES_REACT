import React from 'react';
import {Row, Col } from 'react-bootstrap';
class ToogleSwitch extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value: (this.props.value)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: (props.value)
        });
    }

    onChange(event) {
        let value = event.target.checked;
        this.setState({
            value: value
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return(
            <React.Fragment>
                <Row>
                <Col xs={6} md={6} lg={6} xl={6}>
                    <center className="pt-2">
                        <h6>{this.props.title}</h6>
                    </center>
                </Col>
                <Col xs={6} md={6} lg={6} xl={6}>
                <label className="switch-widget">
                  <input type="checkbox" onChange={this.onChange.bind(this)} checked={this.state.value}/>
                  <span className="slider round"></span>
                </label>
                </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default ToogleSwitch;