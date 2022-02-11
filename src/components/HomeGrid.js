import React from 'react';

import StackGrid from "react-stack-grid";
import './css/product_details.css';
import Image01 from './images/products/pro-big-1.jpg'; 
import Image02 from './images/products/pro-big-2.jpg'; 
import Image03 from './images/products/pro-big-3.jpg'; 
import Image04 from './images/products/pro-big-4.jpg'; 


class HomeGrid extends React.Component {
    render() {      
        return (
                     
                <StackGrid
                    columnWidth={150}
                >
                    <div key="key1"><img alt={"Logo"} src={Image01} /></div>
                    <div key="key2"><img alt={"Logo"} src={Image02} /></div>
                    <div key="key3"><img alt={"Logo"} src={Image03} /></div>
                    <div key="key4"><img alt={"Logo"} src={Image04} /></div>
                </StackGrid>
                 
           
                       );
               }
           }
export default HomeGrid;
