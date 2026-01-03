Phase 1: The "Handshake" (First 15 Minutes)
DO NOT CODE YET. Do this immediately to prevent conflicts later.

Repo Setup: One person initializes the repo with the base framework (Flutter/React Native) and pushes to main.

Agree on the Model: You must agree on the Expense object structure exactly. If this changes later, everyone's code breaks.

Suggested Model: id (int/String), title (String), amount (double), date (DateTime/String), category (String).

Create Empty Files: Create the files for the screens (AddExpenseScreen, HomeScreen, StatsScreen) and the database helper (DatabaseHelper) so everyone has a place to work without creating file-name conflicts.

Phase 2: Role Distribution (Next 1.5 Hours)
👤 Member A (You - The Data & Logic Architect)
Why you: Your background in SQL/PLSQL makes you the best fit to ensure the SQLite requirement (20% of the grade + stability) is rock solid.

Primary Task: Build the DatabaseHelper class (Singleton pattern).

Key Deliverables:

Initialize SQLite DB.

Write CRUD methods: insertExpense, getExpenses (ordered by date), deleteExpense, updateExpense.

Write getBudget and setBudget methods (store budget in a simple key-value table or SharedPreferences if allowed, otherwise a separate table).

Crucial: Create a "State Manager" (Provider/Context/Controller) that calls these DB methods and exposes the list of expenses to the UI.

👤 Member B (The Input Specialist)
Focus: Data Entry, Validation, and List Rendering.

Primary Task: Build the Add/Edit Expense Screen and the Expense List Tile.

Key Deliverables:

Form: Inputs for Title, Amount (numeric keyboard), Date Picker, and Category Dropdown.

Validation: Prevent empty titles and negative numbers (Required by prompt).

UI Component: The generic "Expense Tile" used in the list (shows Title, Amount, Date, Category Icon).

Delete Logic: Add the "Swipe to Delete" or "Long press to delete" with a confirmation dialog.

👤 Member C (The Dashboard & Visuals)
Focus: Home Screen, Budget Logic, and Summaries.

Primary Task: Build the Home Screen and visual feedback.

Key Deliverables:

Header: Display "Total Budget", "Spent", and "Remaining".

Logic: Implement the "Overspending Indicator" (e.g., if spent > budget, turn the card red or show a warning icon).

Category Summary: A simple list or grid showing total spent per category (e.g., Food: $50, Transport: $20).

Mock Data: Important: Member C should write their UI using hardcoded dummy data list initially. Do not wait for Member A to finish the DB.

Phase 3: Integration & Polish (Final 45 Minutes)
Merge & Connect:

Member B and C replace their "dummy data" or "print statements" with calls to Member A’s State Manager/Database methods.

The "Live Demo" Checklist (Test these specifically):

Add an item. Does it appear?

Restart the app. Is the item still there? (SQLite check).

Set a budget of $100. Add an expense of $101. Does it turn red? (Overspending check).

Readme: While B and C are debugging, Member A writes the README.md (Language used, instructions).

⚠️ Git Workflow for Speed
Since you only have 2.5 hours, do not use a complex Git Flow. Use "Feature Branch Workflow":

Member A: working on feature/database

Member B: working on feature/input-ui

Member C: working on feature/dashboard

Rule: When you finish a distinct chunk (e.g., the database helper is working), merge it into main so others can pull it. Communicate verbally: "I am pushing the Database Helper now, pull the changes."

Immediate Technical Recommendations
Category Icons: Don't waste time finding custom icons. Use standard system icons (e.g., Icons.fastfood for Food, Icons.school for Education).

State Management: Use the simplest solution you know.

Flutter: Provider or ChangeNotifier.

React Native: Context API.

Android/Kotlin: ViewModel + LiveData.

Bonus Features: Ignore them until the core functionality (CRUD + Offline Persistance) is working perfectly. If you have 20 mins left, Member C can add a Pie Chart library.