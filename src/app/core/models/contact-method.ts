import { Icon } from "./icon";

export class ContactMethod {
    constructor(
        name: string,
        icon: Icon,
        /**
         * @example Phone, Email, Twitter, Linkedin
         */
        type: string,
        value: string
    ) {}
}