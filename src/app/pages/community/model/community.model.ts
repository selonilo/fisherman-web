export interface CommunityModel {
    id: number;
    createdDate: Date;
    updatedDate: Date;
    createdBy: string;
    updatedBy: string;
    name: string;
    description: string;
    isPublic: boolean;
    postConfirmation: boolean;
    userId: number;
    followedCount: number;
    imageUrl: string;
    file?: File;
}
