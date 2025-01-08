import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { CreateGroupEntity } from "../entities/create-group-entity"
import { GroupEntity } from "../entities/group-entity"
import { GroupSearchEntity } from "../entities/group-search-entity"

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
}
