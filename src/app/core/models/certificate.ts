import { Image } from "./image";

export class Certificate {
    constructor(
        /**
         * The name of the certficate
         */
        public name: string,

        /**
         * The issuer of the certificate
         * @example 'Microsoft', 'AWS', 'Cisco'
         */
        issuer: string,

        /**
         * The issued date of the certificate
         */
        issuedDate: string,

        /**
         * The url of certificate
         */
        url: string,

        /**
         * The icon image of the certificate
         */
        icon: Image)
    {};
}