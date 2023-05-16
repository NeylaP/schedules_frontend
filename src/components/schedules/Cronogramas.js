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

function Cronogramas () {
    console.log("Hola")
  const classes = useStyles();
  const [cronogramas, setCronogramas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [route, setRoute] = useState("");
  const [week_num, setWeekNum] = useState("");
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
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

  const ObtenerCronogramas = async (e) => {
    return new Promise((resolve) => {
      consulta(
        `api/v1.0/schedules`,
        null,
        null,
        (error, estado, resp) => {
          resolve(estado === 200 && !error ? resp : null);
        }
      );
    });
  }

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

  const ObtenerDatos =async()=>{
    const datos = await ObtenerCronogramas();
    const data_rutas = await ObtenerRutas();
    setCronogramas(datos)  
    setRutas(data_rutas)  
  }

    const handleDelete = (row) => {
      setEliminar(true)
      setDataActual(row)
    };
  
    const Eliminar = () => {
          consulta(
            `api/v1.0/schedules/${data_actual.id}/delete`,
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
      setWeekNum(row.week_num)
      setFromDate(row.from_date)
      setToDate(row.to_date)
      setRoute(row.route.id)
      setTitulo("Modificar registro")
      setCreating(false)
      setOpen(true)
  
    };
  
    const validateInputs = () => {
      let error = '';
      if (!route) {
        error = "La ruta es requerida.";
      } else if (!week_num) {
        error = "El numero de semanas es requerido.";
      } else if (!from_date) {
        error = "La fecha de inicio es requerida.";
      } else if (!to_date) {
        error = "La fecha fin es requerida.";
      }
    
      return error;
    }
  
  const Submit=()=>{
      const error = validateInputs();
      if (error) {
      alert(error);
      return;
      }else{
        const newData = { route, week_num, from_date,to_date};
          if(creating){
              Enviar(newData);
          }else{
             Modificar(newData)
          }
      }
  }
  
  const Enviar=async(data)=>{
  let form = await crear_form_data(data);
      formulario(`api/v1.0/schedules/create`, form, "post", (error, estado, resp) => {
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
        `api/v1.0/schedules/${data_actual.id}/update`,
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

  return (
    <div>
        <Grid container className={classes.cardsContainer}>
        <Button variant="contained" color="primary" onClick={() =>handleClick()}>Agregar</Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Num. Semanas</TableCell>
                    <TableCell align="right">Fecha inicio</TableCell>
                    <TableCell align="right">Fecha fin</TableCell>
                    <TableCell align="right">Ruta</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cronogramas.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                        {item.id}
                        </TableCell>
                        <TableCell align="right">{item.week_num}</TableCell>
                        <TableCell align="right">{item.from_date}</TableCell>
                        <TableCell align="right">{item.to_date}</TableCell>
                        <TableCell align="right">{item.route.description}</TableCell>
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
             <InputLabel id="route_select">Ruta</InputLabel>
              <Select labelId="route_select" value={route} onChange={(event) => setRoute(event.target.value)} label="Conductor">
                {rutas.map(({ description, id }) => (
                  <MenuItem key={id} value={id}>
                    {description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
                label="N° Semanas"
                value={week_num}
                type="number"
                onChange={(event) => setWeekNum(event.target.value)}
                fullWidth
            />
            <TextField
                label="Fecha inicio"
                value={from_date}
                onChange={(event) => setFromDate(event.target.value)}
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
            />
            <TextField
                label="Fecha fin"
                value={to_date}
                onChange={(event) => setToDate(event.target.value)}
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
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

export default Cronogramas;