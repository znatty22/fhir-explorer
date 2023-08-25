# 🔥 FHIR Explorer 

🔎 Browse data in D3b FHIR servers: https://fhir-explorer.vercel.app

## Available Servers

### Kids First
- https://kf-api-fhir-service-upgrade.kf-strides.org
- https://kf-api-fhir-service-upgrade-qa.kf-strides.org
- https://kf-api-fhir-service-upgrade-dev.kf-strides.org

### INCLUDE DCC
- https://include-api-fhir-service-upgrade.includedcc.org
- https://include-api-fhir-service-upgrade-qa.includedcc.org
- https://include-api-fhir-service-upgrade-dev.includedcc.org

# 👩‍💻 Getting Started For Developers

This is a full stack app built using the NextJS React framework. The frontend
portion also uses Tailwind CSS, and Radix-UI components, while the backend
currently just uses NextJS for API routing and nextauth for OIDC based 
authentication.

## 💻 Setup Dev Environment

Git clone this repo to get started:

```shell
git clone git@github.com:znatty22/fhir-explorer.git
cd fhir-explorer
```

### Install NodeJS
Install the correct version of NodeJS (see version in .tool-versions). The 
easiest way to do it is using [asdf](https://asdf-vm.com/guide/introduction.html)

```shell
asdf install nodejs 18.17.0
```

### Install Pnpm
Install the correct version of pnpm (see version in .tool-versions). The 
easiest way to do it is using [asdf](https://asdf-vm.com/guide/introduction.html)

```shell
asdf install pnpm 8.6.12 
```

### Install app dependencies

Install the dependencies for the NextJS app

```shell
pnpm i
```

### Setup Local FHIR Server
Setup a local FHIR service stack so that you can run the app with it. This 
clones the [kids-first/kf-api-fhir-service](https://github.com/kids-first/kf-api-fhir-service)
Git repo and brings up a docker-compose stack

```shell
# Run setup
./bin/quickstart_local_fhirservice.sh --delete-volumes

# View live service logs
docker-compose -f fhir_server/kf-api-fhir-service/docker-compose.yml logs -f
```

### Set Environment Variables

First create your env var file so the app knows the env vars:

```shell
cp .env.sample .env.local
```

Next you need to fill out the required environment variables in `.env.local`.
Read below for details.

#### Auth
This app uses Auth0 as the OIDC authentication platform so you must setup your 
app to talk to Auth0. Ask the github repo admin for the values of the env vars
or create your own Auth0 "Regular Web Application" client and use those values.

```
# in .env.local

AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_ISSUER=
```

This app uses nextauth as the authentication library so you must set the 
following environment variable with a secret

```
# in .env.local

# Run `openssl rand -hex 32` on linux or go to https://generate-secret.now.sh/32
NEXTAUTH_SECRET= 
```

### Run App
 Bring up the FHIR-Explorer app. You should be able to view the app in the browser 
at http://localhost:3000

```shell
pnpm run dev
```

## 🏞️ Frontend

The frontend source code is located in various subdirectories of `src` except 
the `src/app/api` directory, which is where the API is.

### Tech
- [NextJS](https://nextjs.org/docs) - app framework
- [Tailwind CSS](https://tailwindcss.com/docs/installation) - app styling
- [Typescript](https://www.typescriptlang.org/) - programming language
- [shadcn Radix-UI](https://ui.shadcn.com/) - UI component library

### Generating UI Components
shadcn is actually just a CLI which when run, generates radix-ui UI components 
that you can just drop into the `src/components/ui` folder 

For example, to install the shadcn Alert component you would run 
```shell
pnpm dlx shadcn-ui@latest add alert

# the alert components will be placed in src/components/ui
```

Now you can start using the Alert component in the app.

## 🖥️ Backend
The backend source code is located in `src/app/api`

### Tech
- [NextJS](https://nextjs.org/docs) - app framework
- [Typescript](https://www.typescriptlang.org/) - programming language
- [next-auth](https://next-auth.js.org/getting-started/example) - user authentication

## ✅ Testing

### (Todo) UI unit tests

### (Todo) API unit tests

### Run Linter

```shell
pnpm lint
```

### Typescript Check
```shell
pnpm problems
```

## 🚀 Deployment
We use Vercel for deployments. Each PR has its own deploy preview that has 
an instance of the app with the code in that PR. When commits are 
merged into the master branch, Vercel deploys to production at 
https://fhir-explorer.vercel.app
