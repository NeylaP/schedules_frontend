import React, { Fragment, useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, makeStyles, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText, FormControl, InputLabel, FormControlLabel,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { consulta, crear_form_data, formulario, mostrarError } from "../../global/funciones";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  cardsContainer: {
    marginTop: theme.spacing(4),
  }
}));

const Usuarios = () => {
  const classes = useStyles();
  const [usuarios, setUsuarios] = useState([]);
  const [data_actual, setDataActual] = useState({});
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [titulo, setTitulo] = useState("Nuevo registro");
  const [open, setOpen] = useState(false);
  const [eliminar, setEliminar] = useState(false);
  const [creating, setCreating] = useState(false);
  const isInitialMount = React.useRef(true);
  React.useEffect( () => {
      //Obtengo los prceosos activos de la persona activa.
      if(isInitialMount.current){
          isInitialMount.current = false
          ObtenerDatos()
      }
  })

  const ObtenerUsuarios = async (e) => {
    return new Promise((resolve) => {
      consulta(
        `api/v1.0/users`,
        null,
        null,
        (error, estado, resp) => {
          resolve(estado === 200 && !error ? resp : null);
        }
      );
    });
  }

  const ObtenerDatos =async()=>{
    const datos = await ObtenerUsuarios();
    setUsuarios(datos)
  }

  const handleDelete = (row) => {
    setEliminar(true)
    setDataActual(row)
  };

  const Eliminar = () => {
        consulta(
          `api/v1.0/users/${data_actual.id}/delete`,
          {},
          "put",
          (error, estado, resp) => {
            let titulo = "Ha ocurrido un error, contacte con el administrador.",
              tipo = "error";
            if (!error) {
              if (estado === 200) {
                titulo = resp.titulo;
                ObtenerDatos()
                setEliminar(false)
              } else {
                tipo = "info";
                titulo = resp.titulo ? resp.titulo : mostrarError(resp);
              }
            }
            alert(titulo)
          }
        );
  };

  const handleEdit = (row) => {
    setDataActual(row)
    setLastName(row.last_name)
    setFirstName(row.first_name)
    setSsn(row.ssn)
    setDob(row.dob)
    setCity(row.city)
    setPhone(row.phone)
    setEmail(row.email)
    setAddress(row.address)
    setZip(row.zip)
    setTitulo("Modificar registro")
    setCreating(false)
    setOpen(true)

  };

  const validateInputs = () => {
    let error = '';
    if (!last_name) {
      error = "El apellido es requerido.";
    } else if (!first_name) {
      error = "El nombre es requerido.";
    } else if (!ssn) {
      error = "El número de seguro social es requerido.";
    } else if (!dob) {
      error = "La fecha de nacimiento es requerida.";
    } else if (!address) {
      error = "La dirección es requerida.";
    } else if (!city) {
      error = "La ciudad es requerida.";
    } else if (!zip) {
      error = "El código postal es requerido.";
    } else if (!phone) {
      error = "El número de teléfono es requerido.";
    } else if (!email) {
      error = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error = "El correo electrónico no es válido.";
    }
  
    return error;
  }

const Submit=()=>{
    const error = validateInputs();
    if (error) {
    alert(error);
    return;
    }else{
        const newData = { last_name, first_name, ssn, dob, address, city, zip, phone, email};
        if(creating){
            Enviar(newData);
        }else{
           Modificar(newData)
        }
    }
}

const Enviar=async(data)=>{
let form = await crear_form_data(data);
    formulario(`api/v1.0/users/create`, form, "post", (error, estado, resp) => {
      let titulo = "Ha ocurrido un error, contacte con el administrador."
      if (!error) {
        if (estado === 200) {
          titulo = resp.titulo;
          ObtenerDatos()
          setOpen(false);
        } else {
          titulo = resp.titulo ? resp.titulo : mostrarError(resp);
        }
      }
      alert(titulo)
    });
}

const Modificar=async(data)=>{
    let form = await crear_form_data(data);
    formulario(
      `api/v1.0/users/${data_actual.id}/update`,
      form,
      "patch",
      (error, estado, resp) => {
        let titulo = "Ha ocurrido un error, contacte con el administrador."
        if (!error) {
          if (estado === 200) {
            titulo = resp.titulo;
            ObtenerDatos()
            setOpen(false);
          } else {
            titulo = resp.titulo ? resp.titulo : mostrarError(resp);
          }
          alert(titulo)
        }
      }
    );
}

const handleClick=()=>{
    setOpen(true);
    setCreating(true)
}

const handleDateChange=(date)=>{
  setDob(date);
}
  return (
    <div>
        <Grid container className={classes.cardsContainer}>
            <Button variant="contained" color="primary" onClick={() =>handleClick()}>Agregar</Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell align="right">Nombre</TableCell>
                    <TableCell align="right">SSN</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Telefono</TableCell>
                    <TableCell align="right">Dirección</TableCell>
                    <TableCell align="right">Ciudad</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usuarios.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell align="right">{item.first_name+" "+item.last_name}</TableCell>
                        <TableCell align="right">{item.ssn}</TableCell>
                        <TableCell align="right">{item.email}</TableCell>
                        <TableCell align="right">{item.phone}</TableCell>
                        <TableCell align="right">{item.address}</TableCell>
                        <TableCell align="right">{item.city}</TableCell>
                        <TableCell align="right">
                        <Button onClick={() => handleDelete(item)}>
                            <DeleteIcon />
                        </Button>
                        <Button onClick={() => handleEdit(item)}>
                            <EditIcon />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Dialog open={open} onClose={() => {setOpen(false)}}>
        <DialogTitle>{titulo}</DialogTitle>
        <DialogContent>
            <form>
            <TextField
                label="Nombre"
                value={first_name}
                onChange={(event) => setFirstName(event.target.value)}
                fullWidth
            />
            <TextField
                label="Apellido"
                value={last_name}
                onChange={(event) => setLastName(event.target.value)}
                fullWidth
            />
            <TextField
                label="SSN"
                value={ssn}
                onChange={(event) => setSsn(event.target.value)}
                type="number"
                fullWidth
            />
            <FormControl fullWidth>
            <TextField
                label="Fecha de nacimiento"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
            />
            </FormControl>
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils} >
              <Fragment>
                <KeyboardDateTimePicker
                  required={true}                           
                  style={{ marginTop: 3, width: '100%' }}
                  format="MM/dd/yyyy"
                  margin="normal"
                  label="Fecha de Nacimiento"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  name="dob"
                  fullWidth
                  KeyboardButtonProps={{'aria-label': 'change date',}}
                  invalidDateMessage='Formato Invalido'
                />
              </Fragment>
            </MuiPickersUtilsProvider> */}
            <TextField
                label="Dirección"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                fullWidth
            />
            <TextField
                label="Ciudad"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                fullWidth
            />
            <TextField
                label="ZIP"
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                fullWidth
                type="number"
            />
            <TextField
                label="Celular"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                fullWidth
                type="number"
            />
            <TextField
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
            />
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button color="primary" variant="contained" onClick={() => Submit()}>Enviar</Button>
        </DialogActions>
        </Dialog>
        <Dialog open={eliminar} onClose={() => {setEliminar(false)}} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent className='scroll'>
          <DialogContentText id="alert-dialog-description">
            {'Tener en cuenta que no podrá revertir esta acción.'} {'Si desea continuar presione la opción de "Aceptar".'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setEliminar(false)}>Cancelar</Button>
            <Button color="primary" variant="contained" onClick={() => Eliminar()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
        
    </div>
  );
};

export default Usuarios;