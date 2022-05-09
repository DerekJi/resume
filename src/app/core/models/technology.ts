import { Image } from "./image";
import { TechnologyType } from "./technology-type";

export class Technology {
    constructor(
        public name: string,
        public type: TechnologyType = 'Unknown',
        public icon: Image = null,
    ) {
    }
    
}