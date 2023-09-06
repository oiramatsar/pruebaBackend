const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { format } = require('date-fns');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'ROOT',
  database: process.env.DB_NAME || 'dbPrueba'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.message);
    process.exit(1);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

// 4. EndPoint que permita listar todas las Bodegas ordenadas alfabéticamente.
app.get('/bodegas', (req, res) => {
  db.query('SELECT b.id Id_Bodega, b.nombre Nombre_Bodega, u.nombre Responsable_Bodega FROM bodegas b join users u on b.id_responsable =u.id  order by b.nombre', (err, results) => {
    if (err) {
      console.error('Error al obtener elementos: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else {
      res.status(200).json(results);
    }
  });
});

// 5. EndPoint que permite crear una Bodega. 
// {
//     "nombre" : "BODEGA 1",
//     "id_responsable" : "3",
//     "estado": "1", 
//     "created_by" : "3", 
// }
app.post('/addBodegas', (req, res) => {
  const { nombre, id_responsable, estado, created_by } = req.body;
    const created_at = new Date();
  if (!nombre || !id_responsable) {
    res.status(400).send('Los campos "nombre" e "id_responsable" son obligatorios.');
  } else {
    db.query('SELECT * FROM users where id = ?',[id_responsable], (err, results) => {
        if (err) {
          console.error('Error al obtener elementos: ' + err.message);
          res.status(500).send('Error interno del servidor');
        } else {
            if(results.length == 0){
                res.status(400).send('El id_responsable: '+id_responsable+' no existe.');
            }else{
                db.query('INSERT INTO bodegas (nombre, id_responsable, estado, created_by, created_at) VALUES (?, ?, ?, ?, ?)', 
                [nombre, id_responsable, estado, created_by, created_at], (err, result) => {
                  if (err) {
                    console.error('Error al agregar un elemento: ' + err.message);
                    res.status(500).send('La bodega ya existe');
                  } else {
                    res.status(201).send('Elemento agregado con éxito.');
                  }
                });
            }
        }
      });
  }
});

// 6. EndPoint que permita listar todos los Productos en orden descendente por el campo “Total"
app.get('/productos', (req, res) => {
    db.query('SELECT i.id_producto, p.nombre, sum(i.cantidad) Total FROM inventarios i join productos p on p.id = i.id_producto  group by i.id_producto,p.nombre  order by Total  desc', (err, results) => {
      if (err) {
        console.error('Error al obtener elementos: ' + err.message);
        res.status(500).send('Error interno del servidor');
      } else {
        res.status(200).json(results);
      }
    });
  });

// 7. EndPoint que permita crear un Producto.
app.post('/addProductos', (req, res) => {
    const { nombre, descripcion, estado, created_by, id_bodega,cantidad} = req.body;
  const created_at = new Date();
    if (!nombre || !id_bodega || !cantidad || cantidad <= 0) {
      res.status(400).send('Los campos "nombre, id_bodega y cantidad" son obligatorios, ademas la cantidad debe ser superior a 0.');
    } else {
        db.query('SELECT * FROM bodegas where id = ?',[id_bodega], (err, results) => {
            if (err) {
              console.error('Error al obtener elementos: ' + err.message);
              res.status(500).send('Error interno del servidor');
            } else {
                if(results.length == 0){
                    res.status(400).send('El id_bodega: '+id_bodega+' no existe.');
                }else{
                    db.query('SELECT * FROM productos where nombre = ?',[nombre], (err, results) => {
                        if (err) {
                          console.error('Error al obtener elementos: ' + err.message);
                          res.status(500).send('Error interno del servidor');
                        } else {
                            if(results.length > 0){
                                res.status(400).send('El nombre del producto: "'+nombre+'" ya existe. Por favor actualice la cantidad en inventario.');    
                            }else{
                                db.query('INSERT INTO productos (nombre, descripcion, estado, created_by, created_at) VALUES (?, ?, ?, ?, ?)', 
                                [nombre, descripcion, estado, created_by, created_at], (err, result) => {
                                  if (err) {
                                    console.error('Error al agregar un elemento: ' + err.message);
                                    res.status(500).send('Error interno del servidor');
                                  } else {
                                    db.query('INSERT INTO inventarios (id_bodega, id_producto, cantidad, created_by, created_at) VALUES (?,?,?,?,?)',
                                    [id_bodega, result.insertId, cantidad, created_by, created_at], (err, result) => {
                                        if (err) {
                                          console.error('Error al agregar un elemento: ' + err.message);
                                          res.status(500).send('Error interno del servidor');
                                        } else {
                                          res.status(201).send('Elemento agregado con éxito.');
                                        }
                                      });
                                  }
                                });                            
                            }
                        }
                    });
                }
            }
        });
    }
});

// 8. EndPoint que permita insertar o actualizar en inventario
app.post('/addInventario', (req, res) => {
    const { id_bodega, id_producto, cantidad, created_by} = req.body;
    if(!id_bodega || !id_producto || !cantidad || cantidad <= 0){
        res.status(400).send('Los campos "id_bodega, id_producto y cantidad" son obligatorios, ademas la cantidad debe ser superior a 0.');
    }else{
        db.query('SELECT * FROM inventarios where id_bodega = ? and id_producto = ?',[id_bodega, id_producto], (err, results) => {
            if (err) {
              console.error('Error al obtener elementos: ' + err.message);
              res.status(500).send('Error interno del servidor');
            } else {
                const created_at = new Date();
                if(results.length != 0){
                    db.query('UPDATE inventarios SET cantidad = cantidad + ?, updated_at = ?  WHERE id_bodega = ? and id_producto = ?',
                    [cantidad, created_at, id_bodega, id_producto], (err, result) => {
                        if (err) {
                            console.error('Error al agregar un elemento: ' + err.message);
                            res.status(500).send('Error interno del servido.');
                        } else {
                            res.status(201).send('Elemento actualizado con éxito.');
                        }
                    });                    
                }else{
                    db.query('INSERT INTO inventarios (id_bodega, id_producto, cantidad, created_by, created_at) VALUES (?,?,?,?,?)',
                    [id_bodega, id_producto, cantidad, created_by, created_at], (err, result) => {
                        if (err) {
                            console.error('Error al agregar un elemento: ' + err.message);
                            res.status(500).send('La bodega o producto no existe, debe crearlos primero');
                        } else {
                            res.status(201).send('Elemento agregado con éxito.');
                        }
                    });
                 }
            }
        });
    }
});

// 9. EndPoint que permite trasladar un Productos de una  bodega a otra.
app.put('/trasladarProducto/:id', async(req, res) => {
    
        const created_at = new Date();
        const id_producto = req.params.id;
        const { id_bodega_origen, id_bodega_destino, cantidad , created_by} = req.body;
        if(!id_bodega_origen || !id_bodega_destino || !id_producto || !cantidad || cantidad <= 0){
            res.status(400).send('Los campos "id_bodega_origen, id_bodega_destino, id_producto y cantidad" son obligatorios, ademas la cantidad debe ser superior a 0.');
        }else{
            if(id_bodega_origen == id_bodega_destino){
                res.status(400).send('La bodega de origen y destino son iguales.');
            }else{
                db.query('SELECT * FROM inventarios where id_bodega = ? and id_producto = ?',[id_bodega_origen, id_producto], async (err, results) => {
                    if(err){
                        console.error('Error al obtener elementos: ' + err.message);
                        res.status(500).send('Error interno del servido');
                    }else{
                        if(results.length == 0){
                            res.status(400).send('El producto "'+ id_producto+'" no existe en la bodega de origen.');
                        }else{
                            if(results[0].cantidad < cantidad){
                                res.status(400).send('La cantidad a trasladar es superior a la cantidad en inventario');
                            }else{
                                db.query('SELECT * FROM inventarios where id_bodega = ?',[id_bodega_destino], (err, results) => {
                                    if(err){
                                        console.error('Error al obtener elementos: ' + err.message);
                                        res.status(500).send('Error interno del servido');
                                    }else{
                                        if(results.length == 0){
                                            res.status(201).send('La bodega de destino no existe, debe crearla primero.');                                            
                                        }else{
                                            db.query('SELECT * FROM inventarios where id_bodega = ? and id_producto = ?',[id_bodega_destino, id_producto], (err, results) => {
                                                if(err){
                                                    console.error('Error al obtener elementos: ' + err.message);
                                                    res.status(500).send('Error interno del servido');
                                                }else{
                                                    if(results.length == 0){
                                                        db.query('INSERT INTO inventarios (id_bodega, id_producto, cantidad, created_by, created_at) VALUES (?,?,?,?,?)',
                                                        [id_bodega_destino, id_producto, cantidad, created_by, created_at], (err, result) => {
                                                            if (err) {
                                                                console.error('Error al agregar un elemento: ' + err.message);                                                                    
                                                                res.status(500).send('Error interno del servido.');
                                                            } else {
                                                                db.query('UPDATE inventarios SET cantidad = cantidad - ?, updated_at = ?  WHERE id_bodega = ? and id_producto = ?',
                                                                [cantidad, created_at, id_bodega_origen, id_producto], (err, result) => {
                                                                    if (err) {
                                                                        console.error('Error al agregar un elemento: ' + err.message);    
                                                                        res.status(500).send('Error interno del servido.');
                                                                    } else {
                                                                        res.status(201).send('Elemento agregado con éxito.');                                                                           
                                                                    }
                                                                });                                                                  
                                                            }
                                                        });
                                                    }else{
                                                        db.query('UPDATE inventarios SET cantidad = cantidad + ?, updated_at = ?  WHERE id_bodega = ? and id_producto = ?',
                                                        [cantidad, created_at, id_bodega_destino, id_producto], (err, result) => {
                                                            if (err) {
                                                                console.error('Error al agregar un elemento: ' + err.message);
                                                                res.status(500).send('Error interno del servido.');
                                                            } else {
                                                                db.query('UPDATE inventarios SET cantidad = cantidad - ?, updated_at = ?  WHERE id_bodega = ? and id_producto = ?',
                                                                [cantidad, created_at, id_bodega_origen, id_producto], (err, result) => {
                                                                    if (err) {
                                                                        console.error('Error al agregar un elemento: ' + err.message);    
                                                                        res.status(500).send('Error interno del servido.');
                                                                    } else {
                                                                        res.status(201).send('Elemento actualizado con éxito.');                                                                            
                                                                    }
                                                                });                                                            
                                                            }
                                                        });           
                                                    }
                                                    

                                                }
                                            });
                                        }                                                      
                                    }
                                });                             
                                
                            }
                        }
                    }
                });
            };
            
        } 
    

});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API escuchando en el puerto ${port}`);
});
