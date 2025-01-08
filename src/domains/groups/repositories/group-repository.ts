import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { GroupEntity } from "../entities/group-entity"

export abstract class GroupRepository {
  abstract getGroups(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupEntity>>
}
