import { Certificate } from "@core/models/certificate";
import { ContactMethod } from "./contact-method";
import { Education } from "./education";
import { Experience } from "./experience";
import { HumanName } from "./humanName";
import { PositionTitle } from "./positionTitle.type";
import { Icon } from "./icon";

export class Resume {
    name: HumanName;
    positionTitle: PositionTitle;
    keywords: Array<string>;
    summaries: Array<string>;

    certificates: Array<Certificate>;
    educations: Array<Education>;
    experiences: Array<Experience>;

    contactMethods: Array<ContactMethod>;
    socials: Array<Icon>;
} 