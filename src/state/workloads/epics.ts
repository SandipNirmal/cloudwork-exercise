import { combineEpics, Epic } from 'redux-observable';
import { merge } from 'rxjs';
import { filter, map, tap, ignoreElements, switchMap, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { RootAction, RootState } from '../reducer';
import * as workloadsActions from './actions';
import { WorkloadService } from './services'


type AppEpic = Epic<RootAction, RootAction, RootState>;

const workloadService = new WorkloadService()

const logWorkloadSubmissions: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    map(action => action.payload),
    tap((payload) => console.log('Workload submitted', payload)),
    switchMap(payload => workloadService.create(payload)),
    tap((payload) => console.log('Workload created', payload)),
    map(payload => workloadsActions.created(payload))
  )
);

const cancelWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.cancel)),
    map(action => action.payload),
    switchMap(payload => merge(workloadService.cancel(payload)).pipe(
      map(payload => workloadsActions.updateStatus(payload)),
      // catchError(err => Promise.resolve({ type: 'Error', message: err.message })
    )))
)

export const epics = combineEpics(
  logWorkloadSubmissions,
  cancelWorkload
);

export default epics;
