import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { Dosen } from '../../infrastructure/orm/Dosen';
import { getConnection } from 'typeorm';

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

        const con = await getConnection("simak");
        const x = await con.getRepository(Dosen)
        .createQueryBuilder("dosen")
        .where("dosen.NIDN = :nidn", { nidn: req.body.nidn }) // pastikan req.body.nidn telah didefinisikan sebelumnya
        .getOne();

        res.status(200).json({
            status: 200,
            message: "",
            data: x,
            list: null,
            validation: [],
            log: [],
        });
    }
}