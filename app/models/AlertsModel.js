import mongoose from "mongoose";

const alertsSchema = new mongoose.Schema({
    VRN: {
        type: String,
        required: true,
    },
    alertType: {
        type: String,
        required: true,
    },
    alertName: {
        type: String,
        required: true,
    },
    alertDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    employee: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Alerts = mongoose.models.Alerts || mongoose.model("Alerts", alertsSchema);
export default Alerts;