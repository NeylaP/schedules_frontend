import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { validarUsuarioSesion } from '../global/funciones';
import LoginPage from '../components/general/Login';
import Homepage from '../components/general/homepage';
function Main() {
    const [render, setRender] = React.useState(false);
    const [estado, setEstado] = React.useState(false);

    useEffect(() => {
        isAuth()
    });
  
  const isAuth = async () => {
        let { estado, resp } = await validarUsuarioSesion();
        if (estado === 200) {
            setEstado(true)
        } else {
            setEstado(false)
        }
    }

const vista = () =>{
    if (estado) return (<Homepage/>);
    else return (<LoginPage/>)
}

return(
    vista()
)

}  
  //Props del componente
  Main.propTypes = {
    //variables
    auth: PropTypes.bool.isRequired,
    usuario: PropTypes.object.isRequired,
    actualizarAuth: PropTypes.func.isRequired,
    actualizarDataUsuarioAuth: PropTypes.func.isRequired,
    actualizarMensaje: PropTypes.func.isRequired,
  }

  export default Main