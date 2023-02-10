import { Statement } from "../../entities/Statement";

interface sendIdDTO {
  sender_user_id: string
}

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' |
  'sender_user_id'
>
