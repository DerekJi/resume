import { Organisation } from "./Organisation";
import { PositionTitle } from "./positionTitle.type";
import { Responsibility } from "./responsibility";
import { ResumeDate } from "./resumeDate";
import { Technology } from "./technology";

export class Experience {
    company: Organisation;
    position: PositionTitle;
    from: ResumeDate;
    to: ResumeDate;

    responsibilities: Array<Responsibility>;
    technologies: Array<Technology>;
}