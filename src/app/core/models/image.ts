export class Image {
    /**
     * Display text for the image
     */
    label: string;

    /**
     * Alt Text
     */
    altText: string;

    /**
     * The url of the target
     */
    url: string;

    /**
     * @example '\f099' for twitter
     */
    content: string;

    constructor(
        /**
         * The name of the image
         */
        public name: string, 
        /**
         * The url of the image asset itself
         */
        public assetUrl: string) {

    }
}