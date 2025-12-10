# Inventory Management 
This project is an inventory management service built using the **M**ongoDB, **E**xpress, **R**eact, **N**ode.js (MERN) stack. It handles product creation, real-time stock level updates, and transaction history logging.

# Tech Stack  

**Frontend**  
•	React 18 - UI library  
•	Vite - Build tool and dev server  
•	Axios - HTTP client    

**Backend**  
•	Node.js - Runtime environment  
•	Express - Web framework  
•	MongoDB - Database  
•	Mongoose - ODM  

# Prerequisites  
Before you begin, ensure you have the following installed:  
•	Node.js (v14 or higher) - Download  
•	MongoDB (v4.4 or higher) - Download  
•	npm or yarn - Comes with Node.js  
•	Git (optional) - For cloning the repository  

**Check installations:**  
node --version   # Should show v14.0.0 or higher  
npm --version    # Should show 6.0.0 or higher  
mongod --version # Should show MongoDB version  

# Installation & Setup  

# 1. Clone or Download the Project  
**Using Git**  
git clone https://github.com/Devsama007/Inventory-Management
cd inventory

# 2. Backend Setup  

### Step 1: Install Dependencies
cd Backend  
npm install  

### Step 2: Create Environment File
Create a .env file in the Backend directory:  

# Backend/.env  

PORT=5000  
MONGODB_URI=mongodb://localhost:27017/inventory-management

**Important: Change MongoDB URI with actual link.**

### Step 3: Start MongoDB 

Windows:  
Open Command Prompt as Administrator  
Mongod  

macOS:  
brew services start mongodb-community  

Verify MongoDB is running:  
mongosh  
Should connect successfully  
Type 'exit' to quit  

### Step 4: Start Backend Server
In Backend directory  
Navigate to the Backend Directory:
cd Backend
Node server.js  

You should see:  
Server running on port 5000  
MongoDB connected  

# 3. Frontend Setup  

### Step 1: Open New Terminal  
Keep the backend server running and open a new terminal window.  

### Step 2: Install Dependencies  
cd Frontend  
npm install  

### Step 3: Start Frontend Development Server  
npm run dev  

You should see:  
VITE v5.x.x ready in xxx ms  
➜  Local:   http://localhost:5173/  
➜  Network: use --host to expose  

# 4. Access the Application  
Open your browser and navigate to:  
Click the terminal link  


# API Endpoints Usage
The API endpoints are served from the base URL: **`http://localhost:5000/api/products`**.

# 1. Create Product
•	**Method:** POST  
•	**Endpoint:** /api/products 
•	**Requirements:** sku must be unique 

```json raw body
{
  "name": "MacBook Air",
  "sku": "MB1",
  "initialStock": 15
}
```

# 2. Increase Stock
•	**Method:** POST 
•	**Endpoint:** /api/products/:id/increase  
•	**Requirements:** quantity must be > 0.   

```header
Content-Type: application/json
```

```json raw body
{
  "quantity": 5
}
```

# 3. Decrease Stock
•	**Method:** POST 
•	**Endpoint:** /api/products/:id/decrease 
•	**Requirements:** quantity must be > 0.   

```header
Content-Type: application/json
```

```json raw body
{
  "quantity": 3
}
```

# 4. View Product Summary
•	**Method:** GET 
•	**Endpoint:** /api/products/:id  
•	**Returns:** Product details, current stock, total units increased (including initial), and total units decreased.   

# 5. View Transaction History
•	**Method:** GET  
•	**Endpoint:** /api/products/:id/transactions  
•	**Returns:** A list of all stock movements (types: INITIAL, INCREASE, DECREASE), sorted by timestamp.
