import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { GroupMemberEntity } from "../entities/group-member-entity"

export abstract class GroupMemberRepository {
  abstract getMembers(
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupMemberEntity>>
}
