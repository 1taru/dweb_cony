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
  
// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Inicio.html'));
});

app.get('/estadodecuenta', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'EstadoDeCuenta.htm'));
});

app.get('/ingreso', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Ingreso.html'));
});

app.get('/recargar', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Recargar.html'));
});

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
        res.send('¡Registro exitoso!');
      })
      .catch((error) => {
        console.error('Error al guardar el registro:', error);
        res.status(500).send('Error al guardar el registro');
      });
  });
  

app.get('/transferir', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'transferir.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
