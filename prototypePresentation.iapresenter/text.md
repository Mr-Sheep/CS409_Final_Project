# EventLawnchair
####  ~~No clever tagline needed~~
	by Team Rwby (Peter, Ander, and Xucheng)
/assets/time_management.png
size: contain
x: left


Hi! Our group's project is called EventLawnchair, brought to you by Team Ruby. the project name is actually inspired by an Android desktop launcher named Lawnchair.


---
### What is EventLawnchair?
#### Event + Launcher => EventLawnchair
	- lightweight
	- all-in-one
	- weather and map integrated
	- self-hostable

To create an event management web app, we call it EventLawnchair. It aims to create a lightweight, all-in-one solution with an enhanced user interface that allows seamless event planning, discovery, and management. The app will simplify the event creation process and also enhance user experience through real-time weather updates (up to 16 days, i think, in advance) and location mapping. We want to simplify event interactions, reduce planning hassles, and ultimately make it easier for users to connect with others and attend events that match their interests.

---
### Current Solutions
	- hard to use
	- clunky UI
	- not responsive

Before I tell you more about EventLawnchair, I want to briefly talk about the current solutions that we have. They often lack integrated features, such as weather information and location mapping, making it difficult for users to plan their attendance effectively. Some have clunky UI and do not offer responsive, user-friendly experiences. And we want something different.

---
### Who?
	- Students and campus communities
	- Small local organizations
	- Event Organizers

Moving back, some of the target audiences of EventLawnchair are: ...

EventLawnchair is self hostable, anyone who would like to have a event management app can deploy it within 10 minutes.

---
/assets/homepage.png
size: contain

EventLawnchair is build with next.js and hosted on vercel, more on that later. Here is our homepage, it is very trivial to get started.

---

/assets/events.png
size: contain

### Events
	- All available events listed here

when the user is not logged in, they can view all the events in the database, but if they want to create their own events or join any, they will need to login. Which brings us to the User Authentication page

---

### User Authentication
/assets/login.png
size: contain
x: left
/assets/signup.png
size: contain
x: right

Users can view events without signing in, and have the ability to add new events once logged in. They can sign up, log in, and log out securely. The password is sent to the server thru https and "bcrypt" on the serverside to avoid storing plaintext passwords.

---
## Dashboard
	- Personalized dashboard with events owned by the user
/assets/dashboard.png
size: contain

once logged in, user will be redirected to their own dashboard, which shows the events they created and in the future will also display the events they wish to participate. 

---
### Event Creation/Modification
	- Address search box that helps auto completing the event location

/assets/create.png
size: contain

for user to modify or create a new event, they will simply need to enter these few details. We are considering adding html formatting / markdown support to the description field.

---
### Event Details
	- QR Code for quicker access
	- Weather forecast for the event's date
	- Map for the location

/assets/detail.png
size: contain

/assets/detail2.png
size: contain

once the event is created, we can now view its details. To make it easier and quicker to access, we created a QR code to the event page.

---
### Deployment
	- Frontend: Vercel via Github
	- Backend: Render via Github


We tried using Cloudflare Pages but it does not allow you to use customized build command to force npm install for next.js v15.0 that uses react 16rc, the release candidate version of React 16.

Render: cuz it's free but rate limited and spin down machine when not in use. It does automatic port forwarding and https so we don't have to mess around with nginx. We also tried using cloudflare worker but the server code is deeply dependent on node.js and express, so if we want to use it, we will probably need frameworks like hono or bun

---
### ToDo
	- "Join Event" feature
	- Show joined event on dashboard
	- show only future events (untested)
	- create new event button in dashboard
	- codebase cleanup (interface in its own module)

Since this is still a prototype, there are still some todos..
---
	## Demo?
	https://cs-409-final-project.vercel.app/
/assets/Clipboard.png
size: contain
x: left


