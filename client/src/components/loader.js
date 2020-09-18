import React from 'react';
import Loader from 'react-loader-spinner'
 export default class app extends React.Component {
  //other logic
    render() {
     return(
      <Loader
         type="Grid"
         color="#ffffff"
         height={100}
         width={100}
         margin='auto' //3 secs
 
      />
     );
    }
 }