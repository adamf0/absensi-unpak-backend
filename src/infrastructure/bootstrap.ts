import { Container } from "inversify";
// import { Middleware } from "./abstractions/middleware";
// import { Logger } from "./config/logger";
// import { ServerHardening } from "./config/serverHardening";
import { Application } from "express";
// import { TYPES } from "./types";
import { AppDataSource } from "./config/mysql";

export const container = new Container();
const initBootstrap = function (app: Application){
    container.bind<AppDataSource>(AppDataSource).toSelf();
    // container.bind<Middleware>(TYPES.Middleware).to(ServerHardening);
    // container.bind<Middleware>(TYPES.Middleware).to(Logger);
    // container.getAll<Middleware>(TYPES.Middleware).forEach(middleware => middleware.apply(app));
}

export default initBootstrap;