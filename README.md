# 🚀 DAG FlowNet

Welcome to the **DAG FlowNet**! Built on **Node.js** and **Express**, and powered by **MongoDB**.

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 📋 Table of Contents
- [✨ Features](#-features)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#-configuration)
- [📡 API Endpoints](#api-endpoints)
  - [🔗 Node Endpoints](#node-endpoints)
  - [🔗 Edge Endpoints](#edge-endpoints)
  - [🔗 Graph Endpoints](#graph-endpoints)
  - [🔗 Graph Execution Endpoints](#graph-execution-endpoints)
- [🛠 Helper Functions](#helper-functions)
- [⚠️ Error Handling](#error-handling)
- [📄 License](#license)

## ✨ Features
- Create and manage **nodes** and **edges** with ease.
- Validate graphs to ensure no cycles or islands exist.
- Execute graphs in a topological order based on custom configurations.
- Built with a focus on extensibility and performance.

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anushka81/DAG-FLowNet.git
   cd graph-processing-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB connection:**
   Update the `mongoURI` variable in `server.js` with your MongoDB connection string.

4. **Start the server:**
   ```bash
   node server.js
   ```
   Your server will be live at `http://localhost:5000`! 🎉

## ⚙️ API Endpoints

### 🔗 Node Endpoints
- **POST /nodes**: Create a new node.
- **GET /nodes**: Retrieve all nodes.
- **GET /nodes/:id**: Get a specific node by its ID.
- **PUT /nodes/:id**: Update a specific node by its ID.
- **DELETE /nodes/:id**: Remove a node by its ID.

### 🔗 Edge Endpoints
- **POST /edges**: Create a new edge.
- **GET /edges**: Retrieve all edges.

### 🔗 Graph Endpoints
- **POST /graphs**: Create or update a new graph.
- **GET /graphs**: Retrieve all graphs.
- **DELETE /graphs/:id**: Delete a graph by its ID.

### 🔗 Graph Execution Endpoints
- **POST /validate-graph/:id**: Validate the structure and integrity of a graph, checking for cycles, islands, and more.
- **POST /run-graph/:id**: Execute a graph based on its configuration, processing nodes in topological order.

## 🛠 Helper Functions

- **validateGraph**: Validates graph structure and constraints.
- **processFunction**: Processes each node based on its data and configuration.
- **generateUniqueRunId**: Creates a unique `runId` for tracking executions.
- **saveNodeResultToDb**: Stores results of node processing in MongoDB.

---

Thank you for checking out the **DAG FlowNet**! For any questions or suggestions, feel free to reach out. Happy coding! 🌟
```
