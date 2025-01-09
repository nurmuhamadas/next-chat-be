import { GroupOptionEntity } from "../entities/group-option-entity"
import { UpdateGroupOptionEntity } from "../entities/update-group-option-entity"

export abstract class GroupOptionRepository {
  abstract clearAllChats(
    groupId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void>

  abstract getOption(
    groupId: string,
    userId: string,
  ): Promise<GroupOptionEntity | null>

  abstract createOrUpdateOption(
    data: UpdateGroupOptionEntity,
    id?: string,
  ): Promise<GroupOptionEntity>
}
