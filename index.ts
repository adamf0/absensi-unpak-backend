import "reflect-metadata";
import dotenv from 'dotenv';
import helmet from "helmet";
import cors from 'cors';
import express, { Application, Response } from "express";
import { AppDataSource } from "./src/infrastructure/config/mysql";
import { json, urlencoded } from "body-parser";
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
import { Connection, DataSource, EntityNotFoundError, createConnections, getConnection } from "typeorm";
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
import path from 'path';
import { Dosen } from "./src/infrastructure/orm/Dosen";
import { Izin } from "./src/infrastructure/orm/Izin";
import { Cuti } from "./src/infrastructure/orm/Cuti";
import { JenisCuti } from "./src/infrastructure/orm/JenisCuti";
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
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use('/static', express.static('public')) //http://localhost:8000/static/uploads/1712290962115-dokumen.jpg
    // app.get('/readfile', (req, res) => {
    //     fs.readFile('file.txt', 'utf8', (err, data) => {
    //         if (err) {
    //             res.status(500).send('Error reading file');
    //             return;
    //         }
    //         res.send(data);
    //     });
    // });
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
        } else if (error instanceof Yup.ValidationError) {
            const invalid_request: Errors = {};
            error.inner.forEach((err) => {
                if (err.path) {
                    invalid_request[err.path] = err.message;
                }
            });
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
            entities: [Absen,Cuti,JenisCuti,Izin],
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
            entities: [Absen,Cuti,JenisCuti,Izin],
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
            entities: [Dosen],
            synchronize: false
        },
    ])
}
connect()
// container.bind<AppDataSource>(TYPES.DB).toConstantValue(AppDataSource.initialize());
// container.bind<AppDataSource>(TYPES.SIMAK).toConstantValue(AppDataSource.simak());
container.bind<ILog>(TYPES.Log).to(Log);
container.bind<ICommandBus>(TYPES.CommandBus).toConstantValue(new CommandBus());
container.bind<IQueryBus<IQuery>>(TYPES.QueryBus).toConstantValue(new QueryBus());
//<absen>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateAbsenMasukCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateAbsenKeluarCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAbsenQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllAbsenByNIDNYearMonthQueryHandler);
//</absen>
//<cuti>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateCutiCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteCutiCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetCutiQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllCutiQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllCutiByNIDNYearMonthQueryHandler);
//</cuti>
//<jenis_cuti>
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllJenisCutiQueryHandler);
//</jenis_cuti>
//<izin>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateIzinCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteIzinCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetIzinQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllIzinQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllIzinByNIDNYearMonthQueryHandler);
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
container.bind<CalendarController>(TYPES.Controller).to(CalendarController);
container.bind<IzinController>(TYPES.Controller).to(IzinController);
container.bind<AuthController>(TYPES.Controller).to(AuthController);

const api: Application = container.get<Application>(TYPES.ApiServer);
api.listen(port, async () =>
    console.log('The application is running in %s:%s', process.env.base_url, port)
);
cron.schedule('* * * * *', async () => {
    console.log('Running a job absen keluar');
    try {
        const _db = await getConnection("cron");
        if(_db.isInitialized){
            const result = await _db.createQueryBuilder()
                .update(Absen)
                .set({ absen_keluar: () => 'CURRENT_TIMESTAMP' })
                .where('tanggal = CURDATE() and absen_keluar is null')
                .execute();
            console.log(result);
        }
        // db.destroy()
    } catch (error) {
        console.error('Error occurred:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});