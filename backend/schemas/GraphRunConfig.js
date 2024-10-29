const graphRunConfigSchema = new Schema({
    root_inputs: {
        type: Map,
        of: new Schema({
            node_id: { type: String, required: true },
            data_in: { type: Map, of: Schema.Types.Mixed, default: {} },
        }),
        required: true,
    },
    data_overwrites: {
        type: Map,
        of: new Schema({
            node_id: { type: String, required: true },
            data_in: { type: Map, of: Schema.Types.Mixed, default: {} },
        }),
        default: {},
    },
    enable_list: { type: [String], default: [] },   // List of enabled node_ids
    disable_list: { type: [String], default: [] },  // List of disabled node_ids (mutually exclusive with enable_list)
});

module.exports = mongoose.model('GraphRunConfig', graphRunConfigSchema);
