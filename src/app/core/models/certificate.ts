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
        public issuer: string,

        /**
         * The issued date of the certificate
         */
        public issuedDate: string,

        /**
         * The url of certificate
         */
        public url: string,

        /**
         * The icon image of the certificate
         */
        public icon: Image)
    {};
}