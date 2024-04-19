import "reflect-metadata";
import dotenv from 'dotenv';
import helmet from "helmet";
import cors from 'cors';
import express, { Application, Response } from "express";
import bodyParser, { json, urlencoded } from "body-parser";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import { ICommand } from "./src/infrastructure/abstractions/messaging/ICommand";
import { ICommandBus } from "./src/infrastructure/abstractions/messaging/ICommandBus";
import { ICommandHandler } from "./src/infrastructure/abstractions/messaging/ICommandHandler";
import { IQuery } from "./src/infrastructure/abstractions/messaging/IQuery";
import { IQueryBus } from "./src/infrastructure/abstractions/messaging/IQueryBus";
import { IQueryHandler } from "./src/infrastructure/abstractions/messaging/IQueryHandler";
import { TYPES } from "./src/infrastructure/types";
import { CommandBus } from "./src/infrastructure/abstractions/messaging/CommandBus";
import { QueryBus } from "./src/infrastructure/abstractions/messaging/QueryBus";
import { CreateAbsenMasukCommandHandler } from "./src/application/absen/CreateAbsenMasukCommandHandler";
import { CreateAbsenKeluarCommandHandler } from "./src/application/absen/CreateAbsenKeluarCommandHandler";
import { GetAbsenQueryHandler } from "./src/application/absen/GetAbsenQueryHandler";
import { AbsenController } from "./src/api/controller/AbsenController";
import { ILog } from "./src/infrastructure/abstractions/messaging/ILog";
import { Log } from "./src/infrastructure/port/Logger";
import { CreateCutiCommandHandler } from "./src/application/cuti/CreateCutiCommandHandler";
import { UpdateCutiCommandHandler } from "./src/application/cuti/UpdateCutiCommandHandler";
import { DeleteCutiCommandHandler } from "./src/application/cuti/DeleteCutiCommandHandler";
import { GetCutiQueryHandler } from "./src/application/cuti/GetCutiQueryHandler";
import { GetAllCutiQueryHandler } from "./src/application/cuti/GetAllCutiQueryHandler";
import { CutiController } from "./src/api/controller/CutiController";
import { Absen } from "./src/infrastructure/orm/Absen";
import { EntityNotFoundError, createConnections, getConnection } from "typeorm";
import { GetAllAbsenByNIDNYearMonthQueryHandler } from "./src/application/calendar/GetAllAbsenByNIDNYearMonthQueryHandler";
import { CalendarController } from "./src/api/controller/CalendarController";
import { GetAllCutiByNIDNYearMonthQueryHandler } from "./src/application/cuti/GetAllCutiByNIDNYearMonthQueryHandler";

