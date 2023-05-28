const bodyParser = require("body-parser");
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();

/**
 * Set the storage type for files using multer.diskStorage.
 *
 * @param {string} destination - The storage destination for the files.
 * @returns {Object} - Storage configuration for multer.diskStorage.
 */
const storageType = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(`public/storage/${destination}`));
        },
        filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            const extension = path.extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        }
    });
}

// Variables that configures multer to store profile images or projects images.
const uploadIMGProfile = multer({storage: storageType('img-profiles')});
const uploadIMGProjects = multer({storage: storageType('img-projects')});

// Do not change the name of the process.env,
// these will be used later if you want your project to be uploaded to the remote server.
const dbConfig = {
    host: process.env.HOST || '127.0.0.1',          // Edit the host manually if necessary
    port: process.env.PORT || 3306,                // Edit port at 3306
    user: process.env.USER || 'root',               // Edit the user according to your database
    password: process.env.PASSWORD || 'password',      // Edit the password according to your database
    database: process.env.DATABASE || 'yearbook'    // Edit the name of your database according to your database
};

/**
 * Executes a query on a MySQL database and returns the results.
 *
 * @param {string} query - The SQL query to execute.
 * @param {Array} payload - (Optional) Array of values to replace placeholders in the query.
 * @returns {Promise<Array>|null} -  Rows resulting from the query or null in case of error.
 */
const mysqlAction = async (query, payload) => {
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows, fields] = await db.execute(query, payload);
        db.end();
        return rows;
    } catch (error){
        return null;
    }
};

/**
 * Sets a path in the Express application to serve an HTML file at a specific URL.
 *
 * @param {string} url - The URL path where the HTML file will be accessed.
 * @param {string} file - The name of the HTML file (without the extension) to be served.
 */
const servePage = (url, file) => app.get(url, (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, `yearbook/${file}.html`));
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/storage', express.static(path.join(__dirname, 'public/storage')));
app.use('/yearbook', express.static(path.join(__dirname, 'yearbook')));

servePage('/', 'index');
servePage('/anuncio', 'anuncio');
servePage('/anuncios', 'anuncios');
servePage('/blog', 'blog');
servePage('/contacto', 'contacto');
servePage('/entrada', 'entrada');
servePage('/nosotros', 'nosotros');
servePage('/modificar', 'modificar');




app.get('/api/courses', async (req, res, next) => {

    const data = await mysqlAction('SELECT * FROM courses', []);

    if (data === null){
        return res.status(500).json({
            message: 'Ha ocurrido al obtener los datos'
        });
    }

    res.status(200).json(data);
});


app.post('/api/student', uploadIMGProfile.single('photo'), async (req, res, next) => {
    const name = req.body.name;
    let image = '/storage/img-profiles/default.jpg';


    if (req.file){
        image = `/storage/img-profiles/${req.file.filename}`;
    }

    const payload = [name, image];
    const data = await mysqlAction('INSERT INTO students VALUES (?, ?)', payload);

    if (data === null){
        return res.status(500).json({
            message: 'Ha ocurrido al guardar los datos'
        });
    }

    res.status(200).json({message: 'estudiante registrado'});
});

app.get("/api/students", async (req, res, next) => {
    const data = await mysqlAction('SELECT * FROM estudiantes WHERE 1',[]);
    if (data === null){
        return res.status(500).json({
             message: 'Ha ocurrido al guardar los datos'
        });
    }

    res.status(200).json(data);
});

app.get("/api/student", async (req, res, next) => {
    const id = req.query.id;
    const payload = [id];
    
    try {
        const data = await mysqlAction('SELECT * FROM Estudiantes JOIN Proyectos ON Estudiantes.EstudianteID = Proyectos.EstudianteID WHERE Estudiantes.EstudianteID = ?', payload);

        
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al obtener los datos de los estudiantes.'
        });
    }
});

app.get("/api/student/project", async (req, res, next) => {
    const id = req.query.id;
    const payload = [id];
    
    try {
        const data = await mysqlAction('SELECT * FROM proyectos WHERE EstudianteID', payload);

        
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al obtener los datos de los estudiantes.'
        });
    }
});

app.use(express.static('upload'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload');
    },
    filename: function (req, file, cb) {
      const uniqueFilename = Date.now(); // Genera un identificador único basado en la fecha actual en milisegundos
      const fileExtension = path.extname(file.originalname); // Obtiene la extensión del archivo original
      const fileName = uniqueFilename + fileExtension; // Concatena el identificador con la extensión del archivo original
      cb(null, fileName); // Asigna el
    },
    fileFilter: function (req, file, cb) {
      // Verifica la extensión del archivo
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(
          new Error(
            'Solo se permiten archivos de imagen con extensiones .jpg, .jpeg y .png'
          )
        );
      }
      cb(null, true);
    },
  });

  const upload = multer({  storage  });
