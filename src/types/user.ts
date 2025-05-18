interface IUser {
  id: number;
  username: string;
  roles: IRole[];
}
interface ISteamUser {
  steamId: string;
  displayName: string;
  photos: string[];
}
interface IUserWithPassword extends IUser {
  password: string;
}
interface IRole {
  id: number;
  role: string;
  valueRole: string | null;
}

export { IUser, IUserWithPassword, IRole, ISteamUser };
