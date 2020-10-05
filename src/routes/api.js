const express = require('express');
const router = express.Router();;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticated = require('../middlewares/authenticated')
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const validator = require('validator');

router.get('/productos',authenticated, async (req, res) => {
    const nombre = req.query.nombre || '';
    const productos = await Producto.find({"creador":req.usuario, "nombre": {$regex: ".*" + nombre + ".*"}})
    res.json(productos);
});

router.post('/productos',authenticated, async (req, res) => {
    const { nombre, precio, stock,usuario } = req.body;
    const producto = new Producto({nombre, precio, stock,creador:req.usuario});
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
    const newProducto = { nombre, precio, stock } = req.body;
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

    const usuario = await Usuario.findOne({ email: email });
    if (!usuario)
      return res.status(400).json({ msg: "la cuenta no existe" });
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) 
        return res.status(400).json({ msg: "la contraseña es incorrecta" });
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


module.exports = router;
