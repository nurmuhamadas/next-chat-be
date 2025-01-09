import { inject, injectable } from "inversify"

import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetNameAvailability {
  constructor(
    @inject(KEYS.GroupRepository) private groupRepository: GroupRepository,
  ) {}

  async execute(session: SessionTokenEntity, name: string): Promise<boolean> {
    return this.groupRepository.checkGroupNameAvailability(session.userId, name)
  }
}
