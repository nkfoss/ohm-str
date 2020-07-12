import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  exerciseId: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  // initEditForm() {
  //   this.activatedRoute.params.subscribe( (params: Params) => {
  //         this.exerciseId = +params['exerciseId'],
  //         this.editMode = params['exerciseId'] != null;
  //         this.initForm()
  //       }
  //       )
  // }
}
