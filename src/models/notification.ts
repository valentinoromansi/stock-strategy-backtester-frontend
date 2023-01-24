import { AlertColor } from '@mui/material/Alert';


export class Notification {
  id?: number;
  type: AlertColor;
  message: string;
  creationDate: Date;
  manuallyClosed: boolean;
  constructor(type: AlertColor, message: string, manuallyClosed: boolean = false) {
    this.type = type;
    this.message = message;
    this.manuallyClosed = manuallyClosed;
    this.creationDate = new Date();
  }
}
