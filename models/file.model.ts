import mongoose, { Schema } from 'mongoose';
import { Container, Service } from 'typedi';

import { FILE_MODEL } from '../interfaces';

@Service()
export class FileSchema extends Schema {
  constructor() {
    super(
      {
        name: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        model: {
          type: String,
          required: true,
          enum: FILE_MODEL,
        },
        path: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        access: [{
          type: Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        }],
      },
      {
        timestamps: true,
        versionKey: false,
      },
    );
  }
}

export default mongoose.model<mongoose.Document>(
  'File',
  Container.get(FileSchema),
);
