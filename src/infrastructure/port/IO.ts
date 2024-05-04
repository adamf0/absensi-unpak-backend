import { Request as ExpressRequest, Response } from 'express';
import multer, { Multer, File } from 'multer';
import path from 'path';

//https://medium.com/@tericcabrel/upload-files-to-the-node-js-server-with-express-and-multer-3c41f41a6e
export type UploadedFile = {
    fieldname: string; // file
    originalname: string; // myPicture.png
    encoding: string; // 7bit
    mimetype: string; // image/png
    destination: string; // ./public/uploads
    filename: string; // 1571575008566-myPicture.png
    path: string; // public/uploads/1571575008566-myPicture.png
    size: number; // 1255
};

// Extending Express Request interface to include the file property added by multer
declare module 'express' {
    interface Request {
        file: Multer.File;
    }
}

export const cutiFilePath = path.resolve(__dirname, '../..', '../public/cuti');
export const izinFilePath = path.resolve(__dirname, '../..', '../public/izin');
export const claimAbsenFilePath = path.resolve(__dirname, '../..', '../public/claimAbsen');

const storageFileCuti: Multer['StorageEngine'] = multer.diskStorage({
    destination: cutiFilePath,
    filename(req: ExpressRequest, file: File, fn: (error: Error | null, filename: string) => void): void {
        fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});
const storageFileIzin: Multer['StorageEngine'] = multer.diskStorage({
  destination: izinFilePath,
  filename(req: ExpressRequest, file: File, fn: (error: Error | null, filename: string) => void): void {
      fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});
const storageFileClaimAbsen: Multer['StorageEngine'] = multer.diskStorage({
  destination: claimAbsenFilePath,
  filename(req: ExpressRequest, file: File, fn: (error: Error | null, filename: string) => void): void {
      fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const uploadFileCuti = multer({
    storage: storageFileCuti,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        const extension: boolean = ['.pdf'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
        const mimeType: boolean = ['application/pdf'].indexOf(file.mimetype) >= 0;

        if (extension && mimeType) {
            return callback(null, true);
        }

        callback(new Error('Invalid file type'));
    },
}).single('dokumen');

const uploadFileIzin = multer({
  storage: storageFileIzin,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
      const extension: boolean = ['.pdf'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
      const mimeType: boolean = ['application/pdf'].indexOf(file.mimetype) >= 0;

      if (extension && mimeType) {
          return callback(null, true);
      }

      callback(new Error('Invalid file type'));
  },
}).single('dokumen');

const uploadFileClaimAbsen = multer({
  storage: storageFileClaimAbsen,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
      const extension: boolean = ['.pdf'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
      const mimeType: boolean = ['application/pdf'].indexOf(file.mimetype) >= 0;

      if (extension && mimeType) {
          return callback(null, true);
      }

      callback(new Error('Invalid file type'));
  },
}).single('dokumen');

const saveDokumenCuti = async (req: ExpressRequest, res: Response): Promise<any> => {
    try {
        await new Promise((resolve, reject): void => {
          uploadFileCuti(req, res, (error) => {
            if (error) {
              return reject(error);
            }
            
            resolve(req);
          });
        });
    
        // await new Promise((resolve, reject): void => {
        //     uploadFile(req, res, (error) => {
        //       if (error) {
        //         return reject(error);
        //       }
              
        //       resolve(req);
        //     });
        // });
    
        return req;
      } catch (error) {
        throw error;
      }
};
const saveDokumenIzin = async (req: ExpressRequest, res: Response): Promise<any> => {
  try {
      await new Promise((resolve, reject): void => {
        uploadFileIzin(req, res, (error) => {
          if (error) {
            return reject(error);
          }
          
          resolve(req);
        });
      });
  
      // await new Promise((resolve, reject): void => {
      //     uploadFile(req, res, (error) => {
      //       if (error) {
      //         return reject(error);
      //       }
            
      //       resolve(req);
      //     });
      // });
  
      return req;
    } catch (error) {
      throw error;
    }
};
const saveDokumenClaimAbsen = async (req: ExpressRequest, res: Response): Promise<any> => {
  try {
      await new Promise((resolve, reject): void => {
        uploadFileClaimAbsen(req, res, (error) => {
          if (error) {
            return reject(error);
          }
          
          resolve(req);
        });
      });
  
      // await new Promise((resolve, reject): void => {
      //     uploadFile(req, res, (error) => {
      //       if (error) {
      //         return reject(error);
      //       }
            
      //       resolve(req);
      //     });
      // });
  
      return req;
    } catch (error) {
      throw error;
    }
};

export { saveDokumenCuti, saveDokumenIzin, saveDokumenClaimAbsen};
