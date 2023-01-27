import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })
  it("Should be able to show user profile existent", async () => {

    const user = await createUserUseCase.execute({
      name: "user test",
      email: "usertest@email.com",
      password: "123"
    })

    const showUser = await showUserProfileUseCase.execute(user.id)

    expect(showUser).toHaveProperty("id")
    expect(showUser.id).toEqual(user.id)
  })
  it("Should not be able to show user profile with id nonexistent", async () => {
expect(async () => {

  const user = await createUserUseCase.execute({

    name: "user test",
    email: "usertest@email.com",
    password: "123"
  })

  user.id = "falseIdUser"

  const showUser = await showUserProfileUseCase.execute(user.id)

}).rejects.toBeInstanceOf(ShowUserProfileError)


  })
})
