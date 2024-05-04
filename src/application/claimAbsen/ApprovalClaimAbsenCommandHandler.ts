import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { ApprovalClaimAbsenCommand } from './ApprovalClaimAbsenCommand';
import { getConnection } from 'typeorm';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class ApprovalClaimAbsenCommandHandler implements ICommandHandler<ApprovalClaimAbsenCommand> {
  commandToHandle: string = ApprovalClaimAbsenCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: ApprovalClaimAbsenCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let claimAbsen = await _db.getRepository(ClaimAbsen).findOneOrFail({
        where: {
          id: command.id
        },
        relations: {},
    })
    logger.info({claimAbsen:claimAbsen})
    claimAbsen.status = command.type

    await _db.getRepository(ClaimAbsen).save(claimAbsen);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return claimAbsen;
  }
}