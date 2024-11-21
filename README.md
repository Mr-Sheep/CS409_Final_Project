# CS 409 Final Project Proposal

**Team Name:** Team Rwby  
**Team Members:**

- Ander Zhu (shuqinz2)
- Peter Lu (wenpeng6)
- Xucheng Yu (xy63)

**WebApp Name:** EventLawnchair

## Problem Statement / Motivation

**Problem Statement:** Many individuals struggle to organize and discover events that match their interests and schedules. Current solutions often lack integrated features, such as weather information and location mapping, making it difficult for users to plan their attendance effectively. Some have clunky UI and do not offer responsive, user-friendly experiences.

**Motivation:** To create an event management web app, we call it EventLawnchair. It aims to create a lightweight, all-in-one solution with an enhanced user interface that allows seamless event planning, discovery, and management. We want to simplify event interactions, reduce planning hassles, and ultimately make it easier for users to connect with others and attend events that match their interests.

## User Problems

It is always challenging for users to discover and manage events that fit their interests and schedules. Most existing platforms do not have an intuitive interface to create events, making it difficult for users to set up and promote their events. Additionally, potential attendees struggle to find accurate weather information and navigation support, which are crucial for planning, especially for outdoor gatherings. By integrating these features, the app will not only simplify the event creation process but also enhance user experience through real-time weather updates and location mapping. This will foster community engagement by making it easier for users to connect with others and attend events that interest them.

### Target User Group

Some of the target audiences of EventLawnchair are:

- Students and campus communities
- Small local organizations
- Event Organizers

## Basic Interactions

Users can log in to their account and create their own events. These events can also be seen by other users. There is also a map showing the location of the event and the weather forecast.

1. **User Authentication:** Users can view events without signing in, and have the ability to add new events once logged in. They can sign up, log in, and log out securely.

- **Event Creation:**
  - Event creation needs to input the content, time and place. Created events are accompanied by maps and weather forecasts.
  - Once logged in, the user can easily create new events by entering key info (name, description, date, time, location, etc)
- **Event Dashboard:**
  - Users will have access to a personalized event dashboard where they can view:
    - Events they’ve created
    - Events they are attending
  - Each event component will contain related information like the location of the venue, the number of attendees, and the weather forecast for the day.
- **QR Code display**
  - Ability to generate QR code for the event, no need for manual creation

## Similar Apps

- **OneIllinois** (https://one.illinois.edu): A university platform that lacks individual event creation and is limited to official university-affiliated events.
- **When2meet** (https://www.when2meet.com/): a useful yet overly simple scheduling app without event creation, mapping, or weather features.
- **Sched** (https://sched.com/): a subscription based SaaS platform

## How EventLawnchair Differs

1. **Individual Event Creation:** Unlike OneIllinois, EventLawnchair will allow anyone to create events, whether they’re students, small business owners, or community members.

- **Responsive, Lightweight Design:** EventLawnchair will be fully web-based, accessible from any device, and optimized for mobile without requiring a separate app download.
- **Weather/Map API Integration:** Unlike current apps that often require external tools, EventLawnchair will integrate weather and map APIs to provide comprehensive event information.
