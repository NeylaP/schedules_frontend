import React, { useMemo } from "react";
import {AppBar,Toolbar,Typography,IconButton,makeStyles,Card,CardMedia,CardContent,Grid, Paper, Button,} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Usuarios from "../schedules/Usuarios";
import Vehiculos from "../schedules/Vehiculos";
import Cronogramas from "../schedules/Cronogramas";
import Rutas from "../schedules/Rutas";
import coche from "../../global/imagenes/coche.png";
import chofer from "../../global/imagenes/conductor.png";
import mapa from "../../global/imagenes/mapa.png";
import cronograma from "../../global/imagenes/cronograma.png";
import { CerrarSesion } from "../../global/funciones";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
    },  
    content_text: {
      padding: "15px 10px 0px 10px",
    },
    content_img: {
      height: 50,
      width: 50,
      textAlign: "center",
    },
  }
}));

const cardData = [
  {
    title: "Usuarios",
    description: "En este apartado podra realizar todas las tareas correspodientes a los usuarios",
    image: chofer,
    codigo:"usuarios_card"
  },
  {
    title: "Vehiculos",
    description: "En este apartado podra realizar todas las tareas correspodientes a los vehiculos",
    image: coche,
    codigo:"vehiculos_card"
  },
  {
    title: "Rutas",
    description: "En este apartado podra realizar todas las tareas correspodientes a las rutas",
    image: mapa,
    codigo:"rutas_card"
  },
  {
    title: "Cronogramas",
    description: "En este apartado podra realizar todas las tareas correspodientes a los cronogramas",
    image: cronograma,
    codigo:"cronogramas_card"
  },
];

function Homepage() {
  const classes = useStyles();
  const [seleccion, setSeleccion] = React.useState('inicio');
  const rutaArchivo = window.location.pathname;
  console.log(rutaArchivo);
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
            <CardContent>
              <Grid container direction={"row"} justifyContent={"center"}>
                <Grid item xs={12} sm={12} md={12}>
                  <div style={{ position: 'relative', height: '100%' }}>
                    <img src={card.image} alt="Imagen Tipo" className={classes.content_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Grid>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Grid item xs={12} sm={12} md={12} className={classes.content_text}>
                  <Typography variant="body2" color="textSecondary" component="p" align="justify">
                    {card.description}
                  </Typography>
                </Grid>
              </Grid>
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

const handleExit = async () => {
  let resol= await CerrarSesion();
  if (resol === true) {
    window.location.reload();
  }
}

// const contenido = vista();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Transportation SAS
          </Typography>
          <Button color="inherit" onClick={() => handleExit()}>
            <ExitToAppIcon/>
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {seleccion != "inicio"?
      <IconButton onClick={() => setSeleccion("inicio")}>
        <ArrowBackIcon />
      </IconButton>
    :''}
      {vista()}
    </div>
  );
};


export default Homepage;