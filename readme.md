# Express Nextjs Monorepo Template

## Overview
- Got annoyed rebuilding the same project every time I wanted to start something new so I put all the reusable pieces into one template and made it open source for everyone to use. 
- The repo is designed to give you all the code necessary to start a new project and deploy it. Things are setup to self host in production but I used open source projects that use comonly used paid service interfaces so if you don't want to self host you can easily use paid services by changing environment variables

## Getting started
Setup Infra: `docker compose up`
- This will setup postgres, redis, mailhog (for intercepting emails in dev), glitch tip (self hosted sentry), soketi (self hosted pusher)
- gotchas: Postgres & redis are running on `5433` & `6380` to not conflict with setups you might already have. Mailhog is on `1025` with the UI on `8025`

Install dependencies: run `pnpm install` from the root

Create the env variables:
- Create a `.env` in `frontend`, `backend` & `shared/db` using the `.env.example` in each folder
- Go through the options and set what you need to run the apps (idk off hand what u need tbh)

Run Migrations:
- cd into `shared/db` and run `pnpm run db:migrate` & `pnpm run db:generate`

Run the apps:
- Server: cd into backend and run `pnpm run dev`
- Frontend: cd into frontend and run `pnpm run dev`

Bonus:
- In your cursor settings under rules and commands enable `include CLAUDE.md in context` this will use the current claude md file to help llms add features that follow the template patterns
- After you create an account, make your user role `admin` this will allow you to see the Admin & Theme Builder pages

## Configuration
- Configure authentication settings in `backend/src/lib/better-auth.ts`
    - For each provider you chose for oauth you will need to setup developer apps and add the env variables
    - Check out the better auth documentation for more details: https://www.better-auth.com/docs/authentication/github
- Configure authentication emails in `backend/src/clients/email.client.ts`
- Configuring Stripe:
  - First create a stripe account and update the env variables, you will then need to configure webhooks.
  - Locally run `ngrok http 8000` to get an https url for the webhooks
  - On Stripe make sure to enable at a minimum: `checkout.session.completed`, `customer.subscription.updated` & `customer.subscription.deleted` and add the url from ngrok as the destination as `https://ngrok-domain.com/api/auth/stripe/webhook`. 
  - Then create products for subscriptions
  - In `shared/types/src/stripe.ts` add payment options making sure to include the `priceIds` from stripe. You can checkout the better auth docs for more info on this: https://www.better-auth.com/docs/plugins/stripe
  - Gotchas: The product ids and the price ids are different things. I added the product id by accident and was freaking out when nothing worked. you've been warned
  - Stripe subscriptions will then be tied to the users which you can use for feature access
- Make accounts for:
    - Axiom (for logging): update env variables in the backend
    - Posthog (frontend analytics): update env variables in the frontend
    - Resend (for sending emails): update env variables in the backend
    - GlitchTip Or Sentry (for error logging): if GlitchTip yol have to go the url its running at and make an account, for sentry go to sentry and make an account, then update the backend env variables


## What it comes with
- express backend (with lots of useful features)
- next js frontend
- shared folder for types & utilities
- full authentication with organization and payments through better auth
- real time notifications and channels using soketi
- background jobs with bullmq
- analytics with posthog, google & vercel
- nx for faster builds
- eslint & prettier

## Express Backend
### Structure

![Backend Structure](./structure.png)

Going back to front lets start with the clients, repositories & utils. I like to think about these as
1. clients - anything from backend to 3rd party
2. repositories - anything from backend to database
3. utils - anything from backend to ... nothing

Then Services bring these together to perform business logic. Services shouldn't have to think about the data being in the right structure to be handled. That is the responsibility of the starting layer: CLI, API or Queues

1. CLI - this layer should be setup so that it can call services in a one off style
2. API - this layer handles taking in request, converting them to the format that the services require through a controller and returning a response in the proper format using a formatter.
3. Queues - this is the same idea but flow starts from a job

From my experience this structure scales pretty well and keeps things pretty organized 

### Stack
- `typescript` & `express` ... obvs
- ORM `prisma-kysely` - I switched from `prisma` to `kysely` because I found for more complicated queries prisma just didn't hold up plus I find it kinda stupid that as a developer I needed to think in sql, convert my thoughts to prisma language just for prisma to convert back to sql. `Kysely` is a typesafe sql query builder so pretty sick, only issue is I found migrations required a lot of boiletplate and I missed how simple things were with `prisma`. Then I found `prisma-kysely` literally the best of both worlds. Write you migrations with prisma but generate the output as kysely
- `Bullmq` for jobs
- `better-auth` or `passport.js` for authentication
- `Zod` for request/response validation

### Features
The backend comes with a lot of features I typically needed to copy paste from other projects
- example endpoints to get started
- config setup
- database setup
- queue setup
- redis setup
- logging
- sentry
- caching
- rate limiting
- authentication middlewares
- request validation
- basic authentication
- error handling
- authentication
- organizations
- payments
- notifications
- mcp interface

Additionally, the backend is setup with a shared types folder so it's easy to setup with a frontend.

# Next.js Frontend
- landing page
- authentication flows
- dashboard skeleton
- settings around the main user, orgs and payments
- ability to create new orgs, invite users with different roles
- payments
- admin dashboard + user impersonation
- theme builder

# Deployment
- My favourite way to deploy is frontend on vercel & coolify on heztner with cloudflare, I was able to get this setup into production pretty easily
- Frontend: Vercel picks up that this is a nextjs project with nx builds, just need to add the env variables and you're good
- Coolify Setup:
  - Go on hetzner and get the CPX41 8 VCPUs, 16GB Ram, 33$ a month and more than enough for anything I've built
  - ssh inside and run to install Coolify `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash`
  - Once it's setup go to the dashboard and create an account
  - Make A records for `*` and `hosting` pointing to your domain
  - Go on your coolify dashboard > Settings > General and update the domain to https://hosting.yourdomain.com hit save
  - Go to Servers > localhost > Configuration > General and set the wildcard domain to https://yourdomain.com hit save
  - Now, in hetzner go to your Server > Firewall and create a firewall.
    - look up your ip and set it to `22` protocol tcp (this will only allow your ip to connect over ssh)
    - set `any` for `80` & `any` for `443` (we will update this after setting up cloudflare)
  - Now that the firewall is setup you should only be able to access your coolify dashboard through https://hosting.yourdomain.com, confirm that you cant access through the server_ip:PORT.
  - Next since you were doing everything over http you should change your password and enable 2fa
  - Next I follow this video for extra security measures: https://www.youtube.com/watch?v=ELjlhNT7-5g
    - I only do the disabling password authentication, ufw, unattended-updates, fail2ban
- Backend Setup:
  - On Coolify create a new project
  - Create a resource for Postgres
    - Add extra resources: Idk why but the coolify defaults for postgres don't use nearly enough of the machine as they should be. You can add something like this to the `Custom PostgreSQL Configuration`
    ```
    listen_addresses = '*'
    shared_buffers = 4GB
    work_mem = 32MB
    maintenance_work_mem = 512MB
    max_connections = 200
    ``` 
    - Backups:
      - For backups, go to cloudflare and setup R2 Storage
      - On coolify go to S3 storages and create a new S3 storage using the R2 details
      - In your database configuration page go to backups and add a backup using your s3 configuration
  - Create a resource for Redis
  - Create a resource for GlitchTip (or Sentry)
  - Create a resource for SOketi (If you're using sockets)
  - Create a resource for your backend from Private git repository
    - You will need to connect your github and select the repo
    - It should pickup the nixpacks file and be good to deploy, you just need to add all your production env variables obvs
- Cloudflare
  - Coolify docs on this were pretty clear: https://coolify.io/docs/knowledge-base/cloudflare/origin-cert
  - If setup correctly you can add another layer of security by updating your firewall to only accept incoming requests to `443` & `80` from cloudflare ips you can find them here: https://www.cloudflare.com/en-ca/ips/