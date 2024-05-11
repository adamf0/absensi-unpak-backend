import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { CreateIzinCommand } from '../../application/izin/CreateIzinCommand';
import { UpdateIzinCommand } from '../../application/izin/UpdateIzinCommand';
import { DeleteIzinCommand } from '../../application/izin/DeleteIzinCommand';
import { GetAllIzinQuery } from '../../application/izin/GetAllIzinQuery';
import { GetIzinQuery } from '../../application/izin/GetIzinQuery';
import { izinApprovalSchema, izinCreateSchema, izinUpdateSchema } from '../../domain/validation/izinSchema';
import { izinFilePath, saveDokumenIzin } from '../../infrastructure/port/IO';
import { ApprovalIzinCommand } from '../../application/izin/ApprovalIzinCommand';
import { StatusIzin } from '../../domain/enum/StatusIzin';
import { CountAllCutiOnWaitingQuery } from '../../application/cuti/CountAllCutiOnWaitingQuery';
import { CountAllIzinOnWaitingQuery } from '../../application/izin/CountAllIzinOnWaitingQuery';
import fs from 'fs';

@controller('/izin')
export class IzinController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        let nidn,nip,search,page,pageSize,startIndex,endIndex
        nidn = req.query?.nidn==undefined || req.query?.nidn=="null"? null:req.query.nidn
        nip = req.query?.nip==undefined || req.query?.nip=="null"? null:req.query.nip
        search = req.query?.search==undefined || req.query?.search=="null"? null:req.query.search
        page = req.query?.page==undefined || req.query?.page=="null"? null:parseInt(String(req.query?.page ?? "1"))
        pageSize = req.query?.pageSize==undefined || req.query?.pageSize=="null"? null:parseInt(String(req.query?.pageSize ?? "10"))
        startIndex = (page - 1) * pageSize;
        endIndex = page * pageSize;

        let [data, count] = await this._queryBus.execute(
            new GetAllIzinQuery(
                pageSize, 
                startIndex, 
                ["undefined","null"].includes(nidn)? null:nidn,
                ["undefined","null"].includes(nip)? null:nip,
                ["undefined","null"].includes(search)? null:search,
            )
        );
        data.map((d)=>{
            d.dokumen = d.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/izin/${d.dokumen}`
        })
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
        let izin = await this._queryBus.execute(
            new GetIzinQuery(parseInt(req.params.id))
        );
        izin.dokumen = izin.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/izin/${izin.dokumen}`

        res.status(200).json({
            status: 200,
            message: null,
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        const uploadResult = await saveDokumenIzin(req, res);
        const [_, countCuti] = await this._queryBus.execute(
            new CountAllCutiOnWaitingQuery(req?.body?.nidn,req?.body?.nip)
        );
        const [__, countIzin] = await this._queryBus.execute(
            new CountAllIzinOnWaitingQuery(req?.body?.nidn,req?.body?.nip)
        );
        if(countCuti || countIzin){
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${izinFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw new Error(`pengajuan izin ditolak karena masih ada ${countCuti? "cuti":"izin"} yg belum di terima`)
        }

        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;
        await izinCreateSchema.validate(req.body, { abortEarly: false }).catch((error:Error) => {
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${izinFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw error
        });

        const izin = await this._commandBus.send(
            new CreateIzinCommand(
                req.body.nidn,
                req.body.nip,
                req.body.tanggal_pengajuan,
                req.body.tujuan,
                req.body.jenis_izin,
                uploadResult?.file?.filename
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil mengajukan izin",
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        const uploadResult = await saveDokumenIzin(req, res);
        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;
        await izinUpdateSchema.validate(req.body, { abortEarly: false }).catch((error:Error) => {
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${izinFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw error
        });
        
        const izin = await this._commandBus.send(
            new UpdateIzinCommand(
                parseInt(req.body.id),
                req.body.nidn,
                req.body.nip,
                req.body.tanggal_pengajuan,
                req.body.tujuan,
                req.body.jenis_izin,
                uploadResult?.file?.filename
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data izin",
            data: {
                "id": req.body.id,
                "nidn": req.body.nidn,
                "tanggal_pengajuan": req.body.tanggal_pengajuan,
                "tujuan": req.body.tujuan,
                "jenis_izin": req.body.jenis_izin,
            },
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataIzin = await this._queryBus.execute(
            new GetIzinQuery(parseInt(req.params.id))
        );
        const izin = await this._commandBus.send(
            new DeleteIzinCommand(parseInt(req.params.id))
        );
        if(dataIzin?.dokumen!==null){ //belum di tes lagi
            fs.unlink(`${izinFilePath}/${dataIzin?.dokumen}`, (err) => {})
        }

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengajuan izin",
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/approval')
    async approval(@request() req: Request, @response() res: Response) {
        await izinApprovalSchema.validate({
            "id": req.body.id,
            "type": req.body.type,
            "note": req.body.note,
        }, { abortEarly: false });

        const izin = await this._commandBus.send(
            new ApprovalIzinCommand(
                parseInt(req.body.id),
                req.body.type as StatusIzin,
                req.body.note,
            )
        );

        res.status(200).json({
            status: 200,
            message: `berhasil ${req.body.type} izin`,
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }
}