import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { CreateGroupEntity } from "../entities/create-group-entity"
import { GroupEntity } from "../entities/group-entity"
import { GroupSearchEntity } from "../entities/group-search-entity"
import { UpdateGroupEntity } from "../entities/update-group-entity"

export abstract class GroupRepository {
  abstract getGroups(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupEntity>>

  abstract checkGroupNameAvailability(
    ownerId: string,
    name: string,
  ): Promise<boolean>

  abstract createGroup(data: CreateGroupEntity): Promise<GroupEntity>

  abstract searchPublicGroups(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupSearchEntity>>

  abstract getGroupById(id: string, userId: string): Promise<GroupEntity | null>

  abstract updateGroup(
    userId: string,
    data: UpdateGroupEntity,
  ): Promise<GroupEntity>

  abstract softDeleteGroup(groupId: string): Promise<void>
}
