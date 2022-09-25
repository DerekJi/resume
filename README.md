# My Resume 

[![DevOps](https://github.com/DerekJi/resume/actions/workflows/ci.yml/badge.svg)](https://github.com/DerekJi/resume/actions/workflows/ci.yml)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment
https://derekji.github.io/

## How to add new experience
* Edit the file [my-experience.ts](src\app\core\resume\my-experience.ts)
* Add a new getter method like 
```typescript
public get companyName(): Experience {
  var ex = new Experience();
  // build referring to others
  return ex;
}
```
* Edit the file [my-resume.ts](src\app\core\resume\my-resume.ts)
* Add the new experience method into `my.experiences`
```typescript
var work = new MyExperience();
my.experiences = [
  work.companyName,
  // other existing experience
];
```