import { EntityMetadataNotFoundError, QueryFailedError } from 'typeorm';
import * as Yup from "yup";
import { Errors } from './src/infrastructure/abstractions/Errors';
// import { Logger } from "./src/infrastructure/config/logger";
import { GetAllJenisCutiQueryHandler } from "./src/application/jenis_cuti/GetAllJenisCutiQueryHandler";
import { JenisCutiController } from "./src/api/controller/JenisCutiController";
import { IzinController } from "./src/api/controller/IzinController";
import { CreateIzinCommandHandler } from "./src/application/izin/CreateIzinCommandHandler";
import { DeleteIzinCommandHandler } from "./src/application/izin/DeleteIzinCommandHandler";
import { GetAllIzinByNIDNYearMonthQueryHandler } from "./src/application/izin/GetAllIzinByNIDNYearMonthQueryHandler";
import { GetAllIzinQueryHandler } from "./src/application/izin/GetAllIzinQueryHandler";
import { GetIzinQueryHandler } from "./src/application/izin/GetIzinQueryHandler";
import { UpdateIzinCommandHandler } from "./src/application/izin/UpdateIzinCommandHandler";
import { AuthController } from "./src/api/controller/AuthController";
import { Dosen } from "./src/infrastructure/orm/Dosen";
import { Izin } from "./src/infrastructure/orm/Izin";
import { Cuti } from "./src/infrastructure/orm/Cuti";
import { JenisCuti } from "./src/infrastructure/orm/JenisCuti";
import { User } from "./src/infrastructure/orm/User";
import { PenggunaController } from "./src/api/controller/PenggunaController";
import { CreatePenggunaCommandHandler } from "./src/application/pengguna/CreatePenggunaCommandHandler";
import { DeletePenggunaCommandHandler } from "./src/application/pengguna/DeletePenggunaCommandHandler";
import { GetAllPenggunaQueryHandler } from "./src/application/pengguna/GetAllPenggunaQueryHandler";
import { GetPenggunaQueryHandler } from "./src/application/pengguna/GetPenggunaQueryHandler";
import { UpdatePenggunaCommandHandler } from "./src/application/pengguna/UpdatePenggunaCommandHandler";
import { UserSimak } from "./src/infrastructure/orm/UserSimak";
import { ApprovalCutiCommandHandler } from "./src/application/cuti/ApprovalCutiCommandHandler";
import { ApprovalIzinCommandHandler } from "./src/application/izin/ApprovalIzinCommandHandler";
import { CountAllIzinOnWaitingQueryHandler } from "./src/application/izin/CountAllIzinOnWaitingQueryHandler";
import { CountAllCutiOnWaitingQueryHandler } from "./src/application/cuti/CountAllCutiOnWaitingQueryHandler";
import { JenisIzinController } from "./src/api/controller/JenisIzinController";
import { JenisIzin } from "./src/infrastructure/orm/JenisIzin";
import { ValidationError } from "yup";
import { CreateJenisCutiCommandHandler } from "./src/application/jenis_cuti/CreateJenisCutiCommandHandler";
import { DeleteJenisCutiCommandHandler } from "./src/application/jenis_cuti/DeleteJenisCutiCommandHandler";
import { GetJenisCutiQueryHandler } from "./src/application/jenis_cuti/GetJenisCutiQueryHandler";
import { UpdateJenisCutiCommandHandler } from "./src/application/jenis_cuti/UpdateJenisCutiCommandHandler";
import { CreateJenisIzinCommandHandler } from "./src/application/jenis_izin/CreateJenisIzinCommandHandler";
import { DeleteJenisIzinCommandHandler } from "./src/application/jenis_izin/DeleteJenisIzinCommandHandler";
import { GetAllJenisIzinQueryHandler } from "./src/application/jenis_izin/GetAllJenisIzinQueryHandler";
import { GetJenisIzinQueryHandler } from "./src/application/jenis_izin/GetJenisIzinQueryHandler";
import { UpdateJenisIzinCommandHandler } from "./src/application/jenis_izin/UpdateJenisIzinCommandHandler";
import { Pengguna } from "./src/infrastructure/orm/Pengguna";
import { GetAbsenByFilterQueryHandler } from "./src/application/absen/GetAbsenByFilterQueryHandler";
import { InfoController } from "./src/api/controller/InfoController";
import { CountAllCutiQueryHandler } from "./src/application/cuti/CountAllCutiQueryHandler";
import { CountAllIzinQueryHandler } from "./src/application/cuti/CountAllIzinQueryHandler";
var cron = require('node-cron');

dotenv.config();
const port = process.env.PORT || 8000;
var corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204
}

const container = new Container();
const server = new InversifyExpressServer(container);
server.setConfig((app: Application) => {
    // parse application/x-www-form-urlencoded
    app.use(urlencoded({ extended: true }));
    // parse application/json
    app.use(json());
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use('/static', express.static('public')) //http://localhost:8000/static/uploads/1712290962115-dokumen.jpg
});
server.setErrorConfig((app: Application) => {
    const _log: ILog = new Log()

    app.use((error:any, req, res:Response, next) => {
        console.error(error.constructor);
        let errorMessage = "error server";
        let logMessage = process.env.deploy == "dev" ? error.stack : "error server";
        
        if (error instanceof QueryFailedError || error instanceof EntityMetadataNotFoundError || error instanceof EntityNotFoundError) {
            if (process.env.deploy != "dev") {
                _log.saveLog(error.message || error.message);
            }
        } else if (error instanceof ValidationError) {
            const invalid_request: Errors = {};
            error.inner.forEach((err) => {
                if (err.path) {
                    invalid_request[err.path] = err.message;
                }
            });
            invalid_request['body'] = req.body;
            errorMessage = "Invalid request";
            logMessage = JSON.stringify(invalid_request);
        } if(error instanceof Error){
            errorMessage = error.message;
            logMessage = error.stack
        }

        res.status(500).json({
            status: 500,
            message: errorMessage,
            data: null,
            list: null,
            validation: [],
            log: logMessage,
        });
    });
});

async function connect(){
    await createConnections([
        {
            name: "default",
            type: "mysql",
            host: process.env.db_host,
            port: 3306,
            username: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_database,
            entities: [Absen,Cuti,JenisCuti,JenisIzin,Izin,User],
            logging: true,
            synchronize: true,
        },
        {
            name: "cron",
            type: "mysql",
            host: process.env.db_host,
            port: 3306,
            username: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_database,
            entities: [Absen],
            logging: true,
            synchronize: true,
        },
        {
            name: "simak",
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "unpak_simak",
            entities: [Dosen,UserSimak,Pengguna],
            synchronize: false
        },
    ])
}
connect()

