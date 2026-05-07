# Auth-Gated App Testing Playbook (Memento)

Use this as the playbook when testing Emergent Google Auth flows in this app.

## Set up test user & session manually
```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Test backend
```bash
# /api/auth/me should return user data with valid session_token
curl -X GET "$REACT_APP_BACKEND_URL/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# /api/trips should return user's trips (or empty list)
curl -X GET "$REACT_APP_BACKEND_URL/api/trips" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# /api/trips/generate should generate a new trip
curl -X POST "$REACT_APP_BACKEND_URL/api/trips/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"intake": {"destination": "Lisbon, Portugal", "dates": "Apr 12-16, 2026", "group": "2 adults", "travelerType": ["Food Lover"], "tripType": "City Break", "budget": "$2,500"}}'
```

## Browser testing (Playwright)
```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "your-app.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None"
}])
await page.goto("https://your-app.com/trips")
```

## Endpoint inventory
- `POST /api/auth/session` — exchange Emergent session_id for cookie session (body: `{session_id, guest_session_id?}`)
- `GET /api/auth/me` — current user (requires session)
- `POST /api/auth/logout` — clear session
- `POST /api/auth/claim-guest` — claim guest trips (requires session, body: `{guest_session_id}`)
- `POST /api/trips/generate` — generate itinerary (body: `{intake, guest_session_id?}`)
- `GET /api/trips` — list user/guest trips (`?guest_session_id=` if not authed)
- `GET /api/trips/:id` — get one trip (with same guest fallback)
- `DELETE /api/trips/:id`

## Guest claim flow
- Frontend stores `memento_guest_session_id` in localStorage
- All anon `POST /api/trips/generate` and `GET /api/trips` calls include this id
- On `POST /api/auth/session` (after Google auth), backend updates trips matching `guest_session_id` to set `user_id`

## Quick debug
```bash
mongosh --eval "
use('test_database');
db.users.find().limit(2).pretty();
db.user_sessions.find().limit(2).pretty();
db.trips.find().limit(2).pretty();
"
```
