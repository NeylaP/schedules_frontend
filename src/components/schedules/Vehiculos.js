import React, { useEffect, useState } from "react";
import {
  Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, makeStyles, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText,
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

const Vehiculos = () => {
  const classes = useStyles();
  const [vehiculos, setVehiculos] = useState([]);
  const [data_actual, setDataActual] = useState({});
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
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
  const ObtenerVehiculos = async (e) => {
    return new Promise((resolve) => {
      consulta(
        `api/v1.0/vehicles`,
        null,
        null,
        (error, estado, resp) => {
          resolve(estado === 200 && !error ? resp : null);
        }
      );
    });
  }

  const ObtenerDatos =async()=>{
    const datos = await ObtenerVehiculos();
    setVehiculos(datos)
  }

  const handleDelete = (row) => {
    setEliminar(true)
    setDataActual(row)
  };

  const Eliminar = () => {
        consulta(
          `api/v1.0/vehicles/${data_actual.id}/delete`,
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
    setYear(row.year)
    setMake(row.make)
    setCapacity(row.capacity)
    setDescription(row.description)
    setTitulo("Modificar registro")
    setCreating(false)
    setOpen(true)

  };

  const validateInputs = () => {
    let error = '';
    if (!year) {
      error = "El año es requerido.";
    } else if (!make) {
      error = "El make es requerido.";
    } else if (!capacity) {
      error = "La capacidad es requerida.";
    } else if (!description) {
      error = "La descripción es requerida.";
    }
  
    return error;
  }

const Submit=()=>{
    const error = validateInputs();
    if (error) {
    alert(error);
    return;
    }else{
        const newData = { year, make, capacity, description};
        if(creating){
            Enviar(newData);
        }else{
           Modificar(newData)
        }
    }
}

const Enviar=async(data)=>{
let form = await crear_form_data(data);
    formulario(`api/v1.0/vehicles/create`, form, "post", (error, estado, resp) => {
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
      `api/v1.0/vehicles/${data_actual.id}/update`,
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

  return (
    <div>
        <Grid container className={classes.cardsContainer}>
        <Button variant="contained" color="primary" onClick={() =>handleClick()}>Agregar</Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Año</TableCell>
                    <TableCell align="right">Make</TableCell>
                    <TableCell align="right">Capacidad</TableCell>
                    <TableCell align="right">Descripción</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehiculos.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                        {item.id}
                        </TableCell>
                        <TableCell align="right">{item.year}</TableCell>
                        <TableCell align="right">{item.make}</TableCell>
                        <TableCell align="right">{item.capacity}</TableCell>
                        <TableCell align="right">{item.description}</TableCell>
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
                label="Año"
                type="number"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                fullWidth
            />
            <TextField
                label="Make"
                type="number"
                value={make}
                onChange={(event) => setMake(event.target.value)}
                fullWidth
            />
            <TextField
                label="Capacidad"
                type="number"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                fullWidth
            />
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

export default Vehiculos;