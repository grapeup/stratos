import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/Rx';

import { EntityService } from '../../../core/entity-service';
import { AppMetadataTypes } from '../../../store/actions/app-metadata.actions';
import { SetCFDetails, SetNewAppName } from '../../../store/actions/create-applications-page.actions';
import { AppState } from '../../../store/app-state';
import { AppNameUniqueChecking, AppNameUniqueDirective } from '../app-name-unique.directive/app-name-unique.directive';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.scss'],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class EditApplicationComponent implements OnInit, OnDestroy {

  editAppForm: FormGroup;

  uniqueNameValidator: AppNameUniqueDirective;

  appNameChecking: AppNameUniqueChecking = new AppNameUniqueChecking();

  constructor(
    private applicationService: ApplicationService,
    private entityService: EntityService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private http: Http,
  ) {
    this.uniqueNameValidator = new AppNameUniqueDirective(this.store, this.http);
    this.editAppForm = this.fb.group({
      name: ['',
        [Validators.required],
        [this.uniqueNameValidator],
      ],
      instances: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      disk_quota: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      memory: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      enable_ssh: false,
      production: false
    });
  }

  private app: any = {
    entity: {}
  };

  private sub: Subscription;

  private error = false;

  ngOnInit() {
    this.sub = this.applicationService.application$.filter(app => app.app.entity).take(1).map(app => app.app.entity).subscribe(app => {
      this.app = app;
      this.store.dispatch(new SetCFDetails({
        cloudFoundry: this.applicationService.cfGuid,
        org: '',
        space: this.app.space_guid,
      }));

      this.store.dispatch(new SetNewAppName(this.app.name));
      this.editAppForm.setValue({
        name: this.app.name,
        instances: this.app.instances,
        memory: this.app.memory,
        disk_quota: this.app.disk_quota,
        production: this.app.production,
        enable_ssh: this.app.enable_ssh,
      });
      // Don't want the values to change while the user is editing
      this.clearSub();
    });
  }

  updateApp = () => {
    const updates = {};
    // We will only send the values that were actually edited
    for (const key of Object.keys(this.editAppForm.value)) {
      if (!this.editAppForm.controls[key].pristine) {
        updates[key] = this.editAppForm.value[key];
      }
    }

    let obs$: Observable<any>;
    if (Object.keys(updates).length) {
      // We had at least one value to change - send update action
      obs$ = this.applicationService.updateApplication(updates, [AppMetadataTypes.SUMMARY]).map(v => ({ success: !v.error }));
    } else {
      obs$ = Observable.of({ success: true });
    }

    return obs$.take(1).map(res => {
      this.error = !res.success;
      return {
        success: res.success,
        redirect: res.success
      };
    });
  }

  clearSub() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }

  ngOnDestroy() {
    this.clearSub();
  }
}