app.post("/api/registrar-alumno", upload.single('foto'), async (req, res) => {
    const id = req.query.id;

    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const foto = req.foto ? req.foto : '';
    const image =req.file.filename;
    const intereses = req.body.intereses;
    const carrera = req.body.carrera;
    const frase = req.body.frase;
    const habilidades = req.body.habilidades;
    const objetivos = req.body.objetivos;


    const payload = [nombre, correo, image, intereses, carrera, frase, habilidades, objetivos];
    const query = 'INSERT INTO estudiantes (nombre, correo, foto, intereses, carrera, frase, habilidades, objetivos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    const data = await mysqlAction(query, payload);
    

    if (data === null){
        return res.status(500).json({
            message: 'Ha ocurrido un error al guardar los datos del alumno'
        });
    }

    const buscar = 'SELECT EstudianteID FROM estudiantes WHERE nombre = ?';
    const estudiante = await mysqlAction(buscar, [nombre]);
    const estudianteID = estudiante[0].EstudianteID;
    
    res.redirect(`/entrada?id=${estudianteID}`);

    
});

app.post("/api/registrar-proyecto", upload.single('fotopro'), async (req, res) => {
    const id = req.query.id;

    const nombrepro = req.body.nombrepro;
    const image =req.file.filename;
    const proyectos = req.body.proyectos;
    const idpro = req.body.ultimosDigitos;

    const payload = [nombrepro, proyectos, image, idpro];
    const query = 'INSERT INTO proyectos (NombreProyecto, Descripcion, Fotopro, EstudianteID) VALUES (?, ?, ?, ?)';
    
    const data = await mysqlAction(query, payload);
    
console.log(data)
    if (data === null){
        return res.status(500).json({
            message: 'Ha ocurrido un error al guardar los datos del proyecto'
        });
    }

    res.redirect('/')
});

// app.get('/api/buscar-alumnos', async (req, res, next) => {
//   const buscar = req.query.buscar;
//   const payload = [buscar];

//   try {
//     const data = await mysqlAction(`SELECT * FROM estudiantes WHERE Nombre LIKE ?`, [`%${buscar}%`]);

//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Ha ocurrido un error al obtener los datos de los estudiantes.'
//     });
//   }
// });


// Definir una ruta que incluya parámetros en la URL
app.get('/usuarios/:id', (req, res) => {
    // Leer el parámetro de la ruta
    const userId = req.params.id;
    console.log(userId);
    // Realizar alguna operación con el parámetro
    // ...
  
    // Enviar una respuesta al cliente
    res.send(`Usuario ID: ${userId}`);
});

app.get('/api/delete-student', async (req, res) => {
    const id = req.query.id;

    const query = 'DELETE FROM estudiantes WHERE EstudianteID = ?';
    const result = await mysqlAction(query, [id]);
    
    if (result === null) {
      return res.status(500).json({
        message: 'Ha ocurrido un error al eliminar el registro del alumno'
      });
    }
    res.redirect(`/blog`);
});

app.post('/api/actualizarEstudiante', async (req, res) => {
    const id = req.body.ultimosDigitos;
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const intereses = req.body.intereses;
    const carrera = req.body.carrera;
    const frase = req.body.frase;
    const habilidades = req.body.habilidades;
    const objetivos = req.body.objetivos;

    console.log(req.body);

    const query = `
    UPDATE estudiantes
    SET 
        Nombre = ?, 
        Correo = ?, 
        Intereses = ?, 
        Carrera = ?, 
        Frase = ?, 
        Habilidades = ?, 
        Objetivos = ? 
    WHERE EstudianteID = ?;
    `;

    const result = await mysqlAction(query, [nombre, correo, intereses, carrera, frase, habilidades, objetivos, id]);

    if (result === null) {
        return res.status(500).json({
            message: 'Ha ocurrido un error al actualizar los datos del usuario'
        });
    }

    res.redirect(`/`);
});



app.post('/api/update-project', async (req, res) => {
    const id = req.query.id;
    
    const nombrepro = req.body.nombrepro;
    const proyectos = req.body.proyectos;

    const query = `UPDATE proyectos
    SET 
    NombreProyecto = IF(? IS NOT NULL AND ? != '', ?, NombreProyecto),
    Descripcion = IF(? IS NOT NULL AND ? != '', ?, Descripcion)`;
    const result = await mysqlAction(query, [nombre, correo, id]);
    
    if (result === null) {
        return res.status(500).json({
            message: 'Ha ocurrido un error al actualizar los datos del usuario'
        });
    }
    
    res.redirect(`/`)
});

app.post('/buscaralumnos', function(req, res, next) {
    const nombre = req.body.nombre;
  
    const query = `SELECT * FROM estudiantes WHERE Nombre LIKE '%${nombre}%'`;
    conexion.query(query, function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.render('error', { message: 'Error al buscar alumnos', error: error });
      } else {
        res.render('resultados', { rows: rows });
      }
    });
  })

// ======== NO TOUCH ===========================================
app.listen(process.env.SERVER_PORT || 3000,() => {
    console.log(`Server Runnning:::::`);
});