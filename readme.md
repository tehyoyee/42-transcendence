
<h1> Team </h1>

|이름|역할|
|:-:|:-:|
| 김태형 | Backend OAuth GameSocket |
| 권지원 | Backend User Relation ChatSocket |
| 성하림 | Devops Frontend |
| 신재훈 | Frontend (작성) |

<br><br>

<h1>Tech Stacks</h1>

<div align=center>
  
  <h3> Frontend </h3>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white">
  <br>
  <h3> Backend </h3>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white"> 
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
  <br>
  <h3> Database </h3>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=black">
  <br>
  <h3> DevOps </h3>
  <img src="https://img.shields.io/badge/.env-ECD53F?style=for-the-badge&logo=.env&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
  <img src="https://img.shields.io/badge/makefile-A42E2B?style=for-the-badge&logo=GNU&logoColor=white">
  <br>
</div>
  
How to Deploy
================

Prerequisite
------------
versions we used for development are specified in parenthesis.

* Docker Desktop (4.10.1)   
or   
* Docker Engine (20.10.17) and Docker Compose (2.6.1)

#### Optional requirements for automated launch.
* GNU Make (3.81)
* GNU Bash (3.2.57)

Procedures
----------

1. clone git repository to a location you want.
    * ```git clone https://github.com/tehyoyee/42-transcendence.git && cd 42-transcendence```

2. launch
    * manual
        1. copy ```$PWD/tools/.env_sample``` into ```$PWD/.env``` run ```cp $PWD/tools/.env_sample $PWD/.env```
        2. substitute variables(e.g. {{IP ADDRESS}}) with value you want to use.
        3. run ```docker compose up --build```
    * automated
        1. run ```make```
        2. follow instructions about environment variable and development mode.

Directory Structure
-------------------

```
42-transcendence
├── Makefile
├── docker-compose.yml
├── backend
│   ├── Dockerfile
│   ├── tools
│   │   └── entrypoint.sh
│   │
│   │# configs for npm install
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   │
│   │# directory for configs containing environment variables
│   ├── config
│   │
│   │# backend source code mount volume
│   ├── src
│   │
│   │# directory for avatar image storage
│   └── uploads
│
├── frontend
│   ├── Dockerfile
│   │
│   │# configs for npm install and environment variables
│   ├── config
│   ├── entrypoint.sh
│   │
│   │# each child directories are seperate mount volume
│   └── resource
│       │# nextjs app router for routing, layout, pages, global css, fonts and etc.
│       ├── app
│       ├── components
│       ├── lib # custom hooks
│       ├── public # image resource
│       └── styles # css
│
│# mount volume for DB
├── postgres-data
│
│# setup automation script
└── tools
```
Debug
-----
* You can change source code and reflect it immediately by using development mode which is provided by setup script or manually setting each ```FRONTEND_RUN```, ```BACKEND_RUN``` environment variables to ```'dev'```, ```'start:dev'```.


<br><br>

<div align=left>
<h1>ERD</h1>
  <img src = "https://github.com/tehyoyee/42-transcendence/assets/91377377/f033a8b9-44f3-4138-900e-788aa55b86a1">


<br><br>

<h1>API Design Document</h1>
  <img src = "https://github.com/tehyoyee/42-transcendence/assets/91377377/ebd32a2e-c0f1-497a-a00b-0aeec54d83bb">
