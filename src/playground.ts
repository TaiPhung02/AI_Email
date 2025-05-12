import { Account } from "./lib/account";

const acc = new Account("KFBCQr54JrbqL-IixHLLU90xCQc6_N02pvDwxeUjbSA");
// console.log(
//   await acc.getUpdatedEmails({
//     deltaToken: "H4sIAAAAAAAA_2NgZmBkAAPGw4oMLWCW4AUpBpaMktwcALuhXhgdAAAA",
//   }),
// );
await acc.syncEmails();
