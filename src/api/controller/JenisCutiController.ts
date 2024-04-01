import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { GetAllJenisCutiQuery } from '../../application/jenis_cuti/GetAllJenisCutiQuery';

@controller('/jenis_cuti')
export class JenisCutiController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        const list = await this._queryBus.execute(
            new GetAllJenisCutiQuery()
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: null,
            list: list,
            validation: [],
            log: [],
        });
    }
}