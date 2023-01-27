import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

describe("Get Statement Operation", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
  })

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({

      name: "user test",
      email: "usertest@email.com",
      password: "123"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "test deposit"
    })

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })

    expect(operation).toEqual(statement)
    expect(operation).toHaveProperty("id")
  })
  it("should not be able to get statement operation by user id nonexistent", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "user test",
      email: "usertest@email.com",
      password: "123"
    })
    const falseIdUser = "123123"

    const statement = await createStatementUseCase.execute({
      user_id: falseIdUser,
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "test deposit"
    })

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })
  }).rejects.toBeInstanceOf(GetStatementOperationError)
  })

  it("should not be able to get statement operation by statement id nonexistent", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "user test",
      email: "usertest@email.com",
      password: "123"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "test deposit"
    })

    const falseIdStatement = "123123"

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: falseIdStatement
    })
  }).rejects.toBeInstanceOf(GetStatementOperationError)
  })
})