container.bind<ILog>(TYPES.Log).to(Log);
container.bind<ICommandBus>(TYPES.CommandBus).toConstantValue(new CommandBus());
container.bind<IQueryBus<IQuery>>(TYPES.QueryBus).toConstantValue(new QueryBus());
//<absen>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateAbsenMasukCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateAbsenKeluarCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAbsenByFilterQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAbsenQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllAbsenByNIDNYearMonthQueryHandler);
//</absen>
//<cuti>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(ApprovalCutiCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetCutiQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllCutiQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllCutiByNIDNYearMonthQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(CountAllCutiQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(CountAllCutiOnWaitingQueryHandler);
//</cuti>
//<user>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreatePenggunaCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdatePenggunaCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeletePenggunaCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetPenggunaQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllPenggunaQueryHandler);
//</user>
//<jenis_cuti>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateJenisCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateJenisCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteJenisCutiCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetJenisCutiQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllJenisCutiQueryHandler);
//</jenis_cuti>
//<jenis_izin>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateJenisIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateJenisIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteJenisIzinCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetJenisIzinQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllJenisIzinQueryHandler);
//</jenis_izin>
//<izin>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(ApprovalIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteIzinCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetIzinQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllIzinQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllIzinByNIDNYearMonthQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(CountAllIzinQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(CountAllIzinOnWaitingQueryHandler);
//</izin>
//<calendar>
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllAbsenByNIDNYearMonthQueryHandler);
//</calendar>

const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
container.getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler).forEach((handler: ICommandHandler<ICommand>) => {
    commandBus.registerHandler(handler);
});

const queryBus = container.get<IQueryBus>(TYPES.QueryBus);
container.getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler).forEach((handler: IQueryHandler<IQuery>) => {
    queryBus.registerHandler(handler);
});

const apiServer = server.build();
container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);
container.bind<AbsenController>(TYPES.Controller).to(AbsenController);
container.bind<CutiController>(TYPES.Controller).to(CutiController);
container.bind<JenisCutiController>(TYPES.Controller).to(JenisCutiController);
container.bind<JenisIzinController>(TYPES.Controller).to(JenisIzinController);
container.bind<CalendarController>(TYPES.Controller).to(CalendarController);
container.bind<IzinController>(TYPES.Controller).to(IzinController);
container.bind<PenggunaController>(TYPES.Controller).to(PenggunaController);
container.bind<InfoController>(TYPES.Controller).to(InfoController);
container.bind<AuthController>(TYPES.Controller).to(AuthController);

const api: Application = container.get<Application>(TYPES.ApiServer);
api.listen(port, async () =>
    console.log('The application is running in %s:%s', process.env.base_url, port)
);
// cron.schedule('* * * * *', async () => {
//     console.log('Running a job absen keluar');
//     try {
//         // const _db = await getConnection("cron");
//         // if(_db.isInitialized){
//         //     const result = await _db.createQueryBuilder()
//         //         .update(Absen)
//         //         .set({ absen_keluar: () => 'CURRENT_TIMESTAMP' })
//         //         .where('tanggal = CURDATE() and absen_keluar is null')
//         //         .execute();
//         //     console.log(result);
//         // }
//         const _dbSimak = await getConnection("simak");
//         const _dbLocal = await getConnection("default");
//         if(_dbSimak.isInitialized && _dbLocal.isInitialized){
//             const listDosen = await _dbSimak.getRepository(Dosen).find();
//             const dateNow = new Date().toISOString().slice(0, 10);
//             const existingAbsen = await _dbLocal.getRepository(Absen).find({
//                 where: {
//                     tanggal: dateNow,
//                 },
//                 select: ['nidn'],
//             });
//             const existingNidnSet = new Set(existingAbsen.map(absen => absen.nidn));
//             const absenInstances = listDosen
//                 .filter(dosen => !existingNidnSet.has(dosen.NIDN))
//                 .map(dosen => {
//                     const absen = new Absen();
//                     absen.nidn = dosen.NIDN;
//                     absen.tanggal = dateNow;
//                     return absen;
//                 });

//             await _dbLocal.getRepository(Absen)
//                 .createQueryBuilder()
//                 .insert()
//                 .values(absenInstances)
//                 .orIgnore()
//                 .execute();
//         }
//         // db.destroy()
//     } catch (error) {
//         console.error('Error occurred:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: "Asia/Jakarta"
// });

cron.schedule('* * * * *', async () => {
    console.log('Running a job absen keluar');
    // try {
    //     const _db = await getConnection("cron");
    //     if(_db.isInitialized){
    //         const result = await _db.createQueryBuilder()
    //             .update(Absen)
    //             .set({ absen_keluar: () => 'CURRENT_TIMESTAMP' })
    //             .where('tanggal = CURDATE() and absen_masuk is not null and absen_keluar is null')
    //             .execute();
    //         console.log(result);
    //     }
    //     // db.destroy()
    // } catch (error) {
    //     console.error('Error occurred:', error);
    // }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});