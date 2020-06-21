import { Component, OnInit, Input } from '@angular/core';
import { Exercise } from 'src/app/shared/exercise.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-set-item',
  templateUrl: './set-item.component.html',
  styleUrls: ['./set-item.component.css']
})

// =====================================================

export class SetItemComponent implements OnInit {

  @Input() exercise: Exercise;

  isNavbarCollapsed=true;
  
  // =====================================================

  constructor() { }

  ngOnInit(): void {
  }

  // =====================================================


}
