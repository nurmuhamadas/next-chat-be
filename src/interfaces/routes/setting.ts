import { Hono } from "hono"

import { GetSetting } from "@/app/use-cases/settings/get-setting"
import { UpdateSetting } from "@/app/use-cases/settings/update-setting"
import { successResponse, zValidator } from "@/common/lib/utils"
import { UpdateSettingEntity } from "@/domains/settings/entities/update-setting-entity"
import { container } from "@/infrastuctures/container"

import { settingSchema } from "../schemas/setting-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const settingRoute = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const session = c.get("userSession")

    const getSetting = container.get(GetSetting)
    const result = await getSetting.execute(session)

    const response: GetSettingResponse = successResponse(result.toDTO())
    return c.json(response)
  })
  .patch(
    "/",
    sessionMiddleware,
    zValidator("json", settingSchema),
    async (c) => {
      const {
        timeFormat,
        language,
        notifications,
        enable2FA,
        showLastSeen,
        allowToAddToGroup,
      } = c.req.valid("json")
      const session = c.get("userSession")

      const setting = UpdateSettingEntity.fromDTO(session.userId, {
        timeFormat,
        language,
        notifications,
        enable2FA,
        showLastSeen,
        allowAddToGroup: allowToAddToGroup,
      })
      const updateSetting = container.get(UpdateSetting)
      const result = await updateSetting.execute(setting)

      const response: UpdateSettingResponse = successResponse(result.toDTO())
      return c.json(response)
    },
  )

export default settingRoute
