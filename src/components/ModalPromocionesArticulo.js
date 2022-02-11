import React from 'react';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { Col, Row, Button } from 'react-bootstrap';
import '../components/css/seguimiento.css';
import NumberFormat from 'react-number-format';
import Gallery from 'react-grid-gallery';

const IMAGES =
[{
        src: "https://mz0glc-hdsn0tuum3sa.cloudmaestro.com/AWD4HPQCD/media/catalog/product/cache/28cb47c806b746a91bc25b380c9673fa/c/o/aconsola_century_nogal_still1_v1.jpg.pagespeed.ic.PLlYfiLONO.webp",
        thumbnail: "https://mz0glc-hdsn0tuum3sa.cloudmaestro.com/AWD4HPQCD/media/catalog/product/cache/28cb47c806b746a91bc25b380c9673fa/c/o/aconsola_century_nogal_still1_v1.jpg.pagespeed.ic.PLlYfiLONO.webp",
        thumbnailWidth: 320,
        thumbnailHeight: 174,
        isSelected: true,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "https://www.gaiadesign.com.mx/media/catalog/product/cache/28cb47c806b746a91bc25b380c9673fa/m/u/mueble_para_tv_tadao_natural_still1_v2.jpg",
        thumbnail: "https://www.gaiadesign.com.mx/media/catalog/product/cache/28cb47c806b746a91bc25b380c9673fa/m/u/mueble_para_tv_tadao_natural_still1_v2.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{value: "RTORRES", title: "RTORRES"}, {value: "Mueble", title: "Example"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},

{
        src: "https://http2.mlstatic.com/D_NQ_NP_2X_868954-MLM31997245945_082019-F.webp",
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_868954-MLM31997245945_082019-F.webp",
        thumbnailWidth: 320,
        thumbnailHeight: 212
}];

class ModalPromocionesArticulo extends React.Component {

    

    constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

        this.state = {
            headers: [],

            ver: (props.mostrar) ? true:false,
     

      
        };
    }

    componentWillReceiveProps(props) {
        
        this.setState({
            ver: (props.mostrar) ? true:false,
        
        });
    }

    
  
   
   
     


    isLoading(active){
      if (this.props.loading) {
        this.props.loading(active);
      }
    }
    
    

    render() {
        return (
            <Modal className="modal-termometro"
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered show={this.state.ver} 
                  onHide={this.props.onHide}>
                <Modal.Header closeButton>
                  <Modal.Title><center> Promociones del Articulo</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>En la compra de 3 piezas de este articulo se incluye</h4>
                    <h4>un regalo de la lista que se despliega.</h4>
                    <Gallery images={IMAGES}/>,
                   
                </Modal.Body>
                <Modal.Footer>
             
                  
                </Modal.Footer>
            </Modal>
        );
    }
}
export default ModalPromocionesArticulo;