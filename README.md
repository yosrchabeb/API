#Paperless TBS
Welcome to the Exam Announcement API! This API allows administration to manipulate exam announcements and users to perceive these announcements after logging in.

#Endpoints
The API has the following endpoints:

Client side
  POST /signup
  POST /signin
  POST /forgot-password
  GET /reset-password
  POST /reset-password
  GET /exam_announcements

Admin side
  POST /api/announcements
  GET /api/announcements
  GET /api/announcements/published
  PUT /api/announcements/:id
  DELETE /api/announcements/:id
  DELETE /api/announcements
  POST /api/announcements
  GET /api/announcements
