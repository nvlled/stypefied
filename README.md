# stypefied
a fullstack web framework in typescript

Well, it's not much of a framework now. It's more like an opinionated project template for fullstack web development with typescript. All server and client code, including css and html, can be written in typescript/tsx.

## Getting started
1. Clone or download this repository (sitename replace with your preferred name)
```
git clone https://github.com/nvlled/stypefied.git sitename
```
2. Install dependencies
```
npm install
```
3. Start build pipeline and server
```
npm run watch
```
4. Open http://localhost:7000, make your changes, etc.

## Structure and organization
The Project is flexible enough to support different code organization, such as the traditional MVC (1) or razor-like structure (2) (3).
```
src/
├── models
│   ├── index.ts
│   └── user.ts
├── client
│   ├── home.ts (1)
│   └── main.ts
├── models
│   ├── index.ts
│   └── user.ts
├── pages
│   ├── about
│   │   ├── client.ts (2)
│   │   ├── index.ts  (2)
│   │   └── view.tsx  (2)
│   ├── login.client.ts (3)
│   └── login.tsx       (3)
├── server
│   ├── home.ts (1)
│   └── index.ts
└── views
    ├── home.tsx (1)
    └── layouts
        ├── default.tsx
        └── index.tsx
```

(1) The files for the home page are scattered in different directories, which is how most MVC are structured. The controller (or router) code is placed in the server directory, the view code in the views directory, and the client code in the client directory.

(2) The files for the about page are placed in a single directory, in accordance to razor pages. index.ts contains the controller code, and the view.tsx and client.tsx contains the view and client code respectively.

(3) This is the same with (2), but with the controller and view code combined in one file.

Of course, the organization isn't strictly imposed, the files can be placed in any directory. These are just guidance to keep things clean and organized, but can be freely violated when flexibility and special cases are needed.

## Adding pages
I don't have scaffolding scripts yet, so for now just use the login or about page for reference.
Or more simply, copy the file src/pages/login.tsx to user.tsx, then edit the contents of user.tsx. That's it!

## Adding models
Similarly, refer to user.ts in the src/models directory. Place your models in that directory, then load
a repository using db.getRepository. See TypeORM documentation for more details.

## Main libraries used
- [Express](https://github.com/expressjs/express)
- [TypeORM](https://github.com/typeorm/typeorm)
- [typestyle](https://github.com/typestyle/typestyle)
- [typed-html](https://github.com/nicojs/typed-html)

## Issues
- _It's 2018, where's react, vue, and everything nice?!?_ Well, I mainly started this project so I could do web development the more traditional way: the multi-paged, server-side rendered websites, not the current trend of Single-Page Apps (SPA). I don't have an opinion on which is approach better, I'm just more accustomed to the former and haven't been fully evangelized with the latter.

- typed-html, although safe from type errors, is quite prone to xss. Values must be manually sanitized, which is a lot like vanilla php. Not really much of a problem, typed-html could easily be replaced with other templating libraries.

- The build pipeline is a bit of a mess, which consist of tsc, rollup, and then babel. I'm thinking of just using tsc and systemjs.

- Relative imports. I'm still not sure how if there's a better way of doing things like import * as db from "../../db".
It seems to be a bit of a pain for deeper directories.
