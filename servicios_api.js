//Configuración de la aplicación para usar express
//Importamos express
const express= require('express');
//Configuramos el cors como metodo de seguridad y restrigir las solicitudes
const cors = require('cors');
//Instanciamos express para utilizarlo
const app=express();
//Importamos los datos del archivo 'products.json' que funge como BD y los asignamos a  'products'.
const products = require('./products.json');
//Para analizar solicitudes con carga útil en formato JSON
app.use(express.json());

// Configura CORS para permitir solo solicitudes desde http://127.0.0.1:5173
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solo solicitudes desde este origen (localhost)
    methods: 'GET,HEAD', // Métodos HTTP permitidos
    credentials: true, // Habilitar el envío de credenciales (por ejemplo, cookies)
  }));
  app.use(cors({
    origin: 'https://bazaruniversal246.netlify.app/', // Permitir solo solicitudes desde este origen (localhost)
    methods: 'GET,HEAD', // Métodos HTTP permitidos
    credentials: true, // Habilitar el envío de credenciales (por ejemplo, cookies)
  }));
  
app.get('/', (req, res) => {
    res.send('Node.js API');
});

//Apis para las búsquedas y obtención de los productos

// Api para buscar productos por su nombre
app.get('/api/items/q', (req, res) => {
    // Extrae el parámetro 'name' de la consulta
    const { name } = req.query;

    // Verifica si se proporcionó un nombre para la búsqueda
    if (!name) {
        // Si no se proporciona, responde con un código de estado 400 y un mensaje de error
        return res.status(400).send('Requiere ingresar el nombre del producto para poder realizar la búsqueda.');
    }

    // Filtramos la lista de productos por el campo 'title' (nombre del producto)
    const productosFiltrados = products.products.filter(product => {
        // Comparamos el nombre del producto de forma insensible a mayúsculas y minúsculas
        return product.title.toLowerCase().includes(name.toLowerCase());
    });

    // Devolvemos la lista filtrada y la cantidad de productos encontrados
    res.send({ productos: productosFiltrados, total: productosFiltrados.length });
});


// Api para obtener los productos por su ID
app.get('/api/item/:id', (req, res) => {
    // Extrae el parámetro de la URL, convirtiéndolo a un número entero
    const productId = parseInt(req.params.id);

    // Busca el producto en la lista por su ID
    const product = products.products.find(product => product.id === productId);

    // Verifica si el producto fue encontrado
    if (!product) {
        // Si no se encuentra, responde con un código de estado 404 y un mensaje
        return res.status(404).send('El producto no fue encontrado');
    }

    // Si se encuentra, responde con el producto
    res.send(product);
});


// Define el puerto en el que escuchará el servidor. Usa el puerto proporcionado por el entorno (si existe) o el puerto 3000 por defecto.
const port = process.env.port || 3000;

// Inicia el servidor Express y escucha en el puerto especificado.
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
