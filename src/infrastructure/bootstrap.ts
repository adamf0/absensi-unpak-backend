import { Container } from "inversify";
// import { Middleware } from "./abstractions/middleware";
// import { Logger } from "./config/logger";
// import { ServerHardening } from "./config/serverHardening";
import { Application } from "express";
// import { TYPES } from "./types";
import { AppDataSource } from "./config/mysql";
import { ICommand } from "./abstractions/messaging/ICommand";
import { ICommandHandler } from "./abstractions/messaging/ICommandHandler";
import { ICommandBus } from "./abstractions/messaging/ICommandBus";
import { TYPES } from "./types";
import { IQueryHandler } from "./abstractions/messaging/IQueryHandler";
import { IQuery } from "./abstractions/messaging/IQuery";
import { IQueryBus } from "./abstractions/messaging/IQueryBus";
import { CreateApplicationCommandHandler } from "../application/app/CreateApplicationCommandHandler";
import { GetAllApplicationsQueryHandler } from "../application/app/GetAllApplicationsQueryHandler";

export const container = new Container();
const initBootstrap = function (app: Application){
    container.bind<AppDataSource>(AppDataSource).toSelf();
    // container.bind<Middleware>(TYPES.Middleware).to(ServerHardening);
    // container.bind<Middleware>(TYPES.Middleware).to(Logger);
    // container.getAll<Middleware>(TYPES.Middleware).forEach(middleware => middleware.apply(app));

    container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateApplicationCommandHandler);
    container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllApplicationsQueryHandler);

    const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
    container.getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler).forEach((handler: ICommandHandler<ICommand>) => {
        commandBus.registerHandler(handler);
    });

    const queryBus = container.get<IQueryBus>(TYPES.QueryBus);
    container.getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler).forEach((handler: IQueryHandler<IQuery>) => {
        queryBus.registerHandler(handler);
    });
}

export default initBootstrap;