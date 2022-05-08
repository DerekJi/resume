import { City } from "@core/models/city";
import { Education } from "@core/models/education";
import { Organisation } from "@core/models/Organisation";
import { ResumeDate } from "@core/models/resumeDate";

export class MyEducations {
    public get bachelorEducation(): Education {
        var edu = new Education();
        edu.degree = 'Bachelor';
        edu.major = 'Mining Engineering';
        edu.from = new ResumeDate(1996, 8, 'MM');
        edu.to = new ResumeDate(2000, 7, 'MM');
        edu.organisation = new Organisation();
        edu.organisation.city = new City('Shenyang', 'Liaoning', 'China');
        edu.organisation.name = 'Northeastern University';
        edu.organisation.officialWebsite = 'http://english.neu.edu.cn/';
        return edu;
    }

    public get masterEducation(): Education {
        var edu = new Education();
        edu.degree = 'Master';
        edu.major = 'Computer Science';
        edu.from = new ResumeDate(2001, 8, 'MM');
        edu.to = new ResumeDate(2004, 7, 'MM');
        edu.organisation = new Organisation();
        edu.organisation.city = new City('Guangzhou', 'Guangdong', 'China');
        edu.organisation.name = 'Ji\'Nan University';
        edu.organisation.officialWebsite = 'https://english.jnu.edu.cn/';
        return edu;
    }
}