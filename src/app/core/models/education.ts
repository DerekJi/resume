import { EducationDegree } from "./educationDegree.type";
import { Organisation } from "./Organisation";
import { ResumeDate } from "./resumeDate";

export class Education {
    degree: EducationDegree;
    major: string;
    from: ResumeDate;
    to: ResumeDate;
    organisation: Organisation;
}