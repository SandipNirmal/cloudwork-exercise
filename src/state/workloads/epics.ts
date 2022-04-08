import { combineEpics, Epic } from 'redux-observable';
import { merge, from } from 'rxjs';
import {
  filter,
  map,
  tap,
  // ignoreElements,
  delay,
  mergeMap
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import 'rxjs'

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
    mergeMap(payload => workloadService.create(payload)),
    tap((payload) => console.log('Workload created', payload)),
    map(payload => workloadsActions.created(payload)),
  )
)

const cancelWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.cancel)),
    map(action => action.payload),
    mergeMap(async payload => {
      const curr = await workloadService.checkStatus(payload);
      if (curr.status === "WORKING") {
        const work = await workloadService.cancel(payload);
        return workloadsActions.updateStatus(work);
      }
      return workloadsActions.updateStatus(curr);
    })
  )
)

// const cancelWorkload: AppEpic = (action$, state$) => (
//   action$.pipe(
//     filter(isActionOf(workloadsActions.cancel)),
//     map(action => action.payload),
//     mergeMap(payload => merge(workloadService.cancel(payload)).pipe(
//       map(payload => workloadsActions.updateStatus(payload)),
//       // catchError(err => Promise.resolve({ type: 'Error', message: err.message })
//     )))
// )

const watchWorkloads: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.created)),
    map(action => action.payload),
    mergeMap(payload =>
      from(
        // run on next tick
        new Promise((res) => setTimeout(() => res(true), 0))
      )
        .pipe(
          delay(payload.completeDate),
          mergeMap(async () => {
            const workLoad = await workloadService.checkStatus(payload);
            console.log('workload after delay', workLoad)
            return workloadsActions.updateStatus(workLoad);
          })
        )
    )
  ))

// const watchWorkloads: AppEpic = (action$, state$) => (
//   action$.pipe(
//     filter(isActionOf(workloadsActions.created)),
//     map(action => action.payload),
//     mergeMap(payload =>
//       of(payload).pipe(
//         delay(payload.completeDate),
//         mergeMap(async () => {
//           const workLoad = await workloadService.checkStatus(payload);
//           console.log('workload after delay', workLoad)
//           return workloadsActions.updateStatus(workLoad);
//         })
//       )
//     )
//   ))

// mergeMap(payload =>
// merge(workloadService.checkStatus(payload))
//   .pipe(map(payload => workloadsActions.updateStatus(payload)))
//   .pipe(delay(payload.completeDate)))

export const epics = combineEpics(
  logWorkloadSubmissions,
  cancelWorkload,
  watchWorkloads
);

export default epics;
