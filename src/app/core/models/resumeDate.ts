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

    toString(): string {
        switch (this.monthFormat) {
            case 'MMM':
                return '${this.monthName[this.month - 1] ${year}';
            case 'MM':
                return '${this.months[this.month - 1]/${year}';
        }
    }
}