import React from 'react';
import { css } from '@emotion/core';
import { CircleLoader} from 'react-spinners';
import './css/loading.css';
 
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
 
class Loading extends React.Component {

  render() {
    return (
      <div className={(this.props.active) ? 'loading-content' : ''}>
        <div className={(this.props.active) ? 'loading' : ''}>
          <div >
            <CircleLoader
              css={override}
              sizeUnit={"px"}
              size={60}
              color={'var(--colorprimary)'}
              loading={this.props.active}
            />
            <h3 className={(this.props.active) ? 'loading-text' : 'loading-text-none'}>Cargando...</h3>
            <h3 className={(this.props.error) ? 'loading-text' : 'loading-text-none'}>{this.props.error}</h3>
          </div>
        </div> 
      </div>
    )
  }
}

export default Loading;