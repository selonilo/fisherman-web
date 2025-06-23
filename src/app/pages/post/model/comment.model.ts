import { UserModel } from "../../auth/model/user.model";

export interface CommentModel {
    id?: number;
    createdDate?: Date;
    updatedDate?: Date;
    createdBy?: string;
    updatedBy?: string;
    postId: number;
    userId: number;
    comment: string;
    userModel?: UserModel[];
}
