import { describe, expect, it } from "bun:test"

import { LogActivity, UserLogEntity } from "../user-log-entity"

describe("UserLogEntity", () => {
  it("should create an instance with the correct properties", () => {
    const entity = new UserLogEntity(
      "1",
      "user1",
      "session1",
      LogActivity.LOGIN,
      "User logged in.",
    )

    expect(entity.id).toBe("1")
    expect(entity.userId).toBe("user1")
    expect(entity.sessionId).toBe("session1")
    expect(entity.activity).toBe(LogActivity.LOGIN)
    expect(entity.description).toBe("User logged in.")
  })

  it("should allow updating the activity and description", () => {
    const entity = new UserLogEntity(
      "2",
      "user2",
      "session2",
      LogActivity.LOGOUT,
      null,
    )

    entity.activity = LogActivity.RESET_PASSWORD
    entity.description = "User reset password."

    expect(entity.activity).toBe(LogActivity.RESET_PASSWORD)
    expect(entity.description).toBe("User reset password.")
  })
})
