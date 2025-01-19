import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { GroupMemberEntity } from "../entities/group-member-entity"

export abstract class GroupMemberRepository {
  abstract getMembers(
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupMemberEntity>>

  abstract validateUserInGroup(
    groupId: string,
    userId: string,
  ): Promise<boolean>

  abstract joinGroup(groupId: string, userId: string): Promise<void>

  abstract leaveGroup(groupId: string, userId: string): Promise<void>

  abstract validateGroupAdmin(groupId: string, userId: string): Promise<boolean>

  abstract addAdmin(groupId: string, userId: string): Promise<void>

  abstract removeAdmin(groupId: string, userId: string): Promise<void>

  abstract getTotalAdmins(groupId: string): Promise<number>

  abstract getMemberHistory(
    groupId: string,
    userId: string,
  ): Promise<GroupMemberEntity[]>

  abstract getAllMemberIds(groupId: string): Promise<string[]>
}
