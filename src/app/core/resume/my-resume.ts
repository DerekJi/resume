import { HumanName } from "@core/models/humanName";
import { Resume } from "@core/models/resume";
import { Image } from "@core/models/image";
import { Certificate } from "@core/models/certificate";
import { Icon } from "@core/models/icon";
import { ContactMethod } from "@core/models/contact-method";
import { MyEducations } from "./my-educations";
import { MyExperience } from "./my-experience";

// Images
const microsoftIcon = new Image('Microsoft', 'assets/images/microsoft-logo.png');

var my = new Resume();
{
    my.name =  new HumanName('Zhigang', 'Ji', 'Derek');
    my.positionTitle = 'Full Stack Developer';
    my.keywords = [ '.NET (C#)', 'Angular', 'Azure' ];
    my.summaries = [ 
        'Turn your business into web applications and successful solutions.',
        '10+ years experience on commercial application development'
    ];

    my.certificates = [
        new Certificate('Microsoft Certified: DevOps Engineer Expert', 
            'Microsoft', 
            'Nov 2021',
            credly('1a6c2073-ae5e-4b10-8e01-ff728249b558'),
            microsoftIcon),
        new Certificate('Microsoft Certified: Azure Developer', 
            'Microsoft', 
            'Sep 2021',
            credly('6de005cf-c8bc-47d1-9e09-82842cccdcd6'),
            microsoftIcon),
        new Certificate('MCSD: App Builder', 
            'Microsoft', 
            'Nov 2018',
            credly('e8c7a3f1-9f19-4b57-950c-34cd319adb56'),
            microsoftIcon),
        new Certificate('MCSA: Web Applications', 
            'Microsoft', 
            'Nov 2018',
            credly('bd46b09f-0412-4b4a-8f27-982447b32ecf'),
            microsoftIcon),
    ];
    
    var edus = new MyEducations();
    my.educations = [
        edus.masterEducation,
        edus.bachelorEducation,
    ];

    var work = new MyExperience();
    my.experiences = [
        work.alcidion,
        work.raa,
        work.dpti,
        work.novaworks,
        work.toop,
        work.lambdasci,
        work.huawei,
        work.nortel,
        work.netease,
    ];

    my.contactMethods = [
        new ContactMethod('0433 787 282', 
            new Icon('Phone', 'fa fa-mobile', '\f10b'),
            'Phone',
            '0433 787 282'
        ),
        new ContactMethod('derekji.github.io', 
            new Icon('Website', 'fa fa-globe', '\f0ac'),
            'Website',
            'https://derekji.github.io'
        ),
        new ContactMethod('derek-ji.medium.com', 
            new Icon('Medium', 'fa fa-medium', '\f23a'),
            'Medium',
            'https://derek-ji.medium.com/'
        ),
        new ContactMethod('syfool@hotmail.com', 
            new Icon('Email', 'fa fa-envelope', '\f0e0'),
            'Email',
            'mailto:syfool@hotmail.com'
        ),
    ];

    my.socials = [
        new Icon('Twitter', 'fa fa-twitter', '\f099', 'https://twitter.com/zil_ji'),
        new Icon('Facebook', 'fa fa-facebook-f', '\f09a', 'https://www.facebook.com/zhigangji'),
        new Icon('Linedin', 'fa fa-linkedin', '\f0e1', 'https://www.linkedin.com/in/derek-ji-114004168/'),
        new Icon('Medium', 'fa fa-medium', '\f23a', 'https://derek-ji.medium.com/'),
    ];
}

function credly(badgeId: string) {
    return 'https://www.credly.com/badges/${badgeId}';
}

export const MyResume = my;