import "reflect-metadata";
import dotenv from 'dotenv';
import helmet from "helmet";
import cors from 'cors';
import { Application } from "express";
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
import { Cuti } from "./src/infrastructure/orm/Cuti";
import { DataSource } from "typeorm";
import { GetAllAbsenByNIDNYearMonthQueryHandler } from "./src/application/calendar/GetAllAbsenByNIDNYearMonthQueryHandler";
import { CalendarController } from "./src/api/controller/CalendarController";
import { GetAllCutiByNIDNYearMonthQueryHandler } from "./src/application/cuti/GetAllCutiByNIDNYearMonthQueryHandler";
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
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'public/uploads')
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.fieldname + '-' + Date.now())
    //     }
    // });
    // const upload = multer({ storage: storage });
    // app.use(upload.single('file'));
    // app.use('/public', express.static(path.join(__dirname, 'public')));
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
// server.setErrorConfig((app: Application) => {
//     app.use((err, req, res, next) => {
//         // console.error(err.stack);
//         res.status(500).send('Something broke!');
//     });
// });

container.bind<AppDataSource>(TYPES.DB).toConstantValue(AppDataSource.initialize());
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
container.bind<CalendarController>(TYPES.Controller).to(CalendarController);

const api: Application = container.get<Application>(TYPES.ApiServer);
api.listen(port, async () =>
    console.log('The application is running in %s:%s', process.env.base_url, port)
);
cron.schedule('50,55 23 * * *', async () => {
    console.log('Running a job absen keluar');
    try {
        AppDataSource.initialize2().then(async (db:DataSource)=>{
            const result = await db.createQueryBuilder()
            .update(Absen)
            .set({ absen_keluar: () => 'CURRENT_TIMESTAMP' })
            .where('tanggal = CURDATE() and absen_keluar is null')
            .execute();
            console.log(result);

            db.destroy()
        })
    } catch (error) {
        console.error('Error occurred:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});