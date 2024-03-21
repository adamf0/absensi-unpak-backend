import { Application, Request, Response } from "express";
import { Middleware } from "../abstractions/middleware";
import { injectable } from "inversify";

@injectable()
export class Logger implements Middleware {
    apply(app: Application): void {
        app.use(this.logger);
    }

    private logger(req: Request, res: Response, next: Function) {
        console.log(`${req.method} request to ${req.path}`);
        console.log(`body: ${req.body}`);
        next();
    }
}