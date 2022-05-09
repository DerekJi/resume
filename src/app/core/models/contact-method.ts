import { Icon } from "./icon";

export class ContactMethod {
    constructor(
        public name: string,
        public icon: Icon,
        /**
         * @example Phone, Email, Twitter, Linkedin
         */
        public type: string,
        public value: string
    ) {
    }
}