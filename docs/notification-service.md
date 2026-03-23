# Order Status Notification Service

## Overview

The notification service automatically sends email notifications to customers whenever their order status changes. This keeps customers informed about their order progress in real-time.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORDER STATUS NOTIFICATION FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   Customer   │
                              │ Places Order │
                              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   INITIATED  │
                              │   (Default)  │
                              └──────┬───────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│  ADMIN PORTAL   │        │ EMPLOYEE PORTAL │        │  ADMIN PORTAL   │
│                 │        │                 │        │                 │
│ Assigns Employee│        │ Updates Status  │        │ Updates Status  │
│ to Order Item   │        │ on Assigned Task│        │   Directly      │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│   PROCESSING    │        │   IN_PROGRESS   │        │   COMPLETED /   │
│                 │        │                 │        │   CANCELLED     │
│  📧 Email Sent  │        │  📧 Email Sent  │        │  📧 Email Sent  │
└─────────────────┘        └─────────────────┘        └─────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           EMAIL SENDING PROCESS                              │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │   Status    │     │   Fetch     │     │  Generate   │     │    Send     │
  │   Changed   │────▶│  Customer   │────▶│    HTML     │────▶│   Email     │
  │             │     │   Email     │     │  Template   │     │   (SMTP)    │
  └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                            │                    │
                            ▼                    ▼
                      ┌───────────┐        ┌───────────┐
                      │ auth.users│        │  Status   │
                      │ + profiles│        │  Config   │
                      └───────────┘        │ (colors,  │
                                           │  emoji,   │
                                           │  message) │
                                           └───────────┘
```

---

## Status Types & Email Content

| Status | Emoji | Color | Message |
|--------|-------|-------|---------|
| `initiated` | 📋 | Gray | Order received, awaiting processing |
| `processing` | ⚙️ | Yellow | Team has started working on order |
| `in_progress` | 🔨 | Blue | Order is actively being worked on |
| `completed` | ✅ | Green | Order completed, deliverables ready |
| `cancelled` | ❌ | Red | Order has been cancelled |

---

## Trigger Points

### 1. Admin Assigns Employee
```
assignEmployeeToOrderItem() → sends "Processing" email
```

### 2. Employee Updates Status
```
updateOrderItemStatus() → sends email for new status
```

### 3. Admin Updates Status Directly
```
updateOrderItemStatusAdmin() → sends email for new status
```

---

## File Structure

```
src/modules/email/
├── send-invoice.ts              # Payment confirmation emails
└── send-status-notification.ts  # Order status update emails

src/modules/admin/
└── actions.ts                   # Admin actions (assign, update status)

src/modules/employee/
└── actions.ts                   # Employee actions (update status)
```

---

## Environment Variables

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_SITE_URL=https://shareden.com
```

---

## Email Template Features

- ✅ Branded header with Shareden logo styling
- ✅ Status badge with color coding
- ✅ Order details (stack name, order ID, date)
- ✅ Progress bar visualization
- ✅ Assigned employee name
- ✅ Admin notes (when provided)
- ✅ CTA button to view order in dashboard
- ✅ Mobile responsive design
