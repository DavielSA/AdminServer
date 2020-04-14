
interface mUser {
    id: number;
    email:string;
    hash:string;
    salt:string;
    name: string;
    permissions:number;
    lastlogin:Date;
    fcreated: Date;
    fupdate: Date;
}
export default mUser;
