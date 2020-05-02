
interface mPostsExtended {
    id: number;
    name: string;

    category_id:number;
    category_name:string;
    category_alias:string;

    lang_id: number;
    lang_name:string;

    title:string;
    description:string;
    content:string;

    fcreated: Date;
    fupdate: Date;
}
export default mPostsExtended;
