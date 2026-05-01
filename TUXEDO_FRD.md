# TUXEDO CONCIERGE — Functional Requirements Document (FRD)

**Document Type:** Functional Requirements Document
**Application:** Tuxedo Concierge — Luxury Ride Management Mobile App
**Platform:** React Native (Expo) — iOS & Android
**Version:** 1.0

---

## Single-Screen Flow Overview

```
LOGIN
  └─> HOME (Dashboard)
        ├─> GUEST DETAILS ──> WAITING FOR PAYMENT ──> HOME
        ├─> SCHEDULE BOOKING ──> WAITING FOR PAYMENT ──> HOME
        ├─> DRIVER ASSIGNMENT MODE
        │     ├─> DRIVER MATCHING (Auto) ──────────────────────────┐
        │     ├─> DRIVER LIST ──> DRIVER PROFILE ──> DRIVER CONFIRM─┤
        │     └─> DRIVER SWIPE ──> DRIVER PROFILE ──> DRIVER CONFIRM┤
        │                                                            ↓
        │                                                     DRIVER ETA
        │                                                          ↓
        │                                                    ACTIVE RIDE
        │                                                          ↓
        │                                                  RIDE COMPLETION
        │                                                          ↓
        │                                                        HOME
        ├─> PROFILE ──> LOGIN (logout)
        ├─> COMMISSION WALLET
        ├─> RIDE HISTORY
        ├─> TRACK RIDE (Passenger)
        │     ├─> MEMBERSHIP ──> MEMBERSHIP PAYMENT ──> DRIVER LIST ──> TRACK RIDE
        │     └─> (skip) ──> TRACK RIDE (tracking step)
        ├─> MEMBERSHIP ──> MEMBERSHIP PAYMENT ──> DRIVER LIST
        └─> MEMBERSHIP PAYMENT ──> DRIVER LIST
```

---
