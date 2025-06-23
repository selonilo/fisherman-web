import { EnumFishType } from "../../enum/enum.fish.type";
import { EnumPostType } from "../../enum/enum.post.type";
import { CommentModel } from "./comment.model";

export interface PostModel {
    id: number;
    createdDate: Date;
    updatedDate: Date;
    createdBy: string;
    updatedBy: string;
    title: string;
    content: string;
    userId: number;
    locationId?: number;
    viewNumber: number;
    likeNumber: number;
    fishType: EnumFishType;
    isLiked: boolean;
    imageUrl: string;
    userImageUrl: string;
    name: string;
    isFollowed: boolean;
    commentModelList: CommentModel[];
    showCommentInput: boolean;
    showComment: boolean;
    file?: File;
}
