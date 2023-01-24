import { AlertColor } from '@mui/material/Alert';


export class Notification {
  id?: number;
  type: AlertColor;
  message: string;
  creationDate: Date;
  fetching: boolean;
  constructor(type: AlertColor, message: string, fetching: boolean = false) {
    this.type = type;
    this.message = message;
    this.fetching = fetching;
    this.creationDate = new Date();
  }
}
