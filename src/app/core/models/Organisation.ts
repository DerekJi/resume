import { City } from './city';

export class Organisation {
    name: string;

    /**
     * The location of the organisation
     */
    city: City;

    /**
     * The url of the official website
     */
    officialWebsite: string;
}