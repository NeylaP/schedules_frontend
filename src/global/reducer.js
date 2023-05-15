import {
    ACT_AUTH,
    ACT_DATA_USUARIO_AUTH,
    MENSAJES,
    MOSTRAR_MODAL_MENSAJES,
  } from "./actions";
  
  const initialState = {
      auth: false,
      usuario: {
        last_name: '',
        first_name: '',
        email: '',
      },
      mensaje: {
        mostrar: false,
        tipo: "none",
        titulo: "",
        tiempo: 6000,
        onScreen: false,
      },
      mensajes: [],
      modalMensajes: false,
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case ACT_AUTH:
        return Object.assign({}, state, {
          auth: action.auth
        })
      case ACT_DATA_USUARIO_AUTH:
        return Object.assign({}, state, {
          usuario: action.usuario
        })
      case MENSAJES:
        return Object.assign({}, state, {
          mensajes: action.mensajes
        })
      case MOSTRAR_MODAL_MENSAJES:
        return Object.assign({}, state, {
          modalMensajes: action.show
        })
      default:
        return state;
    }
  }
  
  export default reducer;