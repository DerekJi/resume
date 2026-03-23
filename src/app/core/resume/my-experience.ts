import { City } from "@core/models/city";
import { Experience } from "@core/models/experience";
import { Organisation } from "@core/models/Organisation";
import { Responsibility } from "@core/models/responsibility";
import { ResumeDate } from "@core/models/resumeDate";
import { Technology } from "@core/models/technology";

export class MyExperience {
    private adelaide: City = new City('Adelaide', 'South Australia', 'Australia');
    private sydney: City = new City('Sydney', 'New South Wales', 'Australia');
    private shenzhen: City = new City('Shenzhen', '', 'China');
    private guangzhou: City = new City('Guangzhou', '', 'China');
    private sippyDowns: City = new City('Sippy Downs', 'Queensland', 'Australia');

    public get youi(): Experience {
        var ex = new Experience();
        ex.position = 'Senior Engineer';
        ex.from = new ResumeDate(2023, 1, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Youi Insurance';
            ex.company.city = this.sippyDowns;
            ex.company.officialWebsite = 'https://www.youi.com.au/';
        }

        // Responsibilities
        {
            var ap = new Responsibility();
            ap.summaries = 'Advisor Portal Modernisation (2023) — migrated the legacy broker-facing insurance platform to the new ScreenDriver + Angular architecture:';
            ap.items = [
                'Rebuilt SBI (Small Business Insurance) and Vehicle (VEH) quoting & checkout flows using the ScreenDriver BFF pattern (.NET 8 + Angular 20)',
                'Integrated downstream services: PolicyAdmin, PaymentGateway, Address, Consent, IVR, ABN Lookup, ActivityLogger and Lookups',
                'Real-time broker notifications via Azure SignalR; flow state persistence with Azure Blob Storage; session caching with Redis',
                'Adopted .NET Aspire for orchestrated local development (API + UI + Redis); feature-flag gating via LaunchDarkly',
                'Azure AD / MSAL authentication; comprehensive unit and integration test coverage',
            ];

            var dcq = new Responsibility();
            dcq.summaries = 'Direct Customer Quotes / DCQ (2024 – ongoing) — public-facing insurance quote & buy platform deployed to Azure external landing zone:';
            dcq.items = [
                'Delivered end-to-end quote flows for Vehicle and Small Business Insurance (SBI); currently extending to Motorcycle',
                'Integrated identity verification, Summit pricing engine, payment gateway, address & vehicle data services via Refit HTTP clients',
                'Implemented front-end observability with Elastic APM and analytics with Google Tag Manager',
                'Enforced strict CI quality gates: TreatWarningsAsErrors, NuGet security audit, ESLint + Prettier, Playwright E2E tests',
            ];
        }
        ex.responsibilities = [ ap, dcq ];

        ex.technologies = [
            new Technology('.NET 8 (C#) / ASP.NET Core — BFF / Web API'),
            new Technology('Angular 20 / TypeScript'),
            new Technology('ScreenDriver Flow Engine architecture'),
            new Technology('Azure (Aspire, Redis, Blob Storage, Azure AD / MSAL, SignalR)'),
            new Technology('LaunchDarkly feature flags'),
            new Technology('Refit, FluentValidation, AutoMapper'),
            new Technology('NUnit, NSubstitute, Shouldly — Jest, Playwright'),
            new Technology('GitHub Actions CI/CD'),
        ];
        return ex;
    }

    public get boardroom(): Experience {
        var ex = new Experience();
        ex.position = 'Senior Full Stack Developer';
        ex.from = new ResumeDate(2022, 5, 'MM');
        ex.to = new ResumeDate(2022, 12, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Boardroom Limited';
            ex.company.city = this.sydney;
            ex.company.officialWebsite = 'https://www.boardroomlimited.com/';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Developed new features for payroll and share management platforms. Maintained and upgraded existing services.';
            main.items = [
            ];
        }
        ex.responsibilities = [ main ];

        ex.technologies = [
            new Technology('Angular 13+'),
            new Technology('.NET Core & .Net Framework'),
            new Technology('Test-driven development'),
            new Technology('Oracle & PL/SQL'),
        ];
        return ex;
    }

    public get alcidion(): Experience {
        var ex = new Experience();
        ex.position = 'Senior Developer';
        ex.from = new ResumeDate(2021, 11, 'MM');
        ex.to = new ResumeDate(2022, 5, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Alcidion';
            ex.company.city = this.adelaide;
            ex.company.officialWebsite = 'https://www.alcidion.com/';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Designed and implemented microservices-based healthcare web applications, primarily contributing to:';
            main.items = [
                'Subscription service',
                'Audit service',
                'FHIR-modelling service',
            ];
        }
        ex.responsibilities = [ main ];

        ex.technologies = [
            new Technology('Microservices event-driven architecture with .NET 6 (C#)'),
            new Technology('Test-driven development'),
            new Technology('RabbitMQ and NServiceBus'),
            new Technology('MSSQL & Postgres'),
            new Technology('ElasticSearch for high-performance full text searching'),
            new Technology('Redis for caching services'),
            new Technology('Containerized environments with docker/Kubernetes'),
        ];
        return ex;
    }

    public get raa(): Experience {
        var ex = new Experience();
        ex.position = 'Full Stack Developer';
        ex.from =  new ResumeDate(2020, 12, 'MM');
        ex.to = new ResumeDate(2021, 11, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'RAA';
            ex.company.city = this.adelaide;
            ex.company.officialWebsite = 'https://www.raa.com.au/';
        }

        // Responsibilities
        {
            var quoteToBuy = new Responsibility();
            quoteToBuy.summaries = 'Rewrote the "Quote to Buy" Application:';
            quoteToBuy.items = [
                'Decoupled from core services for improved maintainability',
                'Automated unit and integration tests',
                'Migrated infrastructure from IaaS to PaaS',
                'Built and maintained CI/CD pipelines with Azure DevOps',
            ];

            var paymentGateway = new Responsibility();
            paymentGateway.summaries = 'Payment Gateway Integration:';
            paymentGateway.items = [
                'Technical analysis and high-level design',
                'Implemented payment gateway API integrations',
                'Automated regression tests for reliable payment processing',
                'Collaborated cross-functionally to investigate and resolve issues',
                'Delivered successfully on schedule',
            ];
        }
        ex.responsibilities = [ quoteToBuy, paymentGateway ];

        ex.technologies = [
            new Technology('Senior .NET design and development'),
            new Technology('Senior Angular development'),
            new Technology('Build pipelines for CI/CD'),
            new Technology('Azure services: App Service, Functions, Blob Storage, Queue Storage, ... etc'),
            new Technology('Test Driven Development'),
        ];
        return ex;
    }

    public get dpti(): Experience {
        var ex = new Experience();
        ex.position = 'Full Stack Developer';
        ex.from = new ResumeDate(2019, 6, 'MM');
        ex.to = new ResumeDate(2020, 12, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Department for Infrastructure and Transport';
            ex.company.city = this.adelaide;
            ex.company.officialWebsite = 'https://www.dit.sa.gov.au/';
        }

        // Responsibilities
        {
            var cmc = new Responsibility();
            cmc.summaries = 'Designed and implemented web applications for government and public use.';
            cmc.items = [
                'Contractor Management and Compliance system',
            ];

            var lto = new Responsibility();
            lto.summaries = 'Built the LTO Fee Calculator — a dynamic form engine supporting 200+ land service types. The solution was designed so that:';
            lto.items = [
                'Form field rules and dependencies can change without developer involvement',
                'Business staff can manage configuration independently',
            ]

            var map = new Responsibility();
            map.summaries = 'Additionally, rebuilt the public-facing LocationSA Map Viewer application.';
            map.items = [
            ];
        }
        ex.responsibilities = [ cmc, lto, map ];

        ex.technologies = [
            new Technology('Angular 8 + .Net core 2.1'),
            new Technology('Postgres'),
            new Technology('NoSQL: DynamoDB'),
            new Technology('PaaS with AWS (S3 & Lambda)'),
        ];
        return ex;
    }

