link to preview  = smart-map-five.vercel.app

# 📄 SmartMap Project Documentation 

 🧠 1. Project Title

SmartMap: A Gamified, AI-Powered Location Verification and Intelligent Search System Using RAG

 📌 2. Introduction

SmartMap is a **location-based web application** that enables users to discover, verify, and navigate real-world services such as game zones, restaurants, and clinics.

The system integrates:

* Interactive mapping using OpenStreetMap
* Routing using Open Source Routing Machine
* AI-based verification models
* **RAG (Retrieval-Augmented Generation)** for intelligent search
* Gamification to enhance user engagement

The goal is to provide **accurate, trustworthy, and intelligent location services** by combining multiple data sources with AI.

## 🚀 Quick Start & How to Run

To run this project locally, you will need to start three services: Backend, Frontend, and ML Engine.

### 1. Setup Environment Variables
Copy the `.env.example` file to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in the required fields (especially `DATABASE_URL` and `GEMINI_API_KEY`).

### 2. Run the Backend (Node.js)
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
*Runs on Port 5002.*

### 3. Run the ML Engine (Python)
```bash
cd ml-engineering
pip install -r requirements.txt
python main.py
```
*Runs on Port 5001.*

### 4. Run the Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
*Runs on Port 5173 (or similar).*


🎯 3. Objectives

### General Objective:

To develop a **smart, reliable, and AI-driven mapping system**.

### Specific Objectives:

* Enable natural language search (e.g., “Is there a game zone near me?”)
* Integrate multiple map data sources
* Implement RAG for intelligent responses
* Verify location authenticity using AI
* Provide real-time navigation
* Encourage user participation through gamification



# ⚙️ 4. Technologies Used

## Frontend:

* React.js


## Backend:

* Node.js 

## Map & Routing:

* OpenStreetMap
* Open Source Routing Machine

## Database:

* PostgreSQL with PostGIS

## AI / RAG:

* TensorFlow
* OpenCV
* RAG architecture (Retriever + Generator)



# 🏗️ 5. System Architecture

SmartMap follows a multi-layered architecture**:

* **Frontend Layer:** User interface and map interaction
* **Backend Layer:** API handling and business logic
* **Database Layer:** Stores spatial and user data
* **AI & RAG Layer:** Handles verification and intelligent responses
* **Map Services Layer:** Provides map visualization and routing

---

# 🤖 6. RAG-Based Intelligent Search System

## 📌 Overview

The system uses **Retrieval-Augmented Generation (RAG)** to provide intelligent answers to user queries by combining real-time data retrieval with AI-generated responses.

---

## 🔄 RAG Workflow

### Step 1: User Query

User inputs:

> “Is there a game zone near Bole?”

---

### Step 2: Query Processing

* Extract intent (category: game zone)
* Extract location (Bole)

---

### Step 3: Data Retrieval

The system retrieves data from:

* Internal database (verified user data)
* External services such as:

osm
overpass 

### Step 4: Data Fusion & Ranking

* Merge results from all sources
* Rank based on:

  * Distance
  * Rating
  * Verification score

---

### Step 5: Response Generation

AI generates a human-readable response:

> “There are 4 game zones near Bole. The closest is X (0.6 km) and is highly rated and verified.”

---

### Step 6: Result Presentation

* Display results on map (markers)
* Show AI-generated summary

---

# 🧠 7. AI-Based Location Verification

To ensure reliability, the system includes:

### ✅ Crowd Consensus Model

* Multiple confirmations increase trust

### ✅ Image Verification Model

* Uses AI to validate uploaded images

### ✅ Geo-Consistency Model

* Ensures logical placement of locations

### ✅ User Trust Model

* Tracks user credibility

---

## ⭐ Trust Score Formula

```text
Trust Score =
(User Reputation × 0.3) +
(Crowd Agreement × 0.3) +
(Image Confidence × 0.2) +
(Geo Validity × 0.2)
```

---

# 🔄 8. System Workflows

## 🔍 Search Flow (RAG-Based):

1. User enters query
2. Backend processes query
3. RAG retrieves data from multiple sources
4. AI generates response
5. Results displayed on map

---

## ➕ Add Location Flow:

1. User selects location
2. Submits details and image
3. Backend stores data
4. AI verifies authenticity
5. Assigns trust score

---

## 🧭 Navigation Flow:

1. User selects destination
2. Routing handled by Open Source Routing Machine
3. Directions displayed on map

---

# 🗄️ 9. Database Design 

### Users:

* id
* name
* reputation_score

### Locations:

* id
* name
* category
* coordinates
* verification_score
* status

### Reviews:

* id
* user_id
* location_id
* rating

---

# 🎮 10. Gamification Features

* Earn points for adding/validating locations
* Rewards (coins, leaderboard)
* Penalties for fake submissions

---

# 🔐 11. Security Considerations

* Authentication (JWT)
* Input validation
* Spam detection
* Image moderation

---

# 📊 12. Advantages

* Intelligent search using RAG
* Improved data accuracy
* Multi-source data integration
* Engaging gamified experience


# 🎯 13. Conclusion

SmartMap is an advanced mapping system that integrates **RAG-based intelligent search, AI verification, and gamification** to provide accurate and engaging location services. By combining multiple data sources with AI-generated insights, the system significantly improves the reliability and usability of map-based applications.

---
Here is the Live app: https://smart-map-dltg.vercel.app/

