# FixIt Repairs – Appliance Repair Management Portal

A CSE 326 front-end project made with HTML, CSS and JavaScript. It demonstrates a repair workflow with separate customer, technician and administrator dashboards.

## Features

### Customer
- Sign in and submit a repair request.
- Enter appliance, preferred date, address and problem.
- View submitted requests, assigned technician and current status.

### Administrator
- View all customer requests.
- Assign each request to a technician.
- Change status: Pending, Assigned, In Progress, Completed or Cancelled.

### Technician
- View jobs assigned to their account.
- Update a job to Assigned, In Progress or Completed.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Administrator | admin@fixit.com | admin123 |
| Technician 1 | tech@fixit.com | tech123 |
| Technician 2 | meera@fixit.com | tech123 |
| Customer | user@fixit.com | user123 |

## Project files
- `index.html` – structure and login screen
- `style.css` – layout, colours and responsive styling
- `script.js` – demo login, request booking, assignment and status updates
- `README.md` – project details

## Run the project
1. Keep all four files in the same folder.
2. Open `index.html` in a browser.
3. Sign in as a customer and submit a test repair request.
4. Log in as admin in the same browser and assign a technician.
5. Log in as that technician and update the job status.
6. Return to the customer account to view the updated status.

## Data storage and project limitation
This version saves requests in the browser's `localStorage`. The data remains after a refresh and can be viewed by the different demo roles **in the same browser on the same device**.

This is a front-end demonstration, not a production multi-user service. A customer using a phone will not automatically share data with an admin using a different laptop. Real shared accounts and cross-device updates need a backend server and database. The demo passwords are visible in the JavaScript file and are not secure.

## Technologies
HTML5 · CSS3 · JavaScript · Browser localStorage
