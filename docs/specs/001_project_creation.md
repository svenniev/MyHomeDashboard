# Project description

This is a web app run on a NAS device, used by a family for various purposes, like:
- family budgeting
- training logging
- health logging
- etc..

# Technology stack

Both the web app and the database runs on a NAS and delivered to it as docker container.

For the web app, use Express
For the frontend, use React
For the databse, use (How can I easiest run a database on a QNAP NAS? local or shall I create a container for a database?)
For local development, use VITE. create me the run script and build script, including packaging to docker file
For the UI, base it on the open source adminlte dashboard
The app will be used through browser on PC and mobile phone
The project must contain automatic tests and must be verified on all task implementations
There will be public endpoints for various use cases. I have a custom odometer for my rowing machine that will upload training data after each workout session and will need to query users before starting a workout to choose user on the hardware..

# Tasks for project creation

- create full project structure
- create basic front page:
-- Sidebar header: MeerCornCenter
-- Appbar has sidebar toggle, default notifications dropdown, toggle dark/light mode and default user panel
--- user panel displays for signed-in user: user image and name. Then quick links: Body, Training, Goals. Then on panel footer the default Profile and Sign Out buttons
--- when not signed in, have a Sign-In button
- Implement simple login system. The app is only accessible on local network, so no advanced security is needed
- create simple (default adminlte example) simple login page (https://adminlte.io/themes/v4/examples/login.html)
- create simple profile page (adminlte example: https://adminlte.io/themes/v4/pages/profile.html)
- create a simple registration page. (e.g.: https://adminlte.io/themes/v4/forms/wizard.html)
- landing page shall be similar to the default adminlte landing page (https://adminlte.io/themes/v4/index.html)
- create a simple goals page. signed in users can edit and update progress on goals here
- create simple body composition page. Body composition metrics shall be displayed here in a basic layout
- create a simple admin page (no authorization needed), where data can be set up (e.g. training types)


- All these pages must be minimal. I will specify them in detail later.

# Database scheme for this project creation step

## 1. Application user
- email
- first name
- mid name
- last name
- nickname
- height
- date of birth
- profile picture
- password (hash)
references:
- body composition log
- training log
- goals

## 2. Body composition
- weight
- body fat percent
- muscle percent
- visceral fat percent

## 3. Goal
- title
- short description
- long description
- start date
- target finish date
- value

-- value data should be developed so that it can handle different strategies. All value has:
- start value
- current value
- update datetime
-- examples:
- Reach target body weight of 88kg by 2026.12.31. (currently 100kg)
- Reach an investment portfolio of 100M HUF on abc account by 2026.12.31. (currently 88M HUF)
-- these values must be presentable on a progressbar, regardless of strategy.

## 4. Tranining Log
- Training Type
- training summary json (this can be various formats, depending on training type)
- calories consumed

## 5. Training types
- Training type name
- Thumbnail image


