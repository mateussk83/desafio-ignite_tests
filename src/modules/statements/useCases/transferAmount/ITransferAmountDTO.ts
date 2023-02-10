import { User } from "../../../users/entities/User";

export interface ITransferAmountDTO {
  id: string,
  sender_id: string,
  amount: number,
  description: string
}
