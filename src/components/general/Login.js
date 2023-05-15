import React from 'react';
import { TextField, Button, Paper, Box } from '@material-ui/core';
import { ingresarApp, mostrarError } from '../../global/funciones';
import { useHistory } from 'react-router-dom';


function LoginPage() {
    const [email_data, setEmail] = React.useState('');
    const [password_data, setPassword] = React.useState('');
    
    const onSubmit = async (e) => {
        e.preventDefault();
        let email = email_data.trim()
        let password=password_data
        if (email != "" && password != "") {
            let { error, estado, resp } = await ingresarApp({ email, password});
            let titulo = 'Ha ocurrido un error, contacte con el administrador.'/*, tipo = 'error'*/;
            if (!error) {
                if (estado === 200) {
                    localStorage.setItem('token', resp.token);
                    window.location.reload();
                    return true;
                } else {
                    titulo = resp.titulo ? resp.titulo : mostrarError(resp);
                }
            }
            alert(titulo)
        }else{
            alert("Ingresar todos los datos")
        }
        
    }
    const onChangeForm = ({ target }) => {
        let { value, name } = target;
        if (name == 'email') setEmail(value)
        else if (name == 'password') setPassword(value)
      }


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper style={{ padding: 20, width: 300 }}>
        <Box mb={2}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj6eghHXZhFv1ncDtotqORNFa5NdEveOm9jw&usqp=CAU" alt="Logo" style={{ width: '100%' }} />
        </Box>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField required fullWidth id="email" name="email" autoFocus onChange={onChangeForm} label="Email" variant="outlined" margin="normal"/>
            <TextField required fullWidth id="password" name="password" autoFocus onChange={onChangeForm} label="Password" variant="outlined" margin="normal"/>
            <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={onSubmit}>Login</Button>
        </form>
        </Paper>
    </div>
  );
}
  
  export default LoginPage