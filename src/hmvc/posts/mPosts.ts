
interface mPosts {
    id: number;
    category_id: number;
    name: string;
    author: number;
    status: number;
    fcreated: Date;
    fupdate: Date;
}
export default mPosts;

export interface mPostStatus {
    DRAFT: number;
    PUBLISHED: number;
    UNPUBLISHED: number;
    TRASH : number;
}

export const PostStatus: mPostStatus = {
    DRAFT: 0,
    PUBLISHED: 1,
    UNPUBLISHED: 2,
    TRASH: 3
};