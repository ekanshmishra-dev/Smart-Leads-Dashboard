import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral' | 'Other';
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const leadSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, required: [true, 'Please add an email'] },
    phone: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral', 'Other'],
      default: 'Website',
    },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>('Lead', leadSchema);
