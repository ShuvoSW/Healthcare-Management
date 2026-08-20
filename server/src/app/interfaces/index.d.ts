// import { IRequestUser } from "./requestUser.interface";

// declare global {
//     namespace Express{
//         interface Request {
//             user : IRequestUser
//         }
//     }
// }

import { IRequestUser } from "./requestUser.interface";

declare global {
    namespace Express{
        interface Request {
            user: IRequestUser
        }
    }
}