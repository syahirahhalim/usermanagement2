import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  currentUser$ = new BehaviorSubject<any>(null);
  constructor() {}
}
