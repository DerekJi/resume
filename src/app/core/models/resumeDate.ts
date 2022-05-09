import { MonthFormat } from "./monthFormat.type";

const monthName = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
const months = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];

export class ResumeDate {
    constructor(
        public year: number,

        /**
         * Not javascript month
         */
         public month: number = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,

        /**
         * The format to show the month
         * 
         * @example 'MMM' for 'Jan', 'Feb'
         * @example 'MM' for '01', '02'
         */
         public monthFormat: MonthFormat
    ) {}

    public toString(): string {
        switch (this.monthFormat) {
            case 'MMM':
                var month = monthName[this.month - 1];
                return `${month} ${this.year}`;
            case 'MM':
                var month = months[this.month - 1];
                return `${month}/${this.year}`;
        }
    }
}