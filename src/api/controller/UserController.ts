import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { CreateUserCommand } from '../../application/user/CreateUserCommand';
import { UpdateUserCommand } from '../../application/user/UpdateUserCommand';
import { DeleteUserCommand } from '../../application/user/DeleteUserCommand';
import { GetAllUserQuery } from '../../application/user/GetAllUserQuery';
import { GetUserQuery } from '../../application/user/GetUserQuery';
import { userCreateSchema, userUpdateSchema } from '../../domain/validation/userSchema';

@controller('/user')
export class UserController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        const page = parseInt(String(req.query?.page ?? "1"));
        const pageSize = parseInt(String(req.query?.pageSize ?? "10"));
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;

        const [data, count] = await this._queryBus.execute(
            new GetAllUserQuery(pageSize, startIndex)
        );
        const totalPage = Math.ceil(count / pageSize);
        const nextPage = (page + 1 > totalPage) ? null : page + 1;
        const prevPage = (page - 1 < 1) || (totalPage < page) ? null : page - 1;

        res.status(200).json({
            status: 200,
            message: null,
            data: null,
            list: {
                totalData: count,
                startIndex: startIndex,
                endIndex: endIndex,

                totalPage: totalPage,
                pageSize: pageSize,
                prevPage: prevPage,
                linkprevPage: prevPage !== null ? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${prevPage}`) : null,
                currentPage: page,
                linkCurrentPage: req.protocol + "://" + req.get('host') + req.originalUrl,
                nextPage: nextPage,
                linkNextPage: nextPage !== null ? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${nextPage}`) : null,
                data: data
            },
            validation: [],
            log: [],
        });
    }

    @httpGet('/:id')
    async detail(@request() req: Request, @response() res: Response) {
        const user = await this._queryBus.execute(
            new GetUserQuery(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: user,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        await userCreateSchema.validate(req.body, { abortEarly: false });
        const user = await this._commandBus.send(
            new CreateUserCommand(
                req.body.nama,
                req.body.username,
                req.body.password,
                req.body.level,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil mengajukan user",
            data: user,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        console.log(req.body)
        await userUpdateSchema.validate(req.body, { abortEarly: false });

        const user = await this._commandBus.send(
            new UpdateUserCommand(
                parseInt(req.body.id),
                req.body.nama,
                req.body.username,
                req.body.password,
                req.body.level,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data user",
            data: user,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const user = await this._commandBus.send(
            new DeleteUserCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengajuan user",
            data: user,
            list: null,
            validation: [],
            log: [],
        });
    }
}