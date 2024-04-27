import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHelperService {
  constructor() { }

  openFolder(event: any) : any{
    return event.target.files[0];
  }
}
