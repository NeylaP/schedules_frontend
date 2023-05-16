import React, { useEffect, useState } from "react";
import {
  Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, makeStyles, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText, Select, MenuItem, InputLabel, FormControl,
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

const Rutas = () => {
  const classes = useStyles();
  const [rutas, setRutas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [description, setDescription] = useState("");
  const [driver, setDriver] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [data_actual, setDataActual] = useState({});
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

  const ObtenerRutas = async (e) => {
    return new Promise((resolve) => {
      consulta(
        `api/v1.0/routes`,
        null,
        null,
        (error, estado, resp) => {
          resolve(estado === 200 && !error ? resp : null);
        }
      );
    });
  }
  const ObtenerVehiculo = async (e) => {
    return new Promise((resolve) => {
      consulta( `api/v1.0/vehicles`,null,null,(error, estado, resp) => {
          resolve(estado === 200 && !error ? resp : null);
        }
      );
    });
  }
  const ObtenerConductores = async (e) => {
    return new Promise((resolve) => {
      consulta(`api/v1.0/users`,null,null,(error, estado, resp) => {
          resolve(estado === 200 && !error ? resp : null);
        }
      );
    });
  }

  const ObtenerDatos =async()=>{
    const datos = await ObtenerRutas();
    const conductores = await ObtenerConductores();
    const vehiculos = await ObtenerVehiculo();
    console.log(vehiculos)
    setRutas(datos)
    setVehiculos(vehiculos)
    setConductores(conductores)
  }

  const handleDelete = (row) => {
    setEliminar(true)
    setDataActual(row)
  };

  const Eliminar = () => {
        consulta(
          `api/v1.0/routes/${data_actual.id}/delete`,
          {},
          "put",
          (error, estado, resp) => {
            let titulo = "Ha ocurrido un error, contacte con el administrador."
            if (!error) {
              if (estado === 200) {
                titulo = resp.titulo;
                ObtenerDatos()
                setEliminar(false)
              } else {
                titulo = resp.titulo ? resp.titulo : mostrarError(resp);
              }
            }
            alert(titulo)
          }
        );
  };

  const handleEdit = (row) => {
    setDataActual(row)
    setDescription(row.description)
    setDriver(row.driver.id)
    setVehicle(row.vehicle.id)
    setTitulo("Modificar registro")
    setCreating(false)
    setOpen(true)

  };

  const validateInputs = () => {
    let error = '';
    if (!description) {
      error = "La descripción es requerida.";
    } else if (!driver) {
      error = "El campo conductor es requerido.";
    } else if (!vehicle) {
      error = "El campo vehiculo es requerido.";
    }
  
    return error;
  }

const Submit=()=>{
    const error = validateInputs();
    if (error) {
    alert(error);
    return;
    }else{
      const newData = { vehicle, driver, description};
        if(creating){
            Enviar(newData);
        }else{
           Modificar(newData)
        }
    }
}

const Enviar=async(data)=>{
let form = await crear_form_data(data);
    formulario(`api/v1.0/routes/create`, form, "post", (error, estado, resp) => {
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
      `api/v1.0/routes/${data_actual.id}/update`,
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
  setTitulo("Nuevo registro")
    setCreating(true)
    setOpen(true);
    
}

const handleChange = (event) => {
  setVehicle(event.target.value);
};

  return (
    <div>
        <Grid container className={classes.cardsContainer}>
        <Button variant="contained" color="primary" onClick={() =>handleClick()}>Agregar</Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Descripción</TableCell>
                    <TableCell align="right">Conductor</TableCell>
                    <TableCell align="right">Vehiculo</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rutas.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                        {item.id}
                        </TableCell>
                        <TableCell align="right">{item.description}</TableCell>
                        <TableCell align="right">{item.driver.first_name+" "+item.driver.last_name}</TableCell>
                        <TableCell align="right">{item.vehicle.description}</TableCell>
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
            <FormControl fullWidth>
             <InputLabel id="driver_select">Conductor</InputLabel>
              <Select labelId="driver_select" value={driver} onChange={(event) => setDriver(event.target.value)} label="Conductor">
                {conductores.map(({ first_name, last_name, id }) => (
                  <MenuItem key={id} value={id}>
                    {first_name+" "+last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
             <InputLabel id="vehicle_select">Vehiculo</InputLabel>
              <Select labelId="vehicle_select" value={vehicle}  onChange={handleChange} label="Vehiculo">
                {vehiculos.map(({ description, id }) => (
                  <MenuItem key={id} value={id}>
                    {description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
                label="Descripción"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
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

export default Rutas;