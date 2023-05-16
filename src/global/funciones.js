// import Swal from "sweetalert2";

export const api = "http://127.0.0.1:8000";

export const consulta = (
  url,
  data = null,
  method = null,
  callback,
  authorization = true
) => {
  let parametros = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method === "patch") method = "PATCH";
  if (method) parametros.method = method;
  if (authorization)
    parametros.headers.Authorization = `JWT ${localStorage.getItem("token")}`;
  if (data) parametros.body = JSON.stringify(data);

  fetch(`${api}/${url}`, parametros)
    .then(async (response) => {
      const estado = response.status;
      if (estado === 401) {
        window.location.href = "/sin_sesion";
      } else {
        const resp = await response.json();
        callback(null, estado, resp);
      }
    })
    .catch((error) => callback(error));
};

export const mostrarError = (errores) => {
  for (var k in errores) {
    let r = errores[k];
    let mensaje = "";
    r.forEach((element) => {
      mensaje = `${mensaje} ${element}`;
    });
    return `${k} : ${mensaje}`;
  }
};

export const formulario = (
  url,
  data,
  method,
  callback,
  authorization = true
) => {
  let headers = {};
  if (authorization)
    headers.Authorization = `JWT ${localStorage.getItem("token")}`;
  if (method === "patch") method = "PATCH";

  fetch(`${api}/${url}`, {
    method,
    cache: "no-cache",
    mode: "cors",
    body: data,
    headers,
  })
    .then(async (response) => {
      const estado = response.status;
      if (estado === 401) {
        window.location.href = "/sin_sesion";
      } else {
        const resp = await response.json();
        callback(null, estado, resp);
      }
    })
    .catch((error) => callback(error));
};

export const crear_form_data = (data) => {
  return new Promise((resolve) => {
    let key = Object.keys(data);
    let formData = new FormData();
    key.forEach((key) => formData.append(key, data[key]));
    resolve(formData);
  });
};

export const ingresarApp = (data) => {
  return new Promise((resolve) => {
    fetch(`${api}/api/v1.0/validar_credenciales`, {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const estado = response.status;
        const resp = await response.json();
        resolve({ estado, resp });
      })
      .catch((error) => {
        resolve({ error });
      });
  });
};

export const validarUsuarioSesion = () => {
  return new Promise((resolve) => {
    if (localStorage.getItem("token")) {
      fetch(`${api}/api/v1.0/current_user`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then(async (response) => {
          const estado = response.status;
          const resp = await response.json();
          resolve({ estado, resp });
        })
        .catch((error) => {
          resolve({ error });
        });
    } else {
      resolve({ error: "No cuenta con un token" });
    }
  });
};

export const CerrarSesion = () => {
  return new Promise((resolve) => {
    localStorage.removeItem("token");
    resolve(true);
  });
};

export const getError = (llave, errores) => {
  let existe = errores.find((e) => e.llave === llave);
  return existe ? existe.mensaje : "";
};

export const obtenerValores = (generica) => {
  return new Promise((resolve) => {
    consulta(
      `api/v1.0/generica/${generica}/valores`,
      null,
      null,
      (error, estado, resp) => {
        resolve(resp);
      },
      false
    );
  });
};

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};
