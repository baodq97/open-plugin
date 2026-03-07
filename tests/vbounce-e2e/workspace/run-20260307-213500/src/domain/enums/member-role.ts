export const MemberRole = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
  VIEWER: 'Viewer',
} as const;

export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

export const MEMBER_ROLE_VALUES: readonly MemberRole[] = Object.values(MemberRole);
