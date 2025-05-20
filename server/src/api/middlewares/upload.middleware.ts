import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegúrate de que la carpeta assets exista
const uploadDir = path.join(__dirname, '../../assets');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Usa la ruta absoluta
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === '.xlsx' || extname === '.xls') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
    }
};

export const uploadExcel = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limita a 10MB
});