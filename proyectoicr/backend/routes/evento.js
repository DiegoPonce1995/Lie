const express = require("express");
const Estudiante = require("../models/estudiante");
const router = express.Router();
const mongoose = require("mongoose");
const AdultoResponsable = require("../models/adultoResponsable");
const Empleado = require("../models/empleado");
const checkAuthMiddleware = require("../middleware/check-auth");
const multer = require("multer");
const Evento = require("../models/evento");
const Usuario = require("../models/usuario");
const path = require("path");

const MIME_TYPE_MAPA = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAPA[file.mimetype];
    let error = new Error("El tipo de archivo es invalido");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAPA[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

var upload = multer({ storage: storage }).single("image");

//Registra el evento en la base de datos
//@params: evento a publicar
router.post("/registrar", upload, (req, res, next) => {
  Usuario.findOne({ email: req.body.autor }).then(usuario => {
    const evento = new Evento({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      fechaEvento: req.body.fechaEvento,
      horaInicio: req.body.horaInicio,
      horaFin: req.body.horaFin,
      tags: req.body.tags,
      imgUrl: req.file.filename,
      autor: usuario._id
    });
    evento.save().then(() => {
      res.status(201).json({
        message: "Evento creado existosamente",
        exito: true
      });
    });
  });
});

router.get("", (req, res, next) => {
  Evento.find().then(eventos => {
    res.status(200).json({
      eventos: eventos,
      message: "Evento devuelto existosamente",
      exito: true
    });
  });
});

router.post("/registrarComentario", (req, res, next) => {
  let apellido = "";
  let nombre = "";
  let idUsuario = "";
  if (req.body.rol == "Adulto Responsable") {
    AdultoResponsable.findOne({ email: req.body.emailUsuario }).then(
      usuario => {
        apellido = usuario.apellido;
        nombre = usuario.nombre;
        idUsuario = usuario.idUsuario;
      }
    );
  } else {
    Empleado.findOne({ email: req.body.emailUsuario }).then(
      usuario => {
        apellido = usuario.apellido;
        nombre = usuario.nombre;
        idUsuario = usuario.idUsuario;
      }
    );
  }
  Evento.findByIdAndUpdate(req.body.idEvento, {
    $push: {
      apellido: apellido,
      nombre: nombre,
      comentario: req.body.comentario.comentario,
      fecha: req.body.comentario.fecha,
      idUsuario: idUsuario
    }
  }).then(() => {
    res.status(200).json({
      message: "Se ha registrado el comentario correctamente",
      exito: true,
      nombre: nombre,
      apellido: apellido
    });
  });
});

module.exports = router;
