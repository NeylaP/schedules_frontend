const ACT_AUTH = 'ACT_AUTH'
const ACT_DATA_USUARIO_AUTH = 'ACT_DATA_USUARIO_AUTH'
const ACT_MENSAJE = 'ACT_MENSAJE'

const actualizarMensaje = mensaje => {
    return {
      type: ACT_MENSAJE,
      mensaje,
    }
  }
  const actualizarAuth = auth => {
    return {
      type: ACT_AUTH,
      auth,
    }
  }
  const actualizarDataUsuarioAuth = usuario => {
    return {
      type: ACT_DATA_USUARIO_AUTH,
      usuario,
    }
  }