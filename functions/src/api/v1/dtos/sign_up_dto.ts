import { UserLocation } from "./location";

export type SignUpDTO = {
    email: string;
    username: string;
    password: string;
    role: String;
    firstName: string;
    lastName: string;
    phone: string;
    location: UserLocation
    
   
}




// constructor (
//     email: string,
// username: string,
// password: string,
// role: String,
// firstName: string,
// lastName: string,
// phone: string,
// location: UserLocation,
// ){
//     this.email = email;
//     this.role = role;
//     this.username = username;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.password  = password;
//     this.phone = phone;
//     this.location = location;
