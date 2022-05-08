export class HumanName {
    constructor(public firstName: string,
        public lastName: string,
        public preferredName: string = '') {
        
    }

    get fullName(): string {
        var names: Array<string> = [
            this.firstName,
            this.lastName
        ].filter(x => x);

        return names.join(' ');
    }
}

export class Name {
    
}