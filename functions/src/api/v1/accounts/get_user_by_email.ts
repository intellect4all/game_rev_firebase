import {db} from "../../../admin";

// eslint-disable-next-line require-jsdoc
export async function getUserByEmail(email: string, accountType: string) {
  const snapshot = await db.collection(`${accountType}s`)
      .where("email", "==", email)
      .limit(1)
      .get();

  // check if user already exists
  if (!snapshot.empty) {
    return {id: snapshot.docs[0].id, ...snapshot.docs[0].data()};
  } else {
    return undefined;
  }
}

// eslint-disable-next-line require-jsdoc
export async function getUserById(id: string) {
  const snapshot = await db.doc(`users/${id}`).get();
  if (!snapshot.exists) {
    return undefined;
  }
  return snapshot.data();
}


// eslint-disable-next-line require-jsdoc
export async function getUserIdByPaystackCustomerCode(customerCode: string) {
  const snapshot = await db.collection("user_private")
      .where("paystackCustomerCode", "==", customerCode)
      .limit(1)
      .get();

  // check if user already exists
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  } else {
    return undefined;
  }
}
