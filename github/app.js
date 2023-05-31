const express = require('express');
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
app.use(cookieParser());
const verificarToken = (req, res, next) => {
  const token = req.cookies.token; // Obtiene el token de la cookie
  if (token) {
    jwt.verify(token, 'secreto', (error, decoded) => { // Verifica el token utilizando la misma clave secreta
      if (error) {
        res.status(401).send('Token inválido');
      } else {
        req.usuario = decoded; // Almacena la información decodificada en el objeto de solicitud para su uso posterior
        next(); // Llama al siguiente middleware o al controlador de la ruta
      }
    });
  } else {
    res.status(401).send('Token no encontrado');
  }
};

const handlebars = exphbs.create({
  extname: '.html' // Especifica la extensión de archivo como .html
});
app.engine('.html', handlebars.engine);
app.set('view engine', '.html');

// Configurar carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'views')));
// Definición del esquema de registro
mongoose.connect('mongodb+srv://paologenta:2nSJCm1WHhqEADED@cluster0.rtoiqgg.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión exitosa a la base de datos');
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});
const registroSchema = new mongoose.Schema({
    nombres: String,
    apellidos: String,
    correo: String,
    contraseña: String,
    rut: Number,
  });
  
  // Crear el modelo de registro
  const Registro = mongoose.model('Registro', registroSchema);
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
// Rutas
app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Inicio.html'));
});
app.get('/Inicio', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Inicio.html'));
});


app.get('/ingreso', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Ingreso.html'));
});


// Ruta POST para procesar el formulario de registro
// Ruta POST para procesar el formulario de registro
app.post('/registro', (req, res) => {
  const { nombres, apellidos, correo, contraseña, rut } = req.body;

  // Crear una instancia del modelo Registro con los datos del formulario
  const nuevoRegistro = new Registro({
    nombres,
    apellidos,
    correo,
    contraseña,
    rut,
  });

  // Guardar el nuevo registro en la base de datos
  nuevoRegistro.save()
    .then(() => {
      // Generar el token con la información del nuevo registro
      const token = jwt.sign({ correo }, 'secreto'); // Cambia 'secreto' por tu propia clave secreta
      // Añadir el token a la respuesta como una cookie
      res.cookie('token', token, { httpOnly: true });
      res.send('¡Registro exitoso!');
    })
    .catch((error) => {
      console.error('Error al guardar el registro:', error);
      res.status(500).send('Error al guardar el registro');
    });
});

// Ruta POST para procesar el formulario de ingreso
app.post('/ingreso', (req, res) => {
  const { email, contraseña } = req.body;

  // Verifica si las credenciales de inicio de sesión son válidas (por ejemplo, consulta la base de datos)
  // Si las credenciales son válidas, genera el token
  if (email === 'usuario@example.com' && contraseña === 'contraseña') {
      const token = jwt.sign({ email }, 'secreto', { expiresIn: '3h' }); // Genera un token con una duración de 3 horas

      // Añade el token al campo oculto en el formulario
      res.render('Ingreso.html', { token });
  } else {
      res.status(401).send('Credenciales de inicio de sesión inválidas');
  }
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Registro.html'));
});

app.get('/estadodecuenta', verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'EstadoDeCuenta.html'));
});

app.get('/recargar', verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Recargar.html'));
});

app.get('/transferir', verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'transferir.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
