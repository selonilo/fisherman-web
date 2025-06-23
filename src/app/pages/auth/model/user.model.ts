import { BaseModel } from "../../common/model/base.model";

export interface UserModel extends BaseModel {
    name: string;
    surname: string;
    mail: string;
    password: string;
    location: string;
    imageUrl: string;
    postCount: number;
    followCount: number;
    followerCount: number;
    commentCount: number;
}
