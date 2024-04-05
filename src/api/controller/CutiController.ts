import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { CreateCutiCommand } from '../../application/cuti/CreateCutiCommand';
import { UpdateCutiCommand } from '../../application/cuti/UpdateCutiCommand';
import { DeleteCutiCommand } from '../../application/cuti/DeleteCutiCommand';
import { GetAllCutiQuery } from '../../application/cuti/GetAllCutiQuery';
import { GetCutiQuery } from '../../application/cuti/GetCutiQuery';
import { cutiCreateSchema, cutiUpdateSchema } from '../../domain/validation/cutiSchema';
import { handleUploadFileDokumen } from '../../infrastructure/port/IO';

@controller('/cuti')
export class CutiController {
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
            new GetAllCutiQuery(pageSize, startIndex)
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
        const cuti = await this._queryBus.execute(
            new GetCutiQuery(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: cuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        const uploadResult = await handleUploadFileDokumen(req, res);
        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;

        await cutiCreateSchema.validate(req.body, { abortEarly: false });
        const cuti = await this._commandBus.send(
            new CreateCutiCommand(
                req.body.nidn,
                req.body.tanggal_pengajuan,
                req.body.lama_cuti,
                req.body.tujuan,
                req.body.jenis_cuti,
                uploadResult?.file?.filename
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil mengajukan cuti",
            data: cuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        const uploadResult = await handleUploadFileDokumen(req, res);
        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;

        await cutiUpdateSchema.validate({
            "id": req.body.id,
            "nidn": req.body.nidn,
            "tanggal_pengajuan": req.body.tanggal_pengajuan,
            "lama_cuti": req.body.lama_cuti,
            "tujuan": req.body.tujuan,
            "jenis_cuti": req.body.jenis_cuti,
        }, { abortEarly: false });

        const cuti = await this._commandBus.send(
            new UpdateCutiCommand(
                parseInt(req.body.id),
                req.body.nidn,
                req.body.tanggal_pengajuan,
                req.body.lama_cuti,
                req.body.tujuan,
                req.body.jenis_cuti,
                uploadResult?.file?.filename
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data cuti",
            data: cuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const cuti = await this._commandBus.send(
            new DeleteCutiCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengajuan cuti",
            data: cuti,
            list: null,
            validation: [],
            log: [],
        });
    }
}