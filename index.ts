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
import { EntityNotFoundError, IsNull, Not, createConnections, getConnection } from "typeorm";
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
import { Pegawai } from "./src/infrastructure/orm/Pegawai";
import 'moment-timezone';
import moment from "moment";
import morganMiddleware from "./src/infrastructure/config/morganMiddleware";
import { ClaimAbsen } from "./src/infrastructure/orm/ClaimAbsen";
import { CreateClaimAbsenCommandHandler } from "./src/application/claimAbsen/CreateClaimAbsenCommandHandler";
import { UpdateClaimAbsenCommandHandler } from "./src/application/claimAbsen/UpdateClaimAbsenCommandHandler";
import { ApprovalClaimAbsenCommandHandler } from "./src/application/claimAbsen/ApprovalClaimAbsenCommandHandler";
import { DeleteClaimAbsenCommandHandler } from "./src/application/claimAbsen/DeleteClaimAbsenCommandHandler";
import { GetClaimAbsenQueryHandler } from "./src/application/claimAbsen/GetClaimAbsenQueryHandler";
import { GetAllClaimAbsenQueryHandler } from "./src/application/claimAbsen/GetAllClaimAbsenQueryHandler";
import { ClaimAbsenController } from "./src/api/controller/ClaimAbsenController";
import { CheckAbsenIdQueryHandler } from "./src/application/claimAbsen/CheckAbsenIdQueryHandler";
import { GetAllAbsenQueryHandler } from "./src/application/absen/GetAllAbsenQueryHandler";
import { CreateMasterCalendarCommandHandler } from "./src/application/master_calendar/CreateMasterCalendarCommandHandler";
import { DeleteMasterCalendarCommandHandler } from "./src/application/master_calendar/DeleteMasterCalendarCommandHandler";
import { GetMasterCalendarQueryHandler } from "./src/application/master_calendar/GetJenisIzinQueryHandler";
import { GetAllMasterCalendarQueryHandler } from "./src/application/master_calendar/GetAllMasterCalendarQueryHandler";
import { UpdateMasterCalendarCommandHandler } from "./src/application/master_calendar/UpdateMasterCalendarCommandHandler";
import { MasterCalendarController } from "./src/api/controller/MasterCalendarController";
import { MasterCalendar } from "./src/infrastructure/orm/MasterCalendar";
import { SPPDController } from "./src/api/controller/SPPDController";
import { CreateSPPDCommandHandler } from "./src/application/sppd/CreateSPPDCommandHandler";
import { DeleteSPPDCommandHandler } from "./src/application/sppd/DeleteSPPDCommandHandler";
import { GetAllSPPDQueryHandler } from "./src/application/sppd/GetAllSPPDQueryHandler";
import { GetSPPDQueryHandler } from "./src/application/sppd/GetSPPDQueryHandler";
import { UpdateSPPDCommandHandler } from "./src/application/sppd/UpdateSPPDCommandHandler";
import { JenisSPPD } from "./src/infrastructure/orm/JenisSPPD";
import { SPPD } from "./src/infrastructure/orm/SPPD";
import { SPPDAnggota } from "./src/infrastructure/orm/SPPDAnggota";
import { JenisSPPDController } from "./src/api/controller/JenisSPPDController";
import { CreateJenisSPPDCommandHandler } from "./src/application/jenis_sppd/CreateJenisSPPDCommandHandler";
import { DeleteJenisSPPDCommandHandler } from "./src/application/jenis_sppd/DeleteJenisSPPDCommandHandler";
import { GetAllJenisSPPDQueryHandler } from "./src/application/jenis_sppd/GetAllJenisSPPDQueryHandler";
import { GetJenisSPPDQueryHandler } from "./src/application/jenis_sppd/GetJenisSPPDQueryHandler";
import { UpdateJenisSPPDCommandHandler } from "./src/application/jenis_sppd/UpdateJenisSPPDCommandHandler";
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
    
    app.use(morganMiddleware)
    app.use('/static', express.static('public')) //http://localhost:8000/static/uploads/1712290962115-dokumen.jpg
});
server.setErrorConfig((app: Application) => {
    const _log: ILog = new Log()

    app.use((error:any, req, res:Response, next) => {
        console.error(error.constructor);
        let errorMessage = "error server";
        let logMessage = process.env.deploy == "dev" ? error.stack : "error server";
        
        if (error instanceof QueryFailedError || error instanceof EntityMetadataNotFoundError || error instanceof EntityNotFoundError || error instanceof EntityNotFoundError) {
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
            port: parseInt(process.env.db_port),
            username: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_database,
            entities: [Absen,Cuti,JenisCuti,JenisIzin,Izin,User,ClaimAbsen,MasterCalendar, JenisSPPD, SPPD, SPPDAnggota],
            logging: true,
            synchronize: true,
            timezone: "+07:00" //https://github.com/typeorm/typeorm/issues/2939
        },
        {
            name: "cron",
            type: "mysql",
            host: process.env.db_host,
            port: parseInt(process.env.db_port),
            username: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_database,
            entities: [Absen,ClaimAbsen,MasterCalendar, JenisSPPD, SPPD, SPPDAnggota],
            logging: true,
            synchronize: false,
            timezone: "+07:00"
        },
        {
            name: "simak",
            type: "mysql",
            host: process.env.db_host_simak,
            port: parseInt(process.env.db_port_simak),
            username: process.env.db_username_simak,
            password: process.env.db_password_simak,
            database: process.env.db_database_simak,
            entities: [Dosen,UserSimak],
            synchronize: false,
            timezone: "+07:00"
        },
        {
            name: "simpeg",
            type: "mysql",
            host: process.env.db_host_simpeg,
            port: parseInt(process.env.db_port_simpeg),
            username: process.env.db_username_simpeg,
            password: process.env.db_password_simpeg,
            database: process.env.db_database_simpeg,
            entities: [Pengguna,Pegawai],
            synchronize: false,
            timezone: "+07:00"
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
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllAbsenByNIDNYearMonthQueryHandler)
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllAbsenQueryHandler);
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
//<claimAbsen>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateClaimAbsenCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateClaimAbsenCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(ApprovalClaimAbsenCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteClaimAbsenCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetClaimAbsenQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllClaimAbsenQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(CheckAbsenIdQueryHandler);
//</claimAbsen>
//<master_calendar>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateMasterCalendarCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateMasterCalendarCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteMasterCalendarCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetMasterCalendarQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllMasterCalendarQueryHandler);
//</master_calendar>
//<sppd>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateSPPDCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateSPPDCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteSPPDCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetSPPDQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllSPPDQueryHandler);
//</sppd>
//<jenis_sppd>
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateJenisSPPDCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateJenisSPPDCommandHandler);
container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(DeleteJenisSPPDCommandHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetJenisSPPDQueryHandler);
container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllJenisSPPDQueryHandler);
//</jenis_sppd>
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
container.bind<ClaimAbsenController>(TYPES.Controller).to(ClaimAbsenController);
container.bind<MasterCalendarController>(TYPES.Controller).to(MasterCalendarController);
container.bind<SPPDController>(TYPES.Controller).to(SPPDController);
container.bind<JenisSPPDController>(TYPES.Controller).to(JenisSPPDController);
container.bind<AuthController>(TYPES.Controller).to(AuthController);

const api: Application = container.get<Application>(TYPES.ApiServer);
process.env.TZ = "Asia/Jakarta";

api.listen(port, async () =>
    console.log('The application is running in %s:%s', process.env.base_url, port)
);
cron.schedule('* * * * *', async () => {//* * * * *
    console.log('Running a job initial absensi, '+new Date().toISOString());
    try {
        const _dbSimak = await getConnection("simak");
        const _dbLocal = await getConnection("default");
        const _dbSimpeg = await getConnection("simpeg");
        if(_dbSimak.isInitialized && _dbLocal.isInitialized && _dbSimpeg.isInitialized){
            const dateNow = new Date().toISOString().slice(0, 10);

            const listDosen = await _dbSimak.getRepository(Dosen).find();
            const existingAbsenDosen = await _dbLocal.getRepository(Absen).find({
                where: {
                    tanggal: dateNow,
                },
                select: ['nidn'],
            });
            const existingNidnSet = new Set(existingAbsenDosen.map(absen => absen.nidn));
            const absenDosenInstances = listDosen
                .filter(dosen => !existingNidnSet.has(dosen.NIDN))
                .map(dosen => {
                    const absen = new Absen();
                    absen.nidn = dosen.NIDN;
                    absen.tanggal = dateNow;
                    return absen;
                });

            await _dbLocal.getRepository(Absen)
                .createQueryBuilder()
                .insert()
                .values(absenDosenInstances)
                .orIgnore()
                .execute();

            const listPengguna = await _dbSimpeg.getRepository(Pengguna).find({
                where: {
                    level: "PEGAWAI"
                },
            });
            const existingAbsenPegawai = await _dbLocal.getRepository(Absen).find({
                where: {
                    tanggal: dateNow
                },
                select: ['nip'],
            });
            const existingNipSet = new Set(existingAbsenPegawai.map(absen => absen.nip));
            const absenPegawaiInstances = listPengguna
                .filter(pegawai => !existingNipSet.has(pegawai.username.toString()))
                .map(pegawai => {
                    const absen = new Absen();
                    absen.nip = pegawai.username;
                    absen.tanggal = dateNow;
                    return absen;
                });

            await _dbLocal.getRepository(Absen)
                .createQueryBuilder()
                .insert()
                .values(absenPegawaiInstances)
                .orIgnore()
                .execute();
        }
        // db.destroy()
    } catch (error) {
        console.error('Error occurred:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});

cron.schedule('* 22 * * *', async () => {
    console.log('Running a job absen keluar, '+new Date().toISOString());
    try {
        const _db = await getConnection("cron");
        if(_db.isInitialized){
            const yesterdayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
            const result = await _db.createQueryBuilder()
                .update(Absen)
                .set({ absen_keluar: `${yesterdayDate} 15:00:00`, otomatis_keluar:"1" })
                .where('tanggal = :yesterdayDate and absen_masuk is not null and absen_keluar is null',{yesterdayDate:yesterdayDate})
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