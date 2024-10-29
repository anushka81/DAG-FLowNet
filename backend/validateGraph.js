const mongoose = require('mongoose');
const Node = require('./schemas/node');
const Edge = require('./schemas/edge');

const validateGraph = async (graph) => {
    // Step 1: Validate the nodes and edges
    const nodes = await Node.find({ _id: { $in: graph.nodes } });
    const edges = await Edge.find({ _id: { $in: graph.edges } });

    if (nodes.length !== graph.nodes.length) {
        throw new Error('Some nodes are not valid');
    }

    if (edges.length !== graph.edges.length) {
        throw new Error('Some edges are not valid');
    }

    // Step 2: Validate src_node and dst_node
    for (const edge of edges) {
        if (!nodes.some(node => node._id.equals(edge.src_node))) {
            throw new Error(`Source node ${edge.src_node} does not exist`);
        }
        if (!nodes.some(node => node._id.equals(edge.dst_node))) {
            throw new Error(`Destination node ${edge.dst_node} does not exist`);
        }
    }

    // Step 3: Check for duplicate edges
    const edgeIds = graph.edges;
    const uniqueEdges = new Set(edgeIds);
    if (uniqueEdges.size !== edgeIds.length) {
        throw new Error('Duplicate edges detected');
    }

    // Step 4: Check for islands (single connected component)
    const visited = new Set();
    const adjacencyList = {};

    // Adjacency list from edges
    edges.forEach(edge => {
        if (!adjacencyList[edge.src_node]) {
            adjacencyList[edge.src_node] = [];
        }
        adjacencyList[edge.src_node].push(edge.dst_node);
    });

    const dfs = (node) => {
        visited.add(node);
        const neighbors = adjacencyList[node] || [];
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        });
    };

    // Start DFS from the first node
    if (nodes.length > 0) {
        dfs(nodes[0]._id);
    }

    // Check if all nodes were visited
    if (visited.size !== nodes.length) {
        throw new Error('Graph contains islands; not all nodes are reachable from one another');
    }

    // Step 5: Check for cycles using topological sort
    const indegree = new Map();
    edges.forEach(edge => {
        indegree.set(edge.dst_node, (indegree.get(edge.dst_node) || 0) + 1);
    });

    const queue = [];
    nodes.forEach(node => {
        if (!indegree.has(node._id)) {
            queue.push(node._id);
        }
    });

    let count = 0;
    while (queue.length > 0) {
        const node = queue.shift();
        count++;
        (adjacencyList[node] || []).forEach(neighbor => {
            indegree.set(neighbor, indegree.get(neighbor) - 1);
            if (indegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        });
    }

    if (count !== nodes.length) {
        throw new Error('Graph contains a cycle');
    }
};

module.exports = validateGraph;
