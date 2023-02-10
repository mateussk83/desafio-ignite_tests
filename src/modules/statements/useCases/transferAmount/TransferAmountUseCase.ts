import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferAmountError } from "./TransferAmountError";

interface IRequest {
  user_id: string;
  sender_id: string;
  amount: number,
  description: string
}



@injectable()
export class TransferAmountUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id ,sender_id, amount, description }: IRequest): Promise<Statement> {

    const recipientUser = await this.usersRepository.findById(user_id);


    if(!recipientUser) {
      throw new TransferAmountError.UserNotFound();
    }

    const senderUser = await this.usersRepository.findById(sender_id);


    if(!senderUser) {
      throw new TransferAmountError.UserSenderNotFound();
    }


    const BalanceAccount = await this.statementsRepository.getUserBalance({
      user_id: recipientUser.id
    })

    if(BalanceAccount.balance < amount) {
      throw new TransferAmountError.insufficientFundsError()
    }

    const transfer = await this.statementsRepository.create({
      user_id: senderUser.id,
      sender_user_id: recipientUser.id,
      amount,
      description,
      type: OperationType.TRANSFER,
    })

    console.log("send: " + transfer.sender_user_id)

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: recipientUser.id
    })

    return transfer
  }
}
