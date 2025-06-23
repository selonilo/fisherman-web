import { EnumPostType } from "../../enum/enum.post.type";

export interface PostQueryModel {
    title?: string;
    postType?: EnumPostType;
}
