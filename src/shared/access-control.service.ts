import { Injectable } from '@nestjs/common';
import { UserRoles } from '../roles/entities/roles.entity';

interface IsAuthorizedParams {
  currentRole: UserRoles;
  requiredRole: UserRoles;
}

@Injectable()
export class AccessControlService {
  private readonly hierarchies: Array<Map<UserRoles, number>> = [];

  constructor() {
    this.buildRoles([UserRoles.GUEST, UserRoles.USER, UserRoles.ADMIN]);
    this.buildRoles([UserRoles.MODERATOR, UserRoles.ADMIN]);
  }

  private buildRoles(roles: UserRoles[]) {
    const hierarchy: Map<UserRoles, number> = new Map();
    roles.forEach((role, index) => {
      hierarchy.set(role, index + 1);
    });
    this.hierarchies.push(hierarchy);
  }

  public isAuthorized({
    currentRole,
    requiredRole,
  }: IsAuthorizedParams): boolean {
    return this.hierarchies.some((hierarchy) => {
      const userPriority = hierarchy.get(currentRole);
      const requiredPriority = hierarchy.get(requiredRole);

      console.log(`Role: ${currentRole}, Priority: ${userPriority}`);
      console.log(`Required: ${requiredRole}, Priority: ${requiredPriority}`);

      return (
        userPriority !== undefined &&
        requiredPriority !== undefined &&
        userPriority >= requiredPriority
      );
    });
  }
}
