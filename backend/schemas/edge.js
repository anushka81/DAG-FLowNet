const mongoose = require('mongoose');
const { Schema } = mongoose;

const edgeSchema = new Schema({
    src_node: { type: Schema.Types.ObjectId, ref: 'Node', required: true },
    dst_node: { type: Schema.Types.ObjectId, ref: 'Node', required: true },
    src_to_dst_data_keys: {
        type: Map,
        of: String, // Maps `data_out` key of src_node to `data_in` key of dst_node
    },
});

module.exports = mongoose.model('Edge', edgeSchema);
