import React, { Component, useState  } from 'react';
import { BrowserRouter as Brouter } from 'react-router-dom'
import { Provider } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import store from "../redux/store";
//MENSAJE
import ReactNotifications from 'react-notifications-component';
import Routes from '../routes/routes';
import Main from '../routes/main';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        {/* <ReactNotifications /> */}
        <Brouter>
          <MuiThemeProvider>
            <div id='fondo_pantalla'>
              <Main/>
            </div>
          </MuiThemeProvider>
        </Brouter>
      </Provider>
      
    );
  }
}


export default (App);