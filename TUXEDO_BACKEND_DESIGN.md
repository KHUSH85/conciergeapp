# TUXEDO CONCIERGE — Backend Design and API Documentation


**Version:** 1.0  
**Product:** Tuxedo Concierge — Luxury Hotel Chauffeur Platform  
**Frontend:** React Native (Expo) — iOS & Android  
**Audience:** Backend engineers, product managers, QA

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [End-to-End Flow Diagrams](#3-end-to-end-flow-diagrams)
4. [System Architecture](#4-system-architecture)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Real-Time Events (WebSocket)](#7-real-time-events-websocket)
8. [Business Logic Rules](#8-business-logic-rules)
9. [Security & Authentication](#9-security--authentication)
10. [Third-Party Integrations](#10-third-party-integrations)
11. [Error Codes Reference](#11-error-codes-reference)

---

## 1. Product Overview

Tuxedo Concierge is a luxury hotel chauffeur platform. Hotel staff — concierge and managers — use the mobile app to book, dispatch, and track premium rides on behalf of hotel guests. Guests receive a tracking link on their phone and can follow their chauffeur in real time via a separate passenger web app.

The current mobile app runs entirely on mock data. This document defines the full backend needed to make it production-ready.

### What the Backend Must Do

| Area | What It Replaces | What It Provides |
|---|---|---|
| Authentication | Hardcoded OTP `123456`, demo accounts | Real SMS OTP, JWT sessions, device binding |
| Users & Profiles | Hardcoded user object in login screen | Persistent user records, KYC state, onboarding |
| Drivers | 5 static mock drivers in `mockDrivers.ts` | Live driver registry with real-time availability |
| Rides | Local state only, no persistence | Full ride lifecycle with status machine and history |
| Commissions | Static numbers ($142.50 / $856 / $3,420) | Real commission ledger calculated per ride |
| Membership | AsyncStorage `isMember` flag | Stripe-backed subscription with ride credit |
| Passenger Tracking | Client-generated 8-char token | Server-issued token, real-time WebSocket tracking |
| Coupons | Client-generated `TUX100-XXXXXX` codes | Server-issued, validated, redeemable coupon system |
| Notifications | None | Push (APNs/FCM), SMS, in-app |

### Core Business Numbers

| Rule | Value |
|---|---|
| Base fare (card) | $45.00 |
| Base fare (cash) | $54.00 (base × 1.20) |
| Commission rate | 15% of fare |
| Membership price | $100/year |
| Membership ride credit | $100 instant credit on purchase |
| Coupon format | `TUX100-XXXXXX` — $100 value |
| Tracking token | 8-character uppercase alphanumeric |
| Tracking URL | `https://passenger-webapp-lac.vercel.app/track-ride?token=XXXXXXXX&pickup=<hotelName>` |

---

## 2. User Roles & Permissions

| Role | Description | Permissions |
|---|---|---|
| **Concierge** | Hotel front desk staff | Book rides, view own commissions, track rides, manage guest details |
| **Manager** | Hotel management | All concierge permissions + view hotel-wide analytics, manage staff |
| **Passenger** | Hotel guest | Track ride via web link (no login required) |
| **Driver** (future) | Chauffeur | Accept rides, update status, navigate to pickup/destination |

---

## 3. End-to-End Flow Diagrams

### 3.1 Instant Ride Booking Flow

```
Concierge App                    Backend                      Passenger Web
─────────────                    ───────                      ─────────────

1. Login with phone
   POST /auth/otp/send ────────> Send OTP via Twilio
   POST /auth/otp/verify ──────> Verify OTP, return JWT

2. Tap "Call a Car"
   Navigate to GuestDetails

3. Enter guest phone/email
   Tap "Send Chauffeur Request"
   POST /rides ────────────────> Create ride record
                                  Generate tracking token
                                  Send SMS to guest with link ──────> Guest receives SMS

4. Guest taps link ──────────────────────────────────────────────> Opens passenger web
                                                                     GET /tracking/:token
                                                                     Shows ride status

5. Concierge selects driver
   POST /rides/:id/assign ─────> Assign driver
                                  Update ride status to 'assigned'
                                  WebSocket: ride:status_update ──> Live update on passenger web

6. Driver arrives
   PUT /rides/:id/status ──────> Update to 'arriving'
                                  WebSocket: ride:status_update ──> Passenger sees "Driver arriving"

7. Guest boards
   PUT /rides/:id/status ──────> Update to 'onboard'

8. Ride completes
   POST /rides/:id/complete ───> Calculate commission
                                  Create commission record
                                  Update ride status to 'completed'

9. Concierge rates driver
   POST /rides/:id/rate ───────> Store rating
```

### 3.2 Scheduled Ride Flow

```
1. Concierge taps "Reserve a Ride"
2. Enter guest contact
3. Select date & time
4. Choose "Auto-Assign" or "Choose Chauffeur"
5. POST /rides (with scheduledAt timestamp)
6. Backend creates ride with status 'scheduled'
7. Background worker monitors scheduled rides
8. 30 minutes before scheduledAt:
   - Auto-assign driver (if not already chosen)
   - Send SMS to guest with tracking link
   - Update status to 'assigned'
   - WebSocket notification to concierge
```

### 3.3 Passenger Membership Purchase Flow

```
Passenger Web                    Backend                      Concierge App
─────────────                    ───────                      ─────────────

1. Guest opens tracking link
   GET /tracking/:token ───────> Return ride details

2. Sees "Unlock Premium Features"
   Taps "Join Gold Membership"

3. Enter payment details
   POST /memberships ──────────> Create Stripe payment intent
                                  Return client_secret

4. Complete payment
   POST /memberships/confirm ──> Confirm payment with Stripe
                                  Create membership record
                                  Add $100 ride credit
                                  Generate coupon TUX100-XXXXXX
                                  Store in pending state

5. Download app prompt
   "Download app to use your $100 credit"

6. Guest downloads app, logs in
   POST /auth/otp/verify ──────> Check for pending coupons
                                  Activate coupon
                                  Apply to user account
                                  Update membership status

7. Concierge sees updated status ────────────────────────────> WebSocket: user:membership_updated
```

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       TUXEDO PLATFORM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │ Concierge App│    │ Passenger Web│    │ Driver App       │  │
│  │ React Native │    │ Next.js      │    │ (Future)         │  │
│  └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘  │
│         │                   │                      │            │
│         └───────────────────┼──────────────────────┘            │
│                             │                                   │
│                  ┌──────────▼──────────┐                        │
│                  │   API Gateway / LB   │                        │
│                  └──────────┬──────────┘                        │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│  ┌──────▼──────┐   ┌────────▼────────┐   ┌─────▼──────┐        │
│  │ REST API    │   │ WebSocket Server│   │ Background │        │
│  │ Node.js     │   │ Socket.IO       │   │ Workers    │        │
│  └──────┬──────┘   └────────┬────────┘   └─────┬──────┘        │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│  ┌──────▼──────┐   ┌────────▼────────┐   ┌─────▼──────┐        │
│  │ PostgreSQL  │   │ Redis           │   │ S3 Storage │        │
│  │ Primary DB  │   │ Cache + Pub/Sub │   │ Images     │        │
│  └─────────────┘   └─────────────────┘   └────────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Third-Party: Twilio │ Stripe │ Firebase │ Google Maps   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 20 LTS | Backend server |
| Framework | NestJS or Express | REST API |
| Language | TypeScript | Type safety |
| Database | PostgreSQL 16 | Primary data store |
| Cache | Redis 7 | Sessions, OTP, pub/sub |
| ORM | Prisma | Database access |
| WebSocket | Socket.IO | Real-time updates |
| File Storage | AWS S3 | Driver photos, vehicle images |
| SMS | Twilio | OTP delivery |
| Payments | Stripe | Membership subscriptions |
| Push Notifications | Firebase (FCM/APNs) | Mobile push |
| Maps | Google Maps API | Distance, ETA calculations |

---

## 5. Database Schema

All tables use PostgreSQL with UUID primary keys and `TIMESTAMPTZ` timestamps.

### 5.1 hotels

```sql
CREATE TABLE hotels (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  address       TEXT,
  city          VARCHAR(100),
  country       VARCHAR(100),
  phone         VARCHAR(30),
  email         VARCHAR(255),
  timezone      VARCHAR(60) DEFAULT 'UTC',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.2 users

```sql
CREATE TYPE user_role AS ENUM ('concierge', 'manager', 'passenger');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) UNIQUE,
  phone           VARCHAR(30) NOT NULL UNIQUE,
  role            user_role NOT NULL DEFAULT 'concierge',
  hotel_id        UUID REFERENCES hotels(id),
  hotel_name      VARCHAR(255),
  device_bound    BOOLEAN NOT NULL DEFAULT FALSE,
  device_name     VARCHAR(255),
  device_id       VARCHAR(255),
  kyc_status      kyc_status NOT NULL DEFAULT 'pending',
  is_member       BOOLEAN NOT NULL DEFAULT FALSE,
  ride_credit     NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  is_onboarded    BOOLEAN NOT NULL DEFAULT FALSE,
  full_name_set   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.3 otp_codes

```sql
CREATE TABLE otp_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(30) NOT NULL,
  code        VARCHAR(6) NOT NULL,
  role        user_role,
  attempts    SMALLINT NOT NULL DEFAULT 0,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.4 drivers

```sql
CREATE TYPE driver_status AS ENUM ('online', 'offline', 'on_trip', 'unavailable');

CREATE TABLE drivers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chauffeur_id      VARCHAR(20) UNIQUE,
  name              VARCHAR(255) NOT NULL,
  phone             VARCHAR(30) NOT NULL UNIQUE,
  photo_url         TEXT,
  rating            NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  experience_years  SMALLINT NOT NULL DEFAULT 0,
  languages         TEXT[] DEFAULT '{}',
  status            driver_status NOT NULL DEFAULT 'offline',
  acceptance_rate   NUMERIC(5,2),
  on_time_rate      NUMERIC(5,2),
  verified          BOOLEAN NOT NULL DEFAULT FALSE,
  background_check  BOOLEAN NOT NULL DEFAULT FALSE,
  hotel_preferred   BOOLEAN NOT NULL DEFAULT FALSE,
  vip_only          BOOLEAN NOT NULL DEFAULT FALSE,
  hotel_id          UUID REFERENCES hotels(id),
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  current_lat       NUMERIC(10,7),
  current_lng       NUMERIC(10,7),
  current_eta_mins  SMALLINT,
  current_distance  NUMERIC(8,2),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.5 driver_vehicles

```sql
CREATE TABLE driver_vehicles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id   UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  brand       VARCHAR(100) NOT NULL,
  model       VARCHAR(100) NOT NULL,
  plate       VARCHAR(30) NOT NULL,
  year        SMALLINT NOT NULL,
  color       VARCHAR(60),
  interior    VARCHAR(100),
  photo_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.6 driver_amenities

```sql
CREATE TABLE driver_amenities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id     UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE UNIQUE,
  wifi          BOOLEAN NOT NULL DEFAULT FALSE,
  music         BOOLEAN NOT NULL DEFAULT FALSE,
  child_seat    BOOLEAN NOT NULL DEFAULT FALSE,
  refreshments  BOOLEAN NOT NULL DEFAULT FALSE,
  water         BOOLEAN NOT NULL DEFAULT FALSE,
  charger       BOOLEAN NOT NULL DEFAULT FALSE,
  luggage_cap   SMALLINT DEFAULT 0,
  wheelchair    BOOLEAN NOT NULL DEFAULT FALSE,
  silent_mode   BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.7 rides

```sql
CREATE TYPE ride_status AS ENUM (
  'creating', 'matching', 'assigned', 'arriving',
  'onboard', 'enroute', 'completed', 'cancelled', 'scheduled'
);
CREATE TYPE vehicle_type AS ENUM ('sedan', 'suv', 'luxury', 'van');
CREATE TYPE payment_type AS ENUM ('card', 'cash');

CREATE TABLE rides (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status            ride_status NOT NULL DEFAULT 'creating',
  created_by        UUID NOT NULL REFERENCES users(id),
  hotel_id          UUID REFERENCES hotels(id),
  driver_id         UUID REFERENCES drivers(id),
  guest_phone       VARCHAR(30),
  guest_email       VARCHAR(255),
  guest_present     BOOLEAN NOT NULL DEFAULT FALSE,
  pickup_location   TEXT NOT NULL,
  destination       TEXT,
  vehicle_type      vehicle_type NOT NULL DEFAULT 'luxury',
  payment_type      payment_type NOT NULL DEFAULT 'card',
  booking_mode      VARCHAR(20) NOT NULL DEFAULT 'instant',
  fare              NUMERIC(10,2) NOT NULL DEFAULT 45.00,
  commission        NUMERIC(10,2) NOT NULL DEFAULT 6.75,
  tip               NUMERIC(10,2) DEFAULT 0.00,
  is_scheduled      BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_at      TIMESTAMPTZ,
  choose_chauffeur  BOOLEAN DEFAULT FALSE,
  rating            SMALLINT CHECK (rating BETWEEN 1 AND 5),
  cash_confirmed    BOOLEAN DEFAULT FALSE,
  add_ons           TEXT[] DEFAULT '{}',
  tracking_token    VARCHAR(8),
  passenger_link    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_at       TIMESTAMPTZ,
  arriving_at       TIMESTAMPTZ,
  onboard_at        TIMESTAMPTZ,
  enroute_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.8 commissions

```sql
CREATE TABLE commissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  ride_id     UUID NOT NULL REFERENCES rides(id),
  hotel_id    UUID REFERENCES hotels(id),
  amount      NUMERIC(10,2) NOT NULL,
  date        DATE NOT NULL,
  paid_out    BOOLEAN NOT NULL DEFAULT FALSE,
  payout_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.9 memberships

```sql
CREATE TYPE membership_status AS ENUM ('active', 'expired', 'cancelled', 'pending');

CREATE TABLE memberships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  status          membership_status NOT NULL DEFAULT 'pending',
  plan            VARCHAR(50) NOT NULL DEFAULT 'gold_annual',
  price_paid      NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  ride_credit     NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  ride_credit_used NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  payment_method  VARCHAR(50),
  payment_ref     VARCHAR(255),
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  cancelled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.10 coupons

```sql
CREATE TYPE coupon_status AS ENUM ('pending_app_login', 'active', 'redeemed', 'expired', 'cancelled');

CREATE TABLE coupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              VARCHAR(20) NOT NULL UNIQUE,
  amount            NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  campaign          VARCHAR(100) NOT NULL,
  status            coupon_status NOT NULL DEFAULT 'pending_app_login',
  linked_phone      VARCHAR(30),
  linked_email      VARCHAR(255),
  linked_user_id    UUID REFERENCES users(id),
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activated_at      TIMESTAMPTZ,
  redeemed_at       TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  ride_id           UUID REFERENCES rides(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.11 notifications

```sql
CREATE TYPE notification_channel AS ENUM ('push', 'sms', 'in_app');
CREATE TYPE notification_status  AS ENUM ('pending', 'sent', 'failed', 'read');

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  channel     notification_channel NOT NULL,
  title       VARCHAR(255),
  body        TEXT NOT NULL,
  data        JSONB DEFAULT '{}',
  status      notification_status NOT NULL DEFAULT 'pending',
  sent_at     TIMESTAMPTZ,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 6. API Reference

All endpoints are prefixed with `/api/v1`. All requests and responses use JSON. All protected endpoints require a `Bearer <JWT>` token in the `Authorization` header.

---

### 6.1 Authentication & OTP

#### Send OTP

```
POST /auth/otp/send
```

Sends a 6-digit OTP to the provided phone number via SMS. OTP expires in 5 minutes. Maximum 3 resend attempts per 10-minute window.

**Request body:**
```json
{
  "phone": "+15551000001",
  "role": "concierge"
}
```

**Response:**
```json
{
  "success": true,
  "expiresIn": 300,
  "message": "OTP sent"
}
```

**What happens on the backend:**
1. Validate phone format (E.164)
2. Check rate limit (max 3 OTPs per phone per 10 minutes)
3. Generate 6-digit code
4. Store in `otp_codes` table with 5-minute expiry
5. Send via Twilio SMS
6. Return success

---

#### Verify OTP

```
POST /auth/otp/verify
```

Verifies the OTP and returns a JWT access token and refresh token. On first login, creates the user record. On subsequent logins, updates `last_login_at`.

**Request body:**
```json
{
  "phone": "+15551000001",
  "code": "123456",
  "role": "concierge",
  "deviceId": "device-hardware-id",
  "deviceName": "Concierge Desk Mobile"
}
```

**Response:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "user": {
    "id": "uuid",
    "name": "James Anderson",
    "phone": "+15551000001",
    "role": "concierge",
    "hotelId": "uuid",
    "hotelName": "The Grand Majestic Hotel",
    "deviceBound": true,
    "deviceName": "Concierge Desk Mobile",
    "kycStatus": "approved",
    "isMember": false,
    "rideCredit": 0.00,
    "isOnboarded": false
  },
  "pendingCoupon": null
}
```

**What happens on the backend:**
1. Look up the most recent unverified OTP for this phone
2. Check it has not expired
3. Check attempts < 5 (lock out after 5 wrong attempts)
4. Compare code — if wrong, increment attempts and return error
5. Mark OTP as verified
6. Look up user by phone — create if not found
7. Check for any `pending_app_login` coupons linked to this phone — activate them
8. Issue JWT (15-minute expiry) and refresh token (30-day expiry)
9. Store refresh token hash in `refresh_tokens` table
10. Return user object + tokens + any pending coupon

---

#### Refresh Token

```
POST /auth/token/refresh
```

**Request body:**
```json
{
  "refreshToken": "abc123..."
}
```

**Response:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "newtoken..."
}
```

---

#### Logout

```
POST /auth/logout
```

Revokes the current refresh token. Requires auth header.

---

### 6.2 Users & Profiles

#### Get Current User

```
GET /users/me
```

Returns the full profile of the authenticated user.

**Response:**
```json
{
  "id": "uuid",
  "name": "James Anderson",
  "email": "james@grandmajestic.com",
  "phone": "+15551000001",
  "role": "concierge",
  "hotelId": "uuid",
  "hotelName": "The Grand Majestic Hotel",
  "deviceBound": true,
  "deviceName": "Concierge Desk Mobile",
  "kycStatus": "approved",
  "isMember": true,
  "rideCredit": 100.00,
  "isOnboarded": true
}
```

---

#### Update Profile

```
PATCH /users/me
```

**Request body (all fields optional):**
```json
{
  "name": "James Anderson",
  "email": "james@grandmajestic.com",
  "deviceName": "Concierge Desk Mobile"
}
```

---

#### Complete Onboarding

```
POST /users/me/onboard
```

Marks the user as onboarded after the first-time setup screen is completed.

**Request body:**
```json
{
  "name": "James Anderson"
}
```

---

### 6.3 Hotels

#### Get Hotel Details

```
GET /hotels/:id
```

Returns hotel information. Used to populate the concierge's hotel name and address.

**Response:**
```json
{
  "id": "uuid",
  "name": "The Grand Majestic Hotel",
  "address": "123 Luxury Ave",
  "city": "New York",
  "country": "US",
  "phone": "+12125550100",
  "timezone": "America/New_York"
}
```

---

### 6.4 Drivers

#### List Available Drivers

```
GET /drivers
```

Returns drivers available for assignment. Replaces the static `mockDrivers.ts` file.

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `hotelId` | string | — | Filter by hotel association |
| `status` | string | `online` | Filter by driver status |
| `verified` | boolean | `true` | Only verified drivers |
| `minRating` | number | `4.5` | Minimum rating |
| `maxDistance` | number | `5` | Max distance in miles from hotel |
| `hotelPreferred` | boolean | `false` | Only hotel-preferred drivers |
| `vipOnly` | boolean | `false` | Only VIP drivers |

**Response:**
```json
{
  "drivers": [
    {
      "id": "uuid",
      "name": "Michael Thompson",
      "phone": "+15550001001",
      "photo": "https://cdn.tuxedo.com/drivers/michael.jpg",
      "chauffeurId": "CH-001",
      "rating": 4.9,
      "experience": 8,
      "eta": 3,
      "distance": 0.8,
      "verified": true,
      "backgroundCheck": true,
      "hotelPreferred": true,
      "vipOnly": false,
      "languages": ["English", "Spanish"],
      "status": "online",
      "acceptanceRate": 98,
      "onTimeRate": 97,
      "vehicle": {
        "brand": "Mercedes-Benz",
        "model": "S-Class",
        "year": 2024,
        "plate": "***LUX24",
        "interior": "Nappa Leather",
        "color": "Obsidian Black"
      },
      "amenities": {
        "wifi": true,
        "music": true,
        "childSeat": false,
        "refreshments": true,
        "water": true,
        "charger": true,
        "luggage": 3,
        "wheelchair": false,
        "silentMode": true
      }
    }
  ],
  "total": 5
}
```

**Note:** Amenities are only included in the response for authenticated users with an active membership. Non-members receive `amenities: null`.

---

#### Get Driver Profile

```
GET /drivers/:id
```

Returns full profile for a single driver. Same shape as the list item above.

---

#### Update Driver Location (Driver App — future)

```
PUT /drivers/:id/location
```

**Request body:**
```json
{
  "lat": 40.7128,
  "lng": -74.0060,
  "etaMins": 3,
  "distanceMiles": 0.8
}
```

---

### 6.5 Rides

#### Create Ride

```
POST /rides
```

Creates a new ride record. Called when the concierge taps "Send Chauffeur Request" on the Guest Details screen.

**Request body:**
```json
{
  "guestPhone": "+15559876543",
  "guestEmail": null,
  "pickupLocation": "The Grand Majestic Hotel",
  "vehicleType": "luxury",
  "paymentType": "card",
  "bookingMode": "instant"
}
```

**What happens on the backend:**
1. Create ride record with status `creating`
2. Generate 8-character tracking token (uppercase alphanumeric, unique)
3. Build passenger tracking URL
4. Store token and URL on the ride record
5. Send SMS to guest with tracking link (via Twilio)
6. Create a `passenger_tracking_sessions` record
7. Return ride with token and link

**Response:**
```json
{
  "id": "uuid",
  "status": "creating",
  "trackingToken": "A3BX9KZM",
  "passengerLink": "https://passenger-webapp-lac.vercel.app/track-ride?token=A3BX9KZM&pickup=The%20Grand%20Majestic%20Hotel",
  "fare": 45.00,
  "commission": 6.75,
  "createdAt": "2025-05-04T14:30:00Z"
}
```

---

#### Assign Driver to Ride

```
POST /rides/:id/assign
```

Assigns a specific driver to the ride. Called after the concierge selects a driver.

**Request body:**
```json
{
  "driverId": "uuid",
  "paymentType": "card"
}
```

**What happens on the backend:**
1. Verify ride is in `creating` or `matching` status
2. Verify driver is `online` and not on another trip
3. Calculate fare based on payment type
4. Update ride: `driver_id`, `status = 'assigned'`, `assigned_at`, `fare`, `commission`
5. Update driver status to `on_trip`
6. Emit WebSocket event `ride:status_update` to the ride's room
7. Send push notification to concierge

**Response:**
```json
{
  "id": "uuid",
  "status": "assigned",
  "driver": { ... },
  "fare": 45.00,
  "commission": 6.75,
  "assignedAt": "2025-05-04T14:31:00Z"
}
```

---

#### Update Ride Status

```
PUT /rides/:id/status
```

Moves the ride through its lifecycle stages.

**Request body:**
```json
{
  "status": "arriving"
}
```

**Valid status transitions:**

```
creating → matching → assigned → arriving → onboard → enroute → completed
                                                                ↓
                                                            cancelled (from any active state)
```

**What happens on the backend:**
1. Validate the transition is allowed
2. Update ride status and the corresponding timestamp field
3. Emit WebSocket event `ride:status_update`
4. Send push/SMS notification to relevant parties

---

#### Complete Ride

```
POST /rides/:id/complete
```

Marks the ride as completed and triggers commission calculation.

**Request body:**
```json
{
  "cashConfirmed": false,
  "tip": 10.00,
  "addOns": []
}
```

**What happens on the backend:**
1. Update ride status to `completed`, set `completed_at`
2. Calculate final fare (base + tip)
3. Calculate commission (fare × 0.15)
4. Create a `commissions` record for the concierge
5. Update driver status back to `online`
6. Emit WebSocket event `ride:completed`

**Response:**
```json
{
  "id": "uuid",
  "status": "completed",
  "fare": 45.00,
  "tip": 10.00,
  "commission": 6.75,
  "completedAt": "2025-05-04T15:15:00Z"
}
```

---

#### Rate Driver

```
POST /rides/:id/rate
```

**Request body:**
```json
{
  "rating": 5
}
```

**What happens on the backend:**
1. Store rating on the ride record
2. Recalculate driver's average rating across all rated rides
3. Update `drivers.rating`

---

#### Get Ride History

```
GET /rides
```

Returns all rides created by the authenticated concierge.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `status` | string | Filter by status |
| `from` | date | Start date (ISO 8601) |
| `to` | date | End date (ISO 8601) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

**Response:**
```json
{
  "rides": [
    {
      "id": "uuid",
      "status": "completed",
      "fare": 45.00,
      "driver": { "name": "Michael Thompson" },
      "createdAt": "2025-05-04T14:30:00Z",
      "completedAt": "2025-05-04T15:15:00Z",
      "rating": 5
    }
  ],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

---

#### Get Single Ride

```
GET /rides/:id
```

Returns full details for a single ride including driver, guest info, and timeline.

---

### 6.6 Scheduled Bookings

#### Create Scheduled Ride

```
POST /rides
```

Same endpoint as instant rides. Pass `bookingMode: 'scheduled'` and `scheduledAt`.

**Request body:**
```json
{
  "guestPhone": "+15559876543",
  "pickupLocation": "The Grand Majestic Hotel",
  "paymentType": "card",
  "bookingMode": "scheduled",
  "scheduledAt": "2025-05-05T09:00:00Z",
  "chooseChauffeur": false,
  "driverId": null
}
```

**What happens on the backend:**
1. Create ride with status `scheduled`
2. If `chooseChauffeur = true` and `driverId` is provided, pre-assign the driver
3. Schedule a background job to trigger 30 minutes before `scheduledAt`:
   - Auto-assign best available driver (if not pre-assigned)
   - Send SMS to guest with tracking link
   - Update status to `assigned`
   - Notify concierge via push

---

### 6.7 Passenger Tracking

#### Get Tracking Session (Public — no auth required)

```
GET /tracking/:token
```

Used by the passenger web app to load ride details from the tracking link.

**Response:**
```json
{
  "token": "A3BX9KZM",
  "hotelName": "The Grand Majestic Hotel",
  "pickupLocation": "The Grand Majestic Hotel",
  "rideStatus": "arriving",
  "driver": {
    "name": "Michael T.",
    "vehicle": "Mercedes-Benz S-Class 2024",
    "eta": 3,
    "rating": 4.9
  },
  "isMembershipAvailable": true,
  "expiresAt": "2025-05-04T17:00:00Z"
}
```

**Notes:**
- Driver name is shown as first name + last initial only (privacy)
- Driver phone is never exposed on this endpoint
- `isMembershipAvailable` tells the passenger web whether to show the membership upsell

---

### 6.8 Commissions & Wallet

#### Get Commission Summary

```
GET /commissions/summary
```

Returns aggregated commission totals for the authenticated concierge.

**Response:**
```json
{
  "today": 142.50,
  "week": 856.00,
  "month": 3420.00,
  "totalRidesToday": 12,
  "weeklyGrowth": 15.0
}
```

---

#### Get Commission Transactions

```
GET /commissions
```

Returns individual commission records.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `from` | date | Start date |
| `to` | date | End date |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response:**
```json
{
  "commissions": [
    {
      "id": "uuid",
      "rideId": "uuid",
      "amount": 6.75,
      "date": "2025-05-04",
      "paidOut": false,
      "createdAt": "2025-05-04T15:15:00Z"
    }
  ],
  "total": 28,
  "page": 1
}
```

---

### 6.9 Membership & Payments

#### Get Membership Status

```
GET /memberships/me
```

Returns the current user's membership details.

**Response (active member):**
```json
{
  "status": "active",
  "plan": "gold_annual",
  "rideCredit": 100.00,
  "rideCreditUsed": 0.00,
  "rideCreditRemaining": 100.00,
  "startsAt": "2025-05-04T00:00:00Z",
  "expiresAt": "2026-05-04T00:00:00Z"
}
```

**Response (non-member):**
```json
{
  "status": null,
  "plan": null,
  "rideCredit": 0,
  "rideCreditRemaining": 0
}
```

---

#### Purchase Membership

```
POST /memberships
```

Initiates a membership purchase. Returns a Stripe payment intent client secret for the app to complete payment.

**Request body:**
```json
{
  "paymentMethod": "credit_card",
  "phone": "+15559876543",
  "email": "guest@example.com"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "amount": 100.00,
  "currency": "usd"
}
```

---

#### Confirm Membership Payment

```
POST /memberships/confirm
```

Called after Stripe payment is confirmed on the client side.

**Request body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "phone": "+15559876543",
  "email": "guest@example.com"
}
```

**What happens on the backend:**
1. Verify payment with Stripe API
2. Create `memberships` record with status `active`
3. Set `expires_at` to 1 year from now
4. Add $100 ride credit to the user (or store against phone/email if no account yet)
5. Generate coupon code `TUX100-XXXXXX`
6. Store coupon with status `pending_app_login`, linked to phone/email
7. Return coupon code and download prompt

**Response:**
```json
{
  "membership": {
    "status": "active",
    "rideCredit": 100.00,
    "expiresAt": "2026-05-04T00:00:00Z"
  },
  "coupon": {
    "code": "TUX100-A3BX9K",
    "amount": 100.00,
    "message": "Download the Tuxedo app to use your $100 ride credit"
  }
}
```

---

### 6.10 Coupons

#### Validate Coupon

```
POST /coupons/validate
```

Checks if a coupon code is valid and applicable.

**Request body:**
```json
{
  "code": "TUX100-A3BX9K"
}
```

**Response:**
```json
{
  "valid": true,
  "amount": 100.00,
  "campaign": "track-ride-download-popup",
  "status": "active"
}
```

---

#### Redeem Coupon

```
POST /coupons/redeem
```

Applies a coupon to a ride.

**Request body:**
```json
{
  "code": "TUX100-A3BX9K",
  "rideId": "uuid"
}
```

**What happens on the backend:**
1. Validate coupon is `active` and not expired
2. Verify coupon is linked to the authenticated user
3. Apply coupon amount to the ride fare
4. Mark coupon as `redeemed`
5. Update `redeemed_at` and `ride_id`

---

### 6.11 Notifications

#### Register Device Token

```
POST /notifications/device-token
```

Registers a push notification token for the current device.

**Request body:**
```json
{
  "token": "ExponentPushToken[xxx]",
  "platform": "ios",
  "deviceId": "device-hardware-id"
}
```

---

#### Get In-App Notifications

```
GET /notifications
```

Returns unread in-app notifications for the authenticated user.

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Driver Arriving",
      "body": "Michael T. is 2 minutes away",
      "data": { "rideId": "uuid" },
      "read": false,
      "createdAt": "2025-05-04T14:45:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

#### Mark Notification as Read

```
PUT /notifications/:id/read
```

---

## 7. Real-Time Events (WebSocket)

The backend uses Socket.IO. Clients connect with their JWT token and join rooms based on ride ID and user ID.

### Connection

```
ws://api.tuxedo.com/socket.io
Authorization: Bearer <JWT>
```

On connect, the server automatically joins the user to:
- Their personal room: `user:<userId>`
- Any active ride room: `ride:<rideId>`

---

### Events the Server Emits to Clients

#### ride:status_update

Fired whenever a ride's status changes. Sent to the `ride:<rideId>` room.

```json
{
  "event": "ride:status_update",
  "data": {
    "rideId": "uuid",
    "status": "arriving",
    "driver": {
      "name": "Michael T.",
      "eta": 2,
      "lat": 40.7128,
      "lng": -74.0060
    },
    "updatedAt": "2025-05-04T14:45:00Z"
  }
}
```

**Who receives it:**
- The concierge who created the ride
- The passenger web app (via tracking token room)

---

#### ride:driver_location

Fired every 10 seconds while a driver is on the way. Sent to the `ride:<rideId>` room.

```json
{
  "event": "ride:driver_location",
  "data": {
    "rideId": "uuid",
    "lat": 40.7128,
    "lng": -74.0060,
    "eta": 2,
    "heading": 180
  }
}
```

---

#### ride:completed

Fired when a ride is marked complete.

```json
{
  "event": "ride:completed",
  "data": {
    "rideId": "uuid",
    "fare": 45.00,
    "commission": 6.75,
    "completedAt": "2025-05-04T15:15:00Z"
  }
}
```

---

#### user:membership_updated

Fired when a user's membership status changes (e.g., after purchase or coupon activation).

```json
{
  "event": "user:membership_updated",
  "data": {
    "isMember": true,
    "rideCredit": 100.00,
    "expiresAt": "2026-05-04T00:00:00Z"
  }
}
```

---

#### notification:new

Fired when a new in-app notification is created for the user.

```json
{
  "event": "notification:new",
  "data": {
    "id": "uuid",
    "title": "Driver Arriving",
    "body": "Michael T. is 2 minutes away",
    "data": { "rideId": "uuid" }
  }
}
```

---

### Events the Client Sends to Server

#### join:ride

Join a ride room to receive updates. Called when the concierge navigates to the DriverETA or ActiveRide screen.

```json
{
  "event": "join:ride",
  "data": { "rideId": "uuid" }
}
```

#### join:tracking

Join a tracking room using a token. Called by the passenger web app.

```json
{
  "event": "join:tracking",
  "data": { "token": "A3BX9KZM" }
}
```

---

## 8. Business Logic Rules

### Fare Calculation

| Payment Type | Formula | Result |
|---|---|---|
| Card | `BASE_FARE` | $45.00 |
| Cash | `BASE_FARE × 1.20` | $54.00 |

Commission is always `fare × 0.15` regardless of payment type.

| Fare | Commission |
|---|---|
| $45.00 (card) | $6.75 |
| $54.00 (cash) | $8.10 |

Tips are added on top of the fare but do not affect commission.

---

### Ride Status Machine

A ride can only move forward through statuses. The only exception is `cancelled`, which can be triggered from any active state.

```
creating
  └─> matching (auto-assign flow started)
        └─> assigned (driver confirmed)
              └─> arriving (driver en route to pickup)
                    └─> onboard (guest in vehicle)
                          └─> enroute (heading to destination)
                                └─> completed

Any active state → cancelled
```

**Rules:**
- A ride cannot go back to a previous status
- Only one driver can be assigned to a ride at a time
- Completing a ride automatically creates a commission record
- Cancelling a ride sets the driver back to `online`

---

### Driver Assignment Rules

**Auto-match** selects the best available driver using this priority:
1. `hotel_preferred = true` drivers first
2. Highest rating
3. Lowest ETA (closest distance)
4. `verified = true` required
5. `status = 'online'` required

**Manual selection** allows the concierge to browse and pick any available driver. Filters default to `verified = true`, `minRating = 4.5`, `maxDistance = 5 miles`.

**VIP-only drivers** (`vip_only = true`) are only shown to users with an active membership.

---

### Membership Rules

- Price: $100/year
- On purchase: user receives $100 ride credit immediately
- Ride credit can be applied to any future ride
- Membership unlocks:
  - Driver amenities visibility
  - Advanced driver filters (hotel preferred, etc.)
  - VIP-only driver access
  - Coupon generation
- Membership expires exactly 1 year from purchase date
- Expired memberships lose all benefits but retain ride history

---

### Coupon Rules

- Format: `TUX100-XXXXXX` (6 random uppercase alphanumeric characters)
- Value: $100
- Campaign: `track-ride-download-popup`
- Lifecycle:
  1. `pending_app_login` — issued after membership purchase, waiting for app login
  2. `active` — activated when the linked phone/email logs into the app
  3. `redeemed` — applied to a ride
  4. `expired` — not used within the validity window
- One coupon per membership purchase
- Cannot be combined with other coupons

---

### Tracking Token Rules

- 8 characters, uppercase alphanumeric (e.g., `A3BX9KZM`)
- Generated server-side at ride creation
- Unique across all active tracking sessions
- Tracking session expires 2 hours after ride completion
- The passenger web URL format: `https://passenger-webapp-lac.vercel.app/track-ride?token=<TOKEN>&pickup=<HOTEL_NAME>`

---

### OTP Rules

- 6 digits
- Expires in 5 minutes
- Maximum 5 verification attempts before lockout
- Maximum 3 OTP sends per phone per 10-minute window
- Demo accounts in development: `+15551000001` (concierge), `+15552000002` (manager), OTP `123456`

---

### Commission Payout Rules

- Commissions are calculated per completed ride
- Commissions are marked `paid_out = false` until processed
- Payout is a manual or scheduled batch process (not triggered by the app)
- Commission records are tied to the concierge user, the ride, and the hotel

---

## 9. Security & Authentication

### JWT Strategy

- Access token: 15-minute expiry, signed with RS256
- Refresh token: 30-day expiry, stored as SHA-256 hash in the database
- On refresh: old token is revoked, new pair issued
- On logout: refresh token is revoked immediately

### Device Binding

- On first login, the device ID and device name are stored on the user record
- Subsequent logins from a different device ID trigger a re-verification flow
- This prevents account sharing across devices

### Role-Based Access Control

| Endpoint | Concierge | Manager |
|---|---|---|
| Create ride | ✓ | ✓ |
| View own commissions | ✓ | ✓ |
| View all hotel commissions | ✗ | ✓ |
| View all hotel rides | ✗ | ✓ |
| Manage drivers | ✗ | ✓ |
| View hotel analytics | ✗ | ✓ |

### Passenger Tracking (Public Endpoint)

- `GET /tracking/:token` requires no authentication
- Only exposes: ride status, driver first name + last initial, vehicle make/model, ETA
- Never exposes: driver phone, guest contact details, full driver name, fare

### Rate Limiting

| Endpoint | Limit |
|---|---|
| `POST /auth/otp/send` | 3 per phone per 10 minutes |
| `POST /auth/otp/verify` | 5 attempts per OTP |
| All other endpoints | 100 requests per minute per user |

---

## 10. Third-Party Integrations

### Twilio (SMS)

Used for:
- OTP delivery to concierge/manager phones
- Passenger tracking link delivery to guest phones

**When SMS is sent:**
1. OTP requested → send 6-digit code
2. Ride created with guest phone → send tracking link
3. Scheduled ride 30 minutes before pickup → send tracking link reminder

---

### Stripe (Payments)

Used for:
- Membership subscription payments ($100/year)
- Future: ride payment processing

**Flow:**
1. Backend creates a PaymentIntent via Stripe API
2. Returns `client_secret` to the app
3. App completes payment using Stripe SDK (Apple Pay or card)
4. App sends `paymentIntentId` to backend to confirm
5. Backend verifies with Stripe and activates membership

---

### Firebase (Push Notifications)

Used for:
- Ride status updates to the concierge app
- Driver assignment confirmations
- Scheduled ride reminders

**Platforms:** APNs (iOS) via Firebase, FCM (Android)

**Notification triggers:**

| Event | Recipient | Message |
|---|---|---|
| Driver assigned | Concierge | "Michael T. is on the way — ETA 3 min" |
| Driver arriving | Concierge | "Your chauffeur is arriving now" |
| Ride completed | Concierge | "Ride complete — $6.75 commission earned" |
| Scheduled ride reminder | Concierge | "Scheduled ride in 30 minutes" |
| Membership activated | User | "Welcome to Gold — $100 credit added" |

---

### Google Maps API

Used for:
- Calculating real-time ETA from driver location to hotel
- Calculating distance in miles
- Geocoding hotel addresses

---

## 11. Error Codes Reference

All errors follow this format:

```json
{
  "error": {
    "code": "OTP_EXPIRED",
    "message": "The OTP has expired. Please request a new one.",
    "statusCode": 400
  }
}
```

### Authentication Errors

| Code | HTTP | Description |
|---|---|---|
| `OTP_EXPIRED` | 400 | OTP has passed its 5-minute window |
| `OTP_INVALID` | 400 | Wrong OTP code entered |
| `OTP_MAX_ATTEMPTS` | 429 | 5 failed attempts — account locked |
| `OTP_RATE_LIMIT` | 429 | Too many OTP requests for this phone |
| `TOKEN_EXPIRED` | 401 | JWT access token has expired |
| `TOKEN_INVALID` | 401 | JWT is malformed or signature invalid |
| `REFRESH_TOKEN_REVOKED` | 401 | Refresh token has been revoked |
| `DEVICE_MISMATCH` | 403 | Login from unrecognized device |

### Ride Errors

| Code | HTTP | Description |
|---|---|---|
| `RIDE_NOT_FOUND` | 404 | Ride ID does not exist |
| `RIDE_INVALID_STATUS` | 400 | Status transition is not allowed |
| `RIDE_ALREADY_ASSIGNED` | 409 | Ride already has a driver assigned |
| `DRIVER_UNAVAILABLE` | 409 | Driver is not online or already on a trip |
| `DRIVER_NOT_FOUND` | 404 | Driver ID does not exist |

### Membership & Payment Errors

| Code | HTTP | Description |
|---|---|---|
| `MEMBERSHIP_ALREADY_ACTIVE` | 409 | User already has an active membership |
| `PAYMENT_FAILED` | 402 | Stripe payment was declined |
| `PAYMENT_NOT_FOUND` | 404 | PaymentIntent ID not found in Stripe |

### Coupon Errors

| Code | HTTP | Description |
|---|---|---|
| `COUPON_NOT_FOUND` | 404 | Coupon code does not exist |
| `COUPON_ALREADY_REDEEMED` | 409 | Coupon has already been used |
| `COUPON_EXPIRED` | 400 | Coupon is past its expiry date |
| `COUPON_WRONG_USER` | 403 | Coupon is linked to a different account |

### Tracking Errors

| Code | HTTP | Description |
|---|---|---|
| `TRACKING_TOKEN_NOT_FOUND` | 404 | Token does not match any active session |
| `TRACKING_SESSION_EXPIRED` | 410 | Tracking session has expired |

### General Errors

| Code | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `UNAUTHORIZED` | 401 | No valid auth token provided |
| `FORBIDDEN` | 403 | Authenticated but not permitted |
| `NOT_FOUND` | 404 | Resource does not exist |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
