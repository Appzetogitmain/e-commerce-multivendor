import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  customer?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: 'Pending' | 'Responded' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: [true, 'Seller reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Responded', 'Closed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
