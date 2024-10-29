const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MongoDB connection
const mongoURI = 'mongodb+srv://test-user-fYikrmxbpHz7C098:fYikrmxbpHz7C098@dag.l9usg.mongodb.net/';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const Node = require('./schemas/node');
const Edge = require('./schemas/edge');
const Graph = require('./schemas/graph');
const validateGraph = require('./validateGraph');

const app = express();
app.use(bodyParser.json());

// CRUD APIs for Nodes
// Create a new node
app.post('/nodes', async (req, res) => {
    try {
        const node = new Node(req.body);
        await node.save();
        res.status(201).json(node);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve all nodes
app.get('/nodes', async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Retrieve a specific node by ID
app.get('/nodes/:id', async (req, res) => {
    try {
        const node = await Node.findById(req.params.id);
        if (!node) return res.status(404).json({ message: 'Node not found' });
        res.json(node);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a specific node
app.put('/nodes/:id', async (req, res) => {
    try {
        const node = await Node.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!node) return res.status(404).json({ message: 'Node not found' });
        res.json(node);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a specific node
app.delete('/nodes/:id', async (req, res) => {
    try {
        const node = await Node.findByIdAndDelete(req.params.id);
        if (!node) return res.status(404).json({ message: 'Node not found' });
        res.json({ message: 'Node deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CRUD APIs for Edges

// Create a new edge
app.post('/edges', async (req, res) => {
    try {
        const edge = new Edge(req.body);
        await edge.save();
        res.status(201).json(edge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve all edges
app.get('/edges', async (req, res) => {
    try {
        const edges = await Edge.find();
        res.json(edges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CRUD APIs for Graphs

// Create a new graph
app.post('/graphs', async (req, res) => {
    try {
        const graph = new Graph(req.body);
        await graph.save();
        res.status(201).json(graph);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve all graphs
app.get('/graphs', async (req, res) => {
    try {
        const graphs = await Graph.find();
        res.json(graphs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Execute the graph with the specified ID.
app.post('/run-graph/:id', async (req, res) => {
    try {
        const graph = await Graph.findById(req.params.id).populate('nodes edges');
        
        // Validate the graph before execution
        /* following checks for graph:
            1. validates the nodes and edges
            2. validate src_node and dst_node
            3. checks for duplicate edges
            4. check for islands == 1
            5. checks for cycles/loops using topological sort
        */
        await validateGraph(graph);

        // Assume that req.body contains root inputs for the execution
        const rootInputs = req.body.rootInputs || {}; // e.g., { "A": { "input": 10 } }

        // Initialize data_in for the root nodes
        graph.nodes.forEach(node => {
            if (rootInputs[node.node_id]) {
                node.data_in = rootInputs[node.node_id]; // Set initial data_in from root inputs
            } else {
                node.data_in = {}; // Set to empty object if not a root node
            }
            node.data_out = {}; // Reset data_out to prepare for execution
        });

        // Data flow processing logic
        let hasChanges = true;
        while (hasChanges) {
            hasChanges = false;

            for (const edge of graph.edges) {
                const srcNode = graph.nodes.find(node => node._id.equals(edge.src_node));
                const dstNode = graph.nodes.find(node => node._id.equals(edge.dst_node));

                if (srcNode && dstNode) {
                    // Check if the source node has an output to propagate
                    const outputKey = edge.src_to_dst_data_keys.output;
                    if (srcNode.data_out[outputKey] !== undefined) {
                        // Update the input data of the destination node
                        dstNode.data_in[edge.src_to_dst_data_keys.input] = srcNode.data_out[outputKey];
                        hasChanges = true; // Mark that there was a change
                    }
                }
            }
        }

        // Update nodes in the database with the final data_out values
        for (const node of graph.nodes) {
            await Node.findByIdAndUpdate(node._id, {
                data_in: node.data_in,
                data_out: node.data_out,
            });
        }

        res.json({ message: 'Graph run successfully', graph });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
