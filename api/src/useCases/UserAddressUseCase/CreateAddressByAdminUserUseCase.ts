// CreateUserAddressUseCase.ts
import { ActorUserAdmin } from "../../dbConfig/configApp";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";



export interface IUserAddressDTO {
  actor: ActorUserAdmin;  // من التوكن أو session
  //addresses: Address[];   // قائمة العناوين المرسلة
}
export default class CreateAddressByAdminUserUseCase {
  constructor(private userAddressRepo: UserAddressRepo) {}

  async execute(dto: IUserAddressDTO) {
    const actor = dto.actor;

    // تحديد userId حسب الصلاحية
    let userId: number;

    // if (dto.userId) {
    //   // Admin يضيف عنوان لمستخدم موجود
    //   if (actor.actorRole !== "admin") throw new Error("Not authorized");
    //   userId = dto.userId;
    // } else {
    //   // User يضيف عنوان لنفسه
    //   userId = actor.actorId;
    // }

    // if (!dto.addresses || dto.addresses.length === 0) {
    //   throw new Error("At least one address is required");
    // }

    // const createdAddresses = [];

    // for (const addr of dto.addresses) {
    //   addr.userId = userId;  // ربط العنوان بالمستخدم
    //   const newAddr = await this.userAddressRepo.create(addr);
    //   createdAddresses.push(newAddr);
    // }

   // return { success: true, addresses: createdAddresses };
 // }
}}