const TYPES = {
    Middleware: Symbol.for("Middleware"),
    CommandBus: Symbol('CommandBus'),
    QueryBus: Symbol('QueryBus'),
    CommandHandler: Symbol('CommandHandler'),
    QueryHandler: Symbol('QueryHandler'),
    ApiServer: Symbol('ApiServer'),
    AppDataSource: Symbol('AppDataSource'),
    Controller: Symbol('Controller'),
    Log: Symbol('Log'),
    DB: Symbol('DB'),
    SIMAK: Symbol('SIMAK'),
    PrismaClient: Symbol('PrismaClient'),
};

export { TYPES };