    public get novaworks(): Experience {
        var ex = new Experience();
        ex.position = '.Net Full Stack Developer';
        ex.from = new ResumeDate(2018, 2, 'MM');
        ex.to = new ResumeDate(2019, 6, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Novaworks Software';
            ex.company.city = this.adelaide;
            ex.company.officialWebsite = 'https://www.novaworks.com.au/';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Built and supported internal and public-facing parliamentary websites for NSW, VIC, and SA governments.';
        }
        ex.responsibilities = [ main ];

        ex.technologies = [
            new Technology('.Net Core 2.0 & KendoUI for React'),
            new Technology('React + SCSS + Bootstrap'),
            new Technology('CI/CD with AppVeyor & Octopus'),
        ];
        return ex;
    }

    public get toop(): Experience {
        var ex = new Experience();
        ex.position = '.Net Full Stack Developer';
        ex.from = new ResumeDate(2017, 6, 'MM');
        ex.to = new ResumeDate(2018, 2, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Toop&Toop Real Estate';
            ex.company.city = this.adelaide;
            ex.company.officialWebsite = 'https://www.toop.com.au/';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Built and maintained a comprehensive property management platform serving 10+ real estate agencies across Australia.';
        }
        ex.responsibilities = [ main ];

        ex.technologies = [
            new Technology('.NET MVC & WebAPI'),
            new Technology('JavaScript, jQuery, React, Bootstrap'),
            new Technology('SQL Server'),
            new Technology('Azure App Service'),
        ];
        return ex;
    }

    public get lambdasci(): Experience {
        var ex = new Experience();
        ex.position = 'Web Developer';
        ex.from = new ResumeDate(2015, 9, 'MM');
        ex.to = new ResumeDate(2017, 5, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Lambda Scientific Pty, Ltd.';
            ex.company.city = this.adelaide;
            ex.company.officialWebsite = 'https://www.lambdasci.com/';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Owned the full development lifecycle of the company website, integrating ERP (SAP), CRM, and OA functions.';
        }
        ex.responsibilities = [ main ];

        ex.technologies = [
            new Technology('ASP.NET Web Forms (with DevExpress)'),
            new Technology('SQL Server'),
            new Technology('SAP'),
        ];
        return ex;
    }

    public get huawei(): Experience {
        var ex = new Experience();
        ex.position = 'Technical Sales';
        ex.from = new ResumeDate(2008, 8, 'MM');
        ex.to = new ResumeDate(2009, 10, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Huawei Technologies Co, Ltd';
            ex.company.city = this.shenzhen;
            ex.company.officialWebsite = 'https://www.huawei.com/en';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Acted as bidding manager within a sales team pursuing 3G infrastructure projects in the USA.';
        }
        ex.responsibilities = [ main ];

        return ex;
    }

    public get nortel(): Experience {
        var ex = new Experience();
        ex.position = 'Software Engineer';
        ex.from = new ResumeDate(2005, 8, 'MM');
        ex.to = new ResumeDate(2008, 8, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'Nortel Networks Inc.';
            ex.company.city = this.guangzhou;
            ex.company.officialWebsite = 'https://en.wikipedia.org/wiki/Nortel';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Developed features aligned with 3G telecommunication protocols using C/C++ on Solaris.';
            main.items = [
                'UMTS RNC Development',
                'CDMA BTS Development',
            ]
        }
        ex.responsibilities = [ main ];

        return ex;
    }

    public get netease(): Experience {
        var ex = new Experience();
        ex.position = 'Software Developer';
        ex.from = new ResumeDate(2004, 1, 'MM');
        ex.to = new ResumeDate(2005, 8, 'MM');
        ex.company = new Organisation();
        {
            ex.company.name = 'NetEase Inc.';
            ex.company.city = this.guangzhou;
            ex.company.officialWebsite = 'http://www.netease.com/';
        }

        // Responsibilities
        {
            var main = new Responsibility();
            main.summaries = 'Developed a high-performance commercial email system in C++ on Linux.';
            main.items = [
                'Implemented SMTP/POP3 protocols',
                'Implemented email relay services',
                'Developed email web services using PHP + MySQL',
                'Built a high-concurrency connection pool using FastCGI (Perl & C)',
            ]
        }
        ex.responsibilities = [ main ];

        return ex;
    }
}
