import { Application, Request, Response } from "express";
import { Middleware } from "../abstractions/middleware";
import { injectable } from "inversify";

@injectable()
export class ServerHardening implements Middleware {
    apply(app: Application): void {
        app.disable('x-powered-by');
        app.use(this.preventXSS);
    }

    private preventXSS(req: Request, res: Response, next: Function): void {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    }
}