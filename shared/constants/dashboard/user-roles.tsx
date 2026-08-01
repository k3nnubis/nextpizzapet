export const UserRoleLabel = {
  USER: "Пользователь",
  ADMIN: "Администратор",
};
export const userRoles = Object.entries(UserRoleLabel).map(([value, name]) => ({
  name,
  value,
}));

export type userRoles = keyof typeof UserRoleLabel;
