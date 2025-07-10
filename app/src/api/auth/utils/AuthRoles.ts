const AuthRoles = {
  admin: ["admin"],
  staff: ["admin", "staff"],
  user: ["admin", "staff", "user"],
  onlyGuest: [],
};

export default AuthRoles;
