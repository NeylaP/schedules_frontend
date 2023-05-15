import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { consulta } from "../../global/funciones";

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

  const handleDelete = (id) => {
    setVehiculos(vehiculos.filter((item) => item.id !== id));
  };

  return (
    <div>
        <Grid container className={classes.cardsContainer}>
            <Button variant="contained" color="primary">
                Nuevo registro
            </Button>
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
                        <Button onClick={() => handleDelete(item.id)}>
                            <DeleteIcon />
                        </Button>
                        <Button>
                            <EditIcon />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </div>
  );
};

export default Vehiculos;