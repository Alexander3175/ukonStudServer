import { diskStorage } from 'multer';
import { extname } from 'path';
import { promisify } from 'util';

import { unlink } from 'fs';
import * as sharp from 'sharp';

const unlinkAsync = promisify(unlink);

const storage = diskStorage({
  destination: './uploads/',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

export const multerOptions = {
  storage,
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Unsupported file format'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};

export async function compressImage(filePath: string): Promise<string> {
  try {
    console.log(`Starting compression for file: ${filePath}`);
    const outputFilePath = filePath.replace(
      extname(filePath),
      '-compressed' + extname(filePath),
    );

    await sharp(filePath).resize(800).toFile(outputFilePath);

    await unlinkAsync(filePath);
    console.log(`Original file deleted: ${filePath}`);

    return outputFilePath;
  } catch (error) {
    console.error('Error while compressing image:', error);
    throw new Error('Image compression failed');
  }
}
