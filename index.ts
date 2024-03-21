import "reflect-metadata";
import dotenv from 'dotenv';
import helmet from "helmet";
import cors from 'cors';
import express, { Application, Request, Response, response } from "express";
import { AppDataSource } from "./src/infrastructure/config/mysql";
import initBootstrap from "./src/infrastructure/bootstrap";
import { Cuti } from "./src/infrastructure/orm/Cuti";
import { Absen } from "./src/infrastructure/orm/Absen";
import { absenKeluarSchema, absenMasukSchema } from "./absenSchema";
import { InvalidRequest } from "./InvalidRequest";
import { IsNull, QueryFailedError } from "typeorm";
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 8000;
var upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
// app.use(express.static('public'));

app.use(helmet());
app.use(cors());
initBootstrap(app);

var corsOptions = {
    origin: 'http://example.com',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}
function saveErrorLog(error) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fileName = `logError#Y${year}M${month}D${day}.json`;
   
    let errorData = [];
    if (fs.existsSync(fileName)) {
        errorData = JSON.parse(fs.readFileSync(fileName));
    }
    errorData.push({
        timestamp: Date.now(),
        error: error.toString()
    });
    fs.writeFileSync(fileName, JSON.stringify(errorData, null, 2));
}
function printError(res: Response, error: any) {
    console.error(error.constructor);
    if (error instanceof QueryFailedError) {
        if(process.env.deploy != "dev"){
            saveErrorLog(error.driverError);
        }
        res.status(500).json({
            status: 500,
            message: "error server",
            data: null,
            list: null,
            validation: [],
            log: process.env.deploy == "dev" ? error.driverError : "error server",
        });
    } else {
        if(error.name.IsNull){
            if(process.env.deploy != "dev"){
                saveErrorLog(error.message);
            }
            res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
                list: null,
                validation: [],
                log: [],
            });
        } else{
            if(process.env.deploy != "dev"){
                saveErrorLog(JSON.stringify(error?.message??[]));
            }
            res.status(500).json({
                status: 500,
                message: null,
                data: null,
                list: null,
                validation: error?.message??[],
                log: [],
            });
        }
    }
}
const db = AppDataSource.initialize();

app.get('/', cors(corsOptions), async (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.post('/absen/:tipe', cors(corsOptions), async (req: Request, res: Response) => {
    try {
        let absen = new Absen();

        if (req.params.tipe == "masuk") {
            //masih error jika tidak ada input kalau form-data
            const validation = absenMasukSchema.safeParse(req.body);
            console.log(validation.success)
            if (validation.success == false) {
                throw new InvalidRequest("absenMasukSchema",validation.error.formErrors.fieldErrors);
            } else {
                absen.nidn = req.body.nidn;
                absen.tanggal = req.body.tanggal;
                absen.absen_masuk = req.body.absen_masuk;
                absen.absen_keluar = req.body.absen_keluar;
            }
        } else if (req.params.tipe == "keluar") {
            //masih error jika tidak ada input kalau form-data
            const validation = absenKeluarSchema.safeParse(req.body);
            console.log(validation.success)
            if (validation.success == false) {
                throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
            } else {
                absen = await db.getRepository(Absen).findOneBy({
                    nidn: req.params.nidn,
                    tanggal: req.params.tanggal,
                })
                absen.absen_keluar = req.body.absen_keluar;
            }
        } else {
            throw new Error("invalid command")
        }

        await db.getRepository(Absen).save(absen);
        res.status(200).json({
            status: 200,
            message: absen,
            data: null,
            list: null,
            validation: [],
            log: [],
        });
    } catch (error) {
        printError(res, error);
    }
});

app.get('/cuti', cors(corsOptions), async (req: Request, res: Response) => {
    try {
        const listCuti = await db.getRepository(Cuti).find()
        res.status(200).json({
            status: 200,
            message: null,
            data: null,
            list: listCuti,
            validation: [],
            log: [],
        })
    } catch (error) {
        printError(res, error);
    }
});
app.post('/cuti/create', cors(corsOptions), async (req: Request, res: Response) => {
    try {
        console.log(req.body)

        //masih error jika tidak ada input kalau form-data
        // const validation = absenKeluarSchema.safeParse(req.body);
        // console.log(validation.success)
        // if (validation.success == false) {
        //     throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
        // } else {
            let cuti = new Cuti();
            cuti.nidn = req.body.nidn;
            cuti.tanggal_pengajuan = req.body.tanggal_pengajuan;
            cuti.lama_cuti = req.body.lama_cuti;
            cuti.tujuan = req.body.tujuan;
            cuti.jenis_cuti = req.body.jenis_cuti;

            await db.getRepository(Cuti).save(cuti);
            res.status(200).json({
                status: 200,
                message: "berhasil simpan",
                data: cuti,
                list: null,
                validation: [],
                log: [],
            });
        // }
    } catch (error) {
        printError(res, error);
    }
});
app.get('/cuti/:id', cors(corsOptions), async (req: Request, res: Response) => {
    try {
        const cuti = await db.getRepository(Cuti).findOneByOrFail({
            id: parseInt(req.params.id),
        })
        res.status(200).json({
            status: 200,
            message: null,
            data: cuti,
            list: null,
            validation: [],
            log: [],
        })
    } catch (error) {
        printError(res, error);
    }
});
app.post('/cuti/update/:id', cors(corsOptions), async (req: Request, res: Response) => {
    try {
        const cuti = await db.getRepository(Cuti).findOneByOrFail({
            id: parseInt(req.params.id),
        })

        // const validation = absenKeluarSchema.safeParse(req.body);
        // console.log(validation.success)
        // if (validation.success == false) {
        //     throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
        // } else {
            cuti.nidn = req.body.nidn
            cuti.tanggal_pengajuan = req.body.tanggal_pengajuan
            cuti.lama_cuti = req.body.lama_cuti
            cuti.tujuan = req.body.tujuan
            cuti.jenis_cuti = req.body.jenis_cuti

            await db.manager.save(cuti);
            res.status(200).json({
                status: 200,
                message: "berhasil update",
                data: cuti,
                list: null,
                validation: [],
                log: [],
            })
        // }
    } catch (error) {
        printError(res, error);
    }
});
app.get('/cuti/delete/:id', cors(corsOptions), async (req: Request, res: Response) => {
    try {
        await db.getRepository(Cuti).delete(parseInt(req.params.id))
        res.status(200).json({
            status: 200,
            message: "berhasil hapus",
            data: { id: req.params.id },
            list: null,
            validation: [],
            log: [],
        })
    } catch (error) {
        printError(res, error);
    }

});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});