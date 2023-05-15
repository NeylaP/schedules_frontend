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

function Cronogramas () {
    console.log("Hola")
  const classes = useStyles();
  const [cronogramas, setCronogramas] = useState([]);
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

  const ObtenerDatos =async()=>{
    const datos = await ObtenerCronogramas();
    setCronogramas(datos)  }

  const handleDelete = (id) => {
    setCronogramas(cronogramas.filter((item) => item.id !== id));
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

export default Cronogramas;