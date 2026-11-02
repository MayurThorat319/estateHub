# Dynamic EstateHub dashboard update

## What is live
- Recent Activities uses records in MongoDB. Adding, editing or deleting a property creates a logged event. Filters: All / Property changes / Transactions; newest/oldest sorting.
- Top Agent ranks agents by the total transaction amount recorded explicitly with the Agent workspace form, with separate completed sale and rent counts. Listing creation does NOT count as a transaction.
- Calendar popup adds and cancels dated appointments, persisted to MongoDB. Date filter displays scheduled appointments.
- Notifications are generated when a property is added, an inquiry arrives or its status changes, a transaction is recorded, or an appointment is scheduled/cancelled. Mark all as read is persistent. This is in-app event logging, not push notifications or scheduled reminders.

## Notes
- Old seed activities are labelled Legacy record and do not affect agent rankings. Existing agents' legacy manually entered `sales`, `rent`, `amount` fields are intentionally ignored for rankings.
- The app requires a running local MongoDB and backend. Run `npm install` and `npm run dev` from the root.
- No real transactions are inferred from newly added listings. Use Agent -> Record completed sale / rental.
- There is no authentication, multi-user access policy, push notification service, external calendar sync or real-time WebSocket delivery yet.
- Database actions are not wrapped in MongoDB transactions; in the rare event a related notification fails, a write may be persisted even when the request errors.
