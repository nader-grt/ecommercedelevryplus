



export default abstract class IUserAddressRepo
{

    protected abstract createUserWithAddresses(userInfo: any, addressUser: any) :Promise<any> ;
}