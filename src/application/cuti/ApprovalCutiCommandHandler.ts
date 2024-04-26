import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { ApprovalCutiCommand } from './ApprovalCutiCommand';
import { getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class ApprovalCutiCommandHandler implements ICommandHandler<ApprovalCutiCommand> {
  commandToHandle: string = ApprovalCutiCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: ApprovalCutiCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let cuti = await _db.getRepository(Cuti).findOneOrFail({
        where: {
          id: command.id
        },
        relations: {},
    })
    logger.info({cuti:cuti})
    cuti.status = command.type
    cuti.catatan = command.note

    await _db.getRepository(Cuti).save(cuti);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return cuti;
  }
}