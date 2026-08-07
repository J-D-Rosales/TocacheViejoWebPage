# API Documentation & Frontend Integration Guide

This document outlines the API endpoints, authentication model, and data flows required to build the school web application frontend.

---

## 1. Architecture Overview

* **API Gateway:** HTTP API with Catch-All Proxy routing.
* **Authentication:** Amazon Cognito JWT Authorizer (Bearer Tokens).
* **Compute:** Single Node.js AWS Lambda Router.
* **Database:** Amazon DynamoDB (`SchoolEvents`, `SchoolMedia`, `SchoolAwards`).
* **Storage:** Amazon S3 (`tocacheviejowebpage2026`) with 100% private access via pre-signed URLs.

---

## 2. Authentication & Authorization Rules

* **Public Endpoints (`GET`):** Unprotected. Accessible by any browser client without authentication tokens.
* **Protected Endpoints (`POST`, `PUT`, `DELETE`):** Require a valid Cognito `IdToken` sent in the HTTP Header:
```http
Authorization: Bearer <COGNITO_ID_TOKEN>

```



---

## 3. API Endpoints Summary

| Method | Endpoint Path | Authorization | Purpose |
| --- | --- | --- | --- |
| **`POST`** | `/media/upload-urls` | 🔒 Required | Request temporary S3 pre-signed upload URLs |
| **`POST`** | `/events` | 🔒 Required | Save an Event metadata + linked S3 media keys |
| **`GET`** | `/events` | 🔓 Public | Fetch all events (supports `?year=YYYY` query) |
| **`GET`** | `/events/{id}` | 🔓 Public | Fetch single event + temporary 15-min viewable media URLs |
| **`DELETE`** | `/events/{id}` | 🔒 Required | Cascade-delete event, media DB records, and S3 files |
| **`POST`** | `/awards` | 🔒 Required | Create a new award record |
| **`GET`** | `/awards` | 🔓 Public | Fetch all awards |
| **`PUT`** | `/awards/{id}` | 🔒 Required | Update an existing award record |
| **`DELETE`** | `/awards/{id}` | 🔒 Required | Delete an award record |

---

## 4. Detailed Endpoint Specifications

### 4.1 Media Upload Helper

#### `POST /media/upload-urls`

Generates short-lived (5-minute) S3 upload targets for uploading photos or videos directly to S3.

* **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
* **Request Body:**

```json
{
  "year": 2026,
  "eventId": "temp",
  "files": [
    {
      "fileName": "school-play.mp4",
      "fileType": "video/mp4"
    },
    {
      "fileName": "banner.jpg",
      "fileType": "image/jpeg"
    }
  ]
}

```

* **Success Response (`200 OK`):**

```json
{
  "uploadTargets": [
    {
      "s3Key": "media/2026/temp/1718000000000-school-play.mp4",
      "uploadUrl": "https://tocacheviejowebpage2026.s3.amazonaws.com/media/2026/...",
      "fileName": "school-play.mp4"
    },
    {
      "s3Key": "media/2026/temp/1718000000000-banner.jpg",
      "uploadUrl": "https://tocacheviejowebpage2026.s3.amazonaws.com/media/2026/...",
      "fileName": "banner.jpg"
    }
  ]
}

```

---

### 4.2 Events

#### `POST /events`

Creates an event and attaches uploaded S3 media references.

* **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
* **Request Body:**

```json
{
  "name": "Annual Cultural Festival",
  "description": "Student dance performances and music.",
  "year": 2026,
  "eventDate": "2026-08-15",
  "mediaItems": [
    {
      "s3Key": "media/2026/temp/1718000000000-school-play.mp4",
      "type": "VIDEO",
      "title": "Main Stage Play"
    },
    {
      "s3Key": "media/2026/temp/1718000000000-banner.jpg",
      "type": "PHOTO",
      "title": "Opening Ceremony"
    }
  ]
}

```

* **Success Response (`201 Created`):**

```json
{
  "message": "Event and media saved successfully",
  "event": {
    "id": "evt-1718000000000",
    "name": "Annual Cultural Festival",
    "description": "Student dance performances and music.",
    "year": 2026,
    "eventDate": "2026-08-15",
    "createdAt": "2026-08-04T12:00:00.000Z"
  }
}

```

#### `GET /events`

Retrieves events list. Supports filtering by year.

* **Query Parameters:** `?year=2026` (Optional)
* **Success Response (`200 OK`):**

```json
[
  {
    "id": "evt-1718000000000",
    "name": "Annual Cultural Festival",
    "description": "Student dance performances and music.",
    "year": 2026,
    "eventDate": "2026-08-15",
    "createdAt": "2026-08-04T12:00:00.000Z"
  }
]

```

#### `GET /events/{id}`

Fetches full details of a single event, including 15-minute temporary view/play URLs for attached photos and videos.

* **Success Response (`200 OK`):**

```json
{
  "id": "evt-1718000000000",
  "name": "Annual Cultural Festival",
  "description": "Student dance performances and music.",
  "year": 2026,
  "eventDate": "2026-08-15",
  "media": [
    {
      "id": "med-1718000000000-a1b2c",
      "eventId": "evt-1718000000000",
      "s3Key": "media/2026/temp/1718000000000-school-play.mp4",
      "type": "VIDEO",
      "title": "Main Stage Play",
      "url": "https://tocacheviejowebpage2026.s3.amazonaws.com/media/2026/temp/...?X-Amz-Signature=..."
    }
  ]
}

```

#### `DELETE /events/{id}`

Cascade-deletes the event record, related media items in DynamoDB, and the underlying files in S3.

* **Headers:** `Authorization: Bearer <TOKEN>`
* **Success Response (`200 OK`):**

```json
{
  "message": "Event evt-1718000000000, 2 S3 file(s), and related media records deleted successfully."
}

```

---

### 4.3 Awards

#### `POST /awards`

* **Headers:** `Authorization: Bearer <TOKEN>`
* **Request Body:**

```json
{
  "name": "First Place Science Fair",
  "description": "Awarded for exceptional chemistry experiment.",
  "year": 2026,
  "place": "1st Place"
}

```

#### `GET /awards`

* **Success Response (`200 OK`):**

```json
[
  {
    "id": "awd-1718000000000",
    "name": "First Place Science Fair",
    "description": "Awarded for exceptional chemistry experiment.",
    "year": 2026,
    "place": "1st Place",
    "createdAt": "2026-08-04T12:00:00.000Z"
  }
]

```

#### `PUT /awards/{id}`

* **Headers:** `Authorization: Bearer <TOKEN>`
* **Request Body:** Update fields (`name`, `description`, `year`, `place`).

#### `DELETE /awards/{id}`

* **Headers:** `Authorization: Bearer <TOKEN>`

---

## 5. Frontend Integration & Execution Flows

```text
================================================================================
FLOW 1: ADMIN CREATING AN EVENT WITH MEDIA (PHOTOS / VIDEOS)
================================================================================

 [Admin Form Submission]
          │
          ├── 1. POST /media/upload-urls (Send filename list)
          │      └── Returns array of { s3Key, uploadUrl }
          │
          ├── 2. Direct S3 Upload (Loop through files)
          │      └── For each file: PUT to uploadUrl with raw binary File object
          │
          └── 3. POST /events
                 └── Send event metadata + array of { s3Key, type, title }

```

### Reference Implementation (JavaScript / React):

```javascript
// Step 1 & 2 & 3 Combined Handler for Creating Events
async function handleCreateEvent(formData, attachedFiles, authToken) {
  const BASE_URL = "https://<your-api-id>.execute-api.us-east-1.amazonaws.com";

  // STEP 1: Get S3 Pre-Signed Upload URLs
  const fileInfoList = attachedFiles.map((file) => ({
    fileName: file.name,
    fileType: file.type,
  }));

  const urlRes = await fetch(`${BASE_URL}/media/upload-urls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      year: Number(formData.year),
      eventId: "temp",
      files: fileInfoList,
    }),
  });

  const { uploadTargets } = await urlRes.json();

  // STEP 2: Upload Binary Files directly to S3 Bucket
  const mediaItems = [];
  for (let i = 0; i < attachedFiles.length; i++) {
    const target = uploadTargets[i];
    const file = attachedFiles[i];

    // Direct upload to S3 (Bypassing Lambda payload limit)
    await fetch(target.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    mediaItems.push({
      s3Key: target.s3Key,
      type: file.type.startsWith("video/") ? "VIDEO" : "PHOTO",
      title: file.name,
    });
  }

  // STEP 3: Save Event metadata & S3 keys in DynamoDB
  const eventRes = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: formData.name,
      description: formData.description,
      year: Number(formData.year),
      eventDate: formData.eventDate,
      mediaItems: mediaItems,
    }),
  });

  return await eventRes.json();
}

```

---

```text
================================================================================
FLOW 2: PUBLIC USER DISPLAYING AN EVENT & PLAYING MEDIA
================================================================================

 [User Views Event Page]
          │
          └── 1. GET /events/{id}
                 └── Returns event details + media items with pre-signed URLs

```

### Reference Implementation (React Detail View):

```javascript
import React, { useEffect, useState } from "react";

export function EventDetailComponent({ eventId }) {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    fetch(`https://<your-api-id>.execute-api.us-east-1.amazonaws.com/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEventData(data));
  }, [eventId]);

  if (!eventData) return <div>Loading...</div>;

  return (
    <div className="event-container">
      <h1>{eventData.name}</h1>
      <p>{eventData.description}</p>
      <span>Year: {eventData.year}</span>

      <div className="media-gallery">
        {eventData.media?.map((item) => (
          <div key={item.id} className="media-card">
            {item.type === "VIDEO" ? (
              <video controls width="100%">
                <source src={item.url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            ) : (
              <img src={item.url} alt={item.title} width="100%" />
            )}
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

```# TocacheViejoWebPage
