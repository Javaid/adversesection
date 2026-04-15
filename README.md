# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Functional Requirements

### Workflow & Case Management

Adverse records must be managed as cases (with lifecycle, ownership, and auditability), not as flat data entries.

#### Workflow States

Each adverse case must support the following states:

- Reported
- Under Review
- Investigation
- Action Required
- Resolved / Closed

#### Functional Requirements

1. Case Lifecycle
- The system must create every adverse record as a case with a unique case ID.
- The system must allow state transitions across the defined workflow states.
- The system should capture state transition timestamp, actor, and optional reason.

2. Assignment
- The system must allow assignment of a case to a reviewer or investigator.
- The system must support reassignment and preserve assignment history.

3. SLA Tracking
- The system must support SLA policies per workflow stage.
- Example SLA: cases in Reported must be moved to Under Review within 7 calendar days.
- The system must display SLA due date, remaining time, and breach status.

4. Comments and Internal Notes
- The system must support comments/internal notes on each case.
- Notes must include author and timestamp.
- Notes must be visible only to authorized internal users.

5. Escalation Rules
- The system must support configurable escalation rules based on SLA thresholds and case severity.
- The system must notify configured users/roles when escalation conditions are met.
- Escalation events must be logged in the case audit trail.

#### Backend API Acceptance Criteria

1. Create Case
- Endpoint: POST /api/cases
- Must create a new case with status Reported by default.
- Must generate and return a unique case identifier.
- Must return HTTP 201 on success with created case payload.

2. Get Case Details
- Endpoint: GET /api/cases/{caseId}
- Must return case metadata, current status, assignee, SLA fields, and recent activity.
- Must return HTTP 404 when the case does not exist.

3. List and Filter Cases
- Endpoint: GET /api/cases
- Must support filtering by status, assignee, severity, SLA breach, and created date range.
- Must support pagination (page, limit) and deterministic sorting.

4. Update Case Status
- Endpoint: PATCH /api/cases/{caseId}/status
- Must only allow valid workflow transitions.
- Must reject invalid transitions with HTTP 400 and reason.
- Must store transition reason, actor, and timestamp in history.

5. Assign or Reassign Case
- Endpoint: PATCH /api/cases/{caseId}/assignee
- Must assign to a valid internal user ID.
- Must preserve assignment history.
- Must return HTTP 409 if assignment conflicts with a closed case policy.

6. Add Internal Note
- Endpoint: POST /api/cases/{caseId}/notes
- Must create an internal note with author and timestamp.
- Must enforce role-based access so unauthorized users cannot read/write internal notes.

7. SLA and Escalation Evaluation
- Endpoint: GET /api/cases/{caseId}/sla
- Must return SLA due date, remaining time, and breach status.
- System job or worker must evaluate escalation rules and create escalation events.

8. Audit Trail
- Endpoint: GET /api/cases/{caseId}/history
- Must return immutable event history (status changes, assignments, escalations, notes metadata).

#### Database Field Requirements

1. cases table (core)
- id (UUID or BIGINT, primary key)
- case_number (VARCHAR, unique, human-readable)
- adverse_record_id (FK, nullable only if case is stand-alone)
- title (VARCHAR)
- description (TEXT)
- status (ENUM: Reported, Under Review, Investigation, Action Required, Resolved, Closed)
- severity (ENUM: Low, Medium, High, Critical)
- assigned_to (FK -> users.id, nullable)
- reported_by (FK -> users.id)
- reported_at (DATETIME, required)
- due_review_at (DATETIME, SLA target for initial review)
- resolved_at (DATETIME, nullable)
- closed_at (DATETIME, nullable)
- is_sla_breached (BOOLEAN, default false)
- escalation_level (INT, default 0)
- created_at (DATETIME)
- updated_at (DATETIME)

2. case_status_history table
- id (PK)
- case_id (FK -> cases.id)
- from_status (VARCHAR)
- to_status (VARCHAR)
- changed_by (FK -> users.id)
- reason (TEXT, nullable)
- changed_at (DATETIME)

3. case_assignments table
- id (PK)
- case_id (FK -> cases.id)
- assigned_to (FK -> users.id)
- assigned_by (FK -> users.id)
- assigned_at (DATETIME)
- unassigned_at (DATETIME, nullable)

4. case_notes table
- id (PK)
- case_id (FK -> cases.id)
- note_body (TEXT)
- is_internal (BOOLEAN, default true)
- created_by (FK -> users.id)
- created_at (DATETIME)

5. case_escalations table
- id (PK)
- case_id (FK -> cases.id)
- rule_name (VARCHAR)
- trigger_type (VARCHAR, e.g., SLA_BREACH, SEVERITY_CHANGE)
- escalated_to_role (VARCHAR)
- escalated_to_user_id (FK -> users.id, nullable)
- escalation_level (INT)
- triggered_at (DATETIME)
- resolved_at (DATETIME, nullable)

6. Indexing and Constraints
- Unique index on case_number.
- Composite index on (status, assigned_to, is_sla_breached).
- Index on due_review_at for SLA scans.
- Foreign keys must use ON UPDATE CASCADE and explicit ON DELETE behavior aligned to retention policy.
