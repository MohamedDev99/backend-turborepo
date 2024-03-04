export interface IUser {
    _id: string;
    username: string;
    fullName: string;
    gender: "male" | "female";
    password: string;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProtectedUser extends Omit<IUser, "password"> {}
