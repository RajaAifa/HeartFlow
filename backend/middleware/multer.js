import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join("uploads", "prescriptions");

// S'assure que le dossier de destination existe (multer ne le crée pas tout seul)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        // Nom unique pour éviter les collisions entre patients (ex: deux "ordonnance.jpg")
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage: storage });

export default upload;

/*

import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

export default upload */