import React from 'react';
import Titulo from '../components/Titulo';
import NewMenu from '../components/NewMenu';
import BotonFlotante from '../components/BotonFlotante';
import Banners from '../components/BannerAnuncios';


class Home extends React.Component {

    constructor(props) {
        super(props);
        let user = localStorage.getItem('user');

        this.state = {
            loading : true,
            articulos: [], 
            user: (user) ? user:''
        }



    }


    isLoading(active){
        this.setState({loading: active});
    }

    componentDidMount() {

    }


    setData(array) {
        this.setState({articulos: array });
    }

    render() {
        return (
            <div> 
                <NewMenu/> 
                <div className="container-fluid" id="body_principales">
                    <Titulo titulo="Novedades"/> 
                    {/*<Banners></Banners>     */}   
                    <iframe id="inlineFrameRTORRES" 
                        title="RTORRES"
                        width="100%"
                        height="200"
                        src="https://rtorresapp.com/web/iframe.php">
                    </iframe>                              
                </div>
              <BotonFlotante/>
            </div>
        );
    }
}

export default Home;