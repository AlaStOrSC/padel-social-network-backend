const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    console.log('Guardando archivo en:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Nombre del archivo generado:', filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 104 },
  fileFilter: fileFilter,
}).single('profilePicture');

const uploadProfilePicture = async (userId, file, protocol, host) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const filename = file.filename;
  const url = `https://${host}/uploads/${filename}`;

  if (user.profilePicture) {
    const oldFilename = user.profilePicture.split('/').pop();
    await deleteFile(oldFilename);
  }

  user.profilePicture = url;
  await user.save();

  return url;
};

const deleteFile = async (filename) => {
  const filePath = path.join(__dirname, '../../uploads', filename);
  console.log('Intentando eliminar archivo:', filePath);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new Error(`Error al eliminar el archivo ${filename}: ${error.message}`);
    }
  }
};

module.exports = { uploadProfilePicture, deleteFile, upload };