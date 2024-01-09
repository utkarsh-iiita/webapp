# Utkarsh (Placements Portal of IIITA)

TODO: wrong docs, update pending

## Table of Contents

- [Utkarsh (Placements Portal of IIITA)](#utkarsh-placements-portal-of-iiita)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Development](#development)
  - [Deployment](#deployment)
    - [Deploy with docker](#deploy-with-docker)
      - [Pre-requisites:](#pre-requisites)
      - [Instructions:](#instructions)
      - [Error handling](#error-handling)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

The project has dockerized development environment. So, you don't have to worry about installing any dependencies on your machine. It includes the Node enviornment, MySQL database and Redis cache. The project is written in Typescript and is build using the **[T3-Stack](https://create.t3.gg/)**.

### Prerequisites

- [Docker Desktop](https://docs.docker.com/desktop/) installed on your machine.
- (Optional) For ease of development, install NodeJS (v20+).

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/BuddyLongLegs/utkarsh
    ```

2. Navigate to the project directory:

    ```bash
    cd utkarsh
    ```
3. Create a blank file named `.env.local`, optionally you can add custom environment variables that bypass the ones defined in `docker-compose.yml`.

4. For ease of development you may have to perform `npm install` to remove the errors in your IDE.
  
## Development
Handy commands for development, make sure you are in the project directory. Linux users may have to use `sudo` for the following commands. The project runs on port `3000`.

  - Initial Configuration:
    ```bash
    docker compose run webapp sh -c "npm run db:push" &&
    docker compose run webapp sh -c "npm run db:seed"
    ```
  - Starting the project:
    ```bash
    docker compose up
    ```
    *Press <Ctrl+C> (<⌘+C> for Mac) to stop the project*
  
  - Starting the project in background:
    ```bash
    docker compose up -d
    ```
  - Stopping the project running in background:
    ```bash
    docker compose down
    ```

  - For development, the docker automatically syncs all the changes made in the code to the container. So, you don't have to restart the container everytime you make a change in the code. But this is only the case for the code present in the `src` directory. If you make any changes outside the `src` directory, which includes new npm package installation or change in database schema, you will have to rebuild the container. To do so, run the following command:
    ```bash
    docker compose up --build
    ```

  - To run any command inside the container, use the following command:
    ***Make sure the container is running***
    ```bash
    docker compose exec <service-name> sh -c <command>
    ```

    The service names are as follows:
    - `webapp` for the NextJs application.
    - `db` for the MySQL database.
    - `cache` for the Redis cache.

    Frequently used commands:
    - To run Prisma Studio (visual editor for the database):
      ```bash
      docker compose exec webapp sh -c "npm run db:studio"
      ```
    - To push the schema changes to the database:
      ```bash
      docker compose exec webapp sh -c "npm run db:push"
      ```
  
## Deployment

There are two ways to deploy the project:
1. Deploy with docker.
2. Deploy with NodeJS.

### Deploy with docker
When deploying with docker, the database, cache, nginx, and daily-backup is automatically setup. Daily backup happens at 0300 hrs and are saved in the `prod_backup` directory.

#### Pre-requisites:
   - Docker installed on the server.
  
#### Instructions:
1. Clone the repository:
    ```bash
    git clone https://github.com/BuddyLongLegs/utkarsh
    ```

2. Navigate to the project directory:

    ```bash
    cd utkarsh
    ```

3. Edit the `docker-compose.prod.yml` file, and make the following changes:
   - Change the `NEXTAUTH_URL` on line 21 to the URL of your website.
   - Change the `NEXTAUTH_SECRET` on line 22 to a random string.
   - If you have a reverse proxy running on your system, you can remove the nginx service from the file, and site will be available at `44444` port.
   - You can change other configurations as per your need.

4. Start the server in the detached mode:
   ```bash
   docker compose -f "./docker-compose.prod.yml" up -d
   ```


  
#### Error handling
You may encounter an error about the database not being synced with the schema during first installation and whenever you make changes in the database schema. You can follow this hack to overcome this issue:

1. Edit the `docker-compose.prod.yml`, change the command at line 12 with `npm run dev`.
   
2. Restart the server.
   
3. Run the following command to sync database with the schema:
   ```bash
   docker compose -f "./docker-compose.prod.yml" exec app sh -c "npm run db:push"
   ```

4. Once the database is in sync, stop the server, undo the previous change in `docker-compose.prod.yml`. Now the problem is fixed.
