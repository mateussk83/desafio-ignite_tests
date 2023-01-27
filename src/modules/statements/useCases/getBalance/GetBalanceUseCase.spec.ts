import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError"


let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase
let createStatementUseCase: CreateStatementUseCase

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to fetch the statement by user id", async () => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test email",
      password: "123"
    })

    const statementCreated =  await createStatementUseCase.execute(
      {
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: "test deposit"
      }
    )

    const balance = await getBalanceUseCase.execute(
      {
        user_id: user.id
      })

      expect(balance).toHaveProperty("statement")
      expect(balance.balance).toEqual(3000)
  })
  it("should not be able to fetch the statement with user id nonexistent", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "test name",
        email: "test email",
        password: "123"
      })

      const falseIdUser = "123123"

      const statementCreated =  await createStatementUseCase.execute(
        {
          user_id: falseIdUser,
          type: OperationType.DEPOSIT,
          amount: 3000,
          description: "test deposit"
        }
        )

        const balance = await getBalanceUseCase.execute(
          {
            user_id: falseIdUser
          })
        }).rejects.toBeInstanceOf(GetBalanceError)

  })
})
