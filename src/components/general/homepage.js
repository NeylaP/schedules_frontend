import React, { useMemo } from "react";
import {AppBar,Toolbar,Typography,IconButton,makeStyles,Card,CardMedia,CardContent,Grid, Paper,} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Usuarios from "../schedules/Usuarios";
import Vehiculos from "../schedules/Vehiculos";
import Cronogramas from "../schedules/Cronogramas";
import Rutas from "../schedules/Rutas";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  card: {
    maxWidth: 300,
    margin: theme.spacing(4),
  },
  media: {
    height: 300,
    width: 300,
  },
  cardsContainer: {
    marginTop: theme.spacing(4),
  },
  paper: {
    marginTop: theme.spacing(5),
    margin: theme.spacing(2),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover
    }
  }
}));

const cardData = [
  {
    title: "Usuarios",
    description: "En este apartado podra realizar todas las tareas correspodientes a los usuarios",
    image: "https://source.unsplash.com/random",
    codigo:"usuarios_card"
  },
  {
    title: "Vehiculos",
    description: "En este apartado podra realizar todas las tareas correspodientes a los vehiculos",
    image: "https://source.unsplash.com/random",
    codigo:"vehiculos_card"
  },
  {
    title: "Rutas",
    description: "En este apartado podra realizar todas las tareas correspodientes a las rutas",
    image: "https://source.unsplash.com/random",
    codigo:"rutas_card"
  },
  {
    title: "Cronogramas",
    description: "En este apartado podra realizar todas las tareas correspodientes a los cronogramas",
    image: "https://source.unsplash.com/random",
    codigo:"cronogramas_card"
  },
];

function Homepage() {
  const classes = useStyles();
  const [seleccion, setSeleccion] = React.useState('inicio');

  const handleCardClick = (tipoSolicitud) => {
    setSeleccion(tipoSolicitud)
  };

  const vista = () => {
    switch (seleccion) {
      case "inicio":
        return MostrarSolicitudes();
      case "usuarios_card":
        return MostrarUsuarios();
      case "vehiculos_card":
        return MostrarVehiculos();
      case "rutas_card":
        return MostrarRutas();
      case "cronogramas_card":
        return MostrarCronogramas();
      default:
        return null;
    }
  };

  const MostrarSolicitudes =()=>{
    return(
      <div>
        <Grid container justify="center" className={classes.cardsContainer}>
        {cardData.map((card, index) => (
           <Paper className={classes.paper} onClick={() => handleCardClick(card.codigo)}>
            <Card className={classes.card} key={index}>
              <CardMedia
                className={classes.media}
                image={card.image}
                title={card.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
           </Paper>
        ))}
      </Grid>
      </div>
    )
  }

const MostrarUsuarios =()=>{
  return <Usuarios/>
}
const MostrarVehiculos =()=>{
  return <Vehiculos/>
}
const MostrarRutas =()=>{
  return <Rutas/>
}
const MostrarCronogramas =()=>{
  return <Cronogramas/>
}

// const contenido = vista();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Transportation SAS
          </Typography>
          <IconButton color="inherit">
            <ExitToAppIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {vista()}
    </div>
  );
};


export default Homepage;