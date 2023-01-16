#Paperless TBS
Welcome to the Exam Announcement API! This API allows administration to manipulate exam announcements and users to perceive these announcements after logging in.

#Endpoints
The API has the following endpoints:

Client side
POST /signup: Create a new user account
POST /signin: Sign in to an existing user account
POST /forgot-password: Request a password reset
GET /reset-password: Reset a password
POST /reset-password: Confirm password reset
GET /exam_announcements: Retrieve a list of all published exam announcements
Admin side
POST /api/announcements: Create a new exam announcement
GET /api/announcements: Retrieve a list of all exam announcements
GET /api/announcements/published: Retrieve a list of all published exam announcements
PUT /api/announcements/:id: Update an existing exam announcement by its ID
DELETE /api/announcements/:id: Delete an existing exam announcement by its ID
DELETE /api/announcements: Delete all exam announcements
POST /api/announcements: Publish an exam announcement
GET /api/announcements: Retrieve a list of all exam announcements
