import React from 'react';
import './css/elements.css';


class CondicionalTabla extends React.Component {
	render() {
        return(
	        <React.Fragment>
	        	<span className={(this.props.active) ? 'ajusteDeEmoticonVisible' :'ajusteDeEmoticonHidden'}>
					<i className="fas fa-grin-beam-sweat"></i>
				</span>
	            <div className={(this.props.active) ? 'condicionalVisible' : 'condicionalHidden'}>
	                <h3>Sin información</h3>
	            </div>
	        </React.Fragment>
        )
    }
}

export default CondicionalTabla;