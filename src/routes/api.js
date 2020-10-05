const express = require('express');
const router = express.Router();;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticated = require('../middlewares/authenticated')
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');
const validator = require('validator');

//auth
router.post('/register', async (req, res) => {
    const { email, password, passwordCheck, nombre } = req.body;
    const errors = new Array();
    if(!email){
        errors.push('el email es obligatorio');
    }else{
        if(!validator.isEmail(email)){
            errors.push('el campo email es incorrecto');
        }
    }
    if(!nombre){
        errors.push('el nombre es obligatorio');
    }
    if(!password){
        errors.push('la contraseña es obligatoria');
    }
    if(password){
        if(password!=passwordCheck){
            errors.push('la contraseñas no coinciden');
        }
    }
    if(errors.length>0){
        return res.status(400).json({ errors });
    }

    const usuarioExistente = await Usuario.findOne({ email: email });
    if(usuarioExistente)
        return res.status(400).json({ msg:"el email esta en uso" });
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const usuario = new Usuario({nombre, email,password: passwordHash});
    await usuario.save(function(err, resp) {
        if (err) return res.status(500).json(err);
        res.json({status: 'registrado'});
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const errors = new Array();
    if(!email){
        errors.push('el email es obligatorio');
    }else{
        if(!validator.isEmail(email)){
            errors.push('el campo email es incorrecto');
        }
    }
    if(!password){
        errors.push('la contraseña es obligatoria');
    }
    if(errors.length>0){
        return res.status(400).json({ errors });
    }
    const usuario = await Usuario.findOne({ email: email });
    if (!usuario)
        errors.push('la cuenta no existe');
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) 
        errors.push('la contraseña es incorrecta');
    if(errors.length>0){
        return res.status(400).json({ errors });
    }
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET);
    
    res.json({token,usuario: {id: usuario._id,nombre: usuario.nombre}});
});
router.post("/token", async (req, res) => {
    const token = req.header("auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const usuario = await Usuario.findById(verified.id);
    if (!usuario) return res.json(false);
    return res.json({
        token: token,
        nombre: usuario.nombre,
        id: usuario._id,
      });
});
//productos
router.get('/productos',authenticated, async (req, res) => {
    const nombre = req.query.nombre || '';
    const productos = await Producto.find({"creador":req.usuario, "nombre": {$regex: ".*" + nombre + ".*"}})
    res.json(productos);
});

router.post('/productos',authenticated, async (req, res) => {
    const { nombre, precio, stock,categoria } = req.body;
    const errors= new Array();
    if(!nombre){
        errors.push('el nombre es obligatorio');
    }
    if(!precio){
        errors.push('el precio es obligatorio');
        if(!validator.isNumeric(precio)){
            errors.push('el precio debe ser numérico');
        }
    }
    if(!stock){
        errors.push('la cantidad en stock es obligatoria');
        if(!validator.isNumeric(stock)){
            errors.push('la cantidad en stock debe ser numérica');
        }
    }
    if(errors.length>0){
        return res.status(400).json({ errors });
    }
    const producto = new Producto({nombre, precio, stock,creador:req.usuario,categoria});
    await producto.save(function(err, resp) {
        if (err) return res.status(500).json(err);
        res.json({status: 'guardado'});
    });
});
router.get('/productos/:id',authenticated, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if(producto==null){
            return res.status(404).json('no encontrado');
        }
        if(req.usuario==producto.creador._id){
            res.json(producto);
        }else{
            return res.status(500).json('no autorizado');
        }
    } catch (error) {
        return res.status(404).json('no encontrado');
    }
});
router.put('/productos/:id',authenticated, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if(producto==null){
            return res.status(404).json('no encontrado');
        }
        if(req.usuario==producto.creador._id){
            //return res.json(producto);
        }else{
            return res.status(500).json('no autorizado');
        }
    } catch (error) {
        return res.status(404).json('no encontrado');
    }
    const newProducto = { nombre, precio, stock,categoria} = req.body;
    const errors= new Array();
    if(!nombre){
        errors.push('el nombre es obligatorio');
    }
    if(!precio){
        errors.push('el precio es obligatorio');
        if(!validator.isNumeric(precio)){
            errors.push('el precio debe ser numérico');
        }
    }
    if(!stock){
        errors.push('la cantidad en stock es obligatoria');
        if(!validator.isNumeric(stock)){
            errors.push('la cantidad en stock debe ser numérica');
        }
    }
    if(errors.length>0){
        return res.status(400).json({ errors });
    }
    await Producto.findByIdAndUpdate(req.params.id, newProducto, {runValidators: true},function(err, resp) {
        if (err) return res.status(500).json(err);
        return res.json({status: 'editado'});
    }).catch((err)=>{
        res.status(500).json(err);
    })
});
router.delete('/productos/:id', async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id,function(err, user) {
        if (err) return res.status(500).json(err);
        res.json({status: 'borrado'});
    }).catch((error)=>{
    })
});

//

//categorias
router.get('/categorias',authenticated, async (req, res) => {
    const nombre = req.query.nombre || '';
    const categoria = await Categoria.find({"creador":req.usuario, "nombre": {$regex: ".*" + nombre + ".*"}})
    res.json(categoria);
});

router.post('/categorias',authenticated, async (req, res) => {
    const { nombre, descripcion} = req.body;
    const errors = new Array();
    if(!nombre){
        errors.push('el nombre es obligatorio');
    }
    if(!descripcion){
        errors.push('la descripcion es obligatoria');
    }
    if(errors.length>0){
        return res.status(400).json({ errors });
    }
    const categoria = new Categoria({nombre,descripcion,creador:req.usuario});
    await categoria.save(function(err, resp) {
        if (err) return res.status(500).json(err);
        res.json({status: 'guardado'});
    });
});
router.get('/categorias/:id',authenticated, async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if(categoria==null){
            return res.status(404).json('no encontrado');
        }
        if(req.usuario==categoria.creador._id){
            res.json(categoria);
        }else{
            return res.status(500).json('no autorizado');
        }
    } catch (error) {
        return res.status(404).json('no encontrado');
    }
});
router.put('/categorias/:id',authenticated, async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if(categoria==null){
            return res.status(404).json('no encontrada');
        }
        if(req.usuario!=categoria.creador._id){
            return res.status(500).json('no autorizado');
        }
    } catch (error) {
        return res.status(404).json('no encontrada2');
    }
    const newCategoria = { nombre, descripcion } = req.body;
    const errors = new Array();
    if(!nombre){
        errors.push('el nombre es obligatorio');
    }
    if(!descripcion){
        errors.push('la descripcion es obligatoria');
    }
    if(errors.length>0){
        return res.status(400).json({ errors });
    }
    await Categoria.findByIdAndUpdate(req.params.id, newCategoria, {runValidators: true},function(err, resp) {
        if (err) return res.status(500).json(err);
        return res.json({status: 'editado'});
    }).catch((err)=>{
        res.status(500).json(err);
    })
});
router.delete('/categorias/:id', async (req, res) => {
    await Categoria.findByIdAndDelete(req.params.id,function(err, user) {
        if (err) return res.status(500).json(err);
        res.json({status: 'borrado'});
    }).catch((error)=>{
    })
});
module.exports = router;
