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

const Rutas = () => {
  const classes = useStyles();
  const [rutas, setRutas] = useState([]);
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

  const ObtenerDatos =async()=>{
    const datos = await ObtenerRutas();
    setRutas(datos)
  }

  const handleDelete = (id) => {
    setRutas(rutas.filter((item) => item.id !== id));
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
                        <TableCell align="right">{item.vehicle.year}</TableCell>
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

export default Rutas;