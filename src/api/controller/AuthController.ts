import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { LoginLocal } from '../../application/login/LoginLocal';
import { UserSimak } from '../../infrastructure/orm/UserSimak';
import { User } from '../../infrastructure/orm/User';

@controller('/auth')
export class AuthController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
        // @inject(TYPES.SIMAK) private readonly _db: DataSource
    ) { }

    @httpPost('/login')
    async check(@request() req: Request, @response() res: Response) {
        const local = new LoginLocal();
        const pengguna = await local.login(req.body.username,req.body.password)
        
        res.status(200).json({
            status: 200,
            message: "",
            data: pengguna,
            list: null,
            validation: [],
            log: [],
        });
    }
}