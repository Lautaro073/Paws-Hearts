export const helpHttp = () => {
  const customFetch = (endpoint, options) => {
    // Cabecera por defecto para la petición...
    const defaultHeaders = {
      accept: 'application/json',
    };

    //AbortController -> Permite cancelar la petición si el endpoint no responde...
    const controller = new AbortController();
    options.signal = controller.signal;

    // Si el usuario especificó el método, utilízalo, si no, usa GET...
    options.method = options.method || 'GET';

    // Si la petición es un POST y el cuerpo es un FormData, no establezcas el Content-Type
    if (options.method === 'POST' && options.body instanceof FormData) {
      options.headers = { ...defaultHeaders };
    } else {
      // Si el usuario especifica las cabeceras, mezcla las defaultHeaders con las especificadas por el usuario, sino, utiliza las establecidas por defecto...
      options.headers = options.headers
        ? { ...defaultHeaders, ...options.headers }
        : defaultHeaders;
    }

    // Si la petición es un POST, no conviertas el cuerpo a JSON si es FormData
    if (options.body && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
    }

    // Si no hay cuerpo, elimina el campo de la petición
    if (!options.body) delete options.body;

    // Si no se recibe respuesta después de 10 segundos, se cancela la petición.
    setTimeout(() => controller.abort(), 10000);

    // Custom Fetch retorna una promesa con la ejecución de la solicitud.
    return fetch(endpoint, options)
      .then((resp) =>
        resp.ok
          ? resp.json()
          : Promise.reject({
              error: true,
              status: resp.status || '00',
              statusText: resp.statusText || 'Ocurrió un error',
            })
      )
      .catch((error) => error);
  };

  // Extraer los datos de la API
  const get = (url, options = {}) => customFetch(url, options);

  // Agregar datos a la API
  const post = (url, options = {}) => {
    options.method = 'POST';
    return customFetch(url, options);
  };

  // Modificar los datos de la API
  const put = (url, options = {}) => {
    options.method = 'PUT';
    return customFetch(url, options);
  };

  // Eliminar los datos en la API
  const del = (url, options = {}) => {
    options.method = 'DELETE';
    return customFetch(url, options);
  };

  return { get, post, put, del };
};
