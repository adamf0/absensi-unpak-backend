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

const uploadFilePath = path.resolve(__dirname, '../..', '../public/uploads');

const storageFile: Multer['StorageEngine'] = multer.diskStorage({
    destination: uploadFilePath,
    filename(req: ExpressRequest, file: File, fn: (error: Error | null, filename: string) => void): void {
        fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});

const uploadFile = multer({
    storage: storageFile,
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

const handleUploadFileDokumen = async (req: ExpressRequest, res: Response): Promise<any> => {
    // return new Promise((resolve, reject): void => {
    //     uploadFile(req, res, (error) => {
    //         if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
    //             // If no file was uploaded, resolve with null
    //             return resolve({ file: null, body: req.body });
    //           }
              
    //         if (error) {
    //             reject(error);
    //         }

    //         // resolve({ file: req.file, body: req.body });
    //         resolve(req);
    //     });
    // });
    try {
        await new Promise((resolve, reject): void => {
          uploadFile(req, res, (error) => {
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

export { handleUploadFileDokumen};
