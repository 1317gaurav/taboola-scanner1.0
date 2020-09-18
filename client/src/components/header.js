import React from "react";
import { Navbar } from "react-bootstrap";
import {Helmet} from "react-helmet";

export default class Header extends React.Component {
  //other logic
  render() {
    return (
      <div>
        <Helmet>
          
            {/* <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
              integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
              crossorigin="anonymous"
            /> */}
          
          <link href="https://fonts.googleapis.com/css2?family=Lexend+Exa&display=swap" rel="stylesheet"/>
        </Helmet>

        <Navbar >
          <Navbar.Header className='cstmnav'>
            <Navbar.Brand>
              <a href="#home" className="logo-container">
                {" "}
                <img src="/logo.png" alt="Logo" className="logo" />{" "}
               </a>
              
            </Navbar.Brand>
            <Navbar.Text  className='tname'>Scanner</Navbar.Text>
           
          </Navbar.Header>
            
          </Navbar>
      </div>
    );
  }
}

