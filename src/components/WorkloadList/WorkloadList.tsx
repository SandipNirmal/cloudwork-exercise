import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootAction, RootState } from '../../state';
import { cancel, updateStatus } from '../../state/workloads/actions';
import { WorkloadItem, WorkloadItemStateProps } from '../WorkloadItem';
import { Status } from '../../state/workloads';

export interface WorkloadListStateProps {
  workloads: WorkloadItemStateProps[];
}

export interface WorkloadListDispatchProps {
  cancelWorkload: (id: number) => void;
  updateStatus: (params: { id: number; status: Status }) => void;
}

export interface WorkloadListProps
  extends WorkloadListStateProps,
    WorkloadListDispatchProps {}

const WorkloadList: React.SFC<WorkloadListProps> = ({
  workloads,
  cancelWorkload,
  updateStatus,
}) => {
  const handleCancelWorkload = (id: number): void => {
    cancelWorkload(id);
  };

  return !workloads.length ? (
    <span>No workloads to display</span>
  ) : (
    <ol className="flex flex-col">
      {workloads.map((workload) => (
        <li key={workload.id}>
          <WorkloadItem
            {...workload}
            onCancel={() => handleCancelWorkload(workload.id)}
          />
        </li>
      ))}
    </ol>
  );
};

const mapStateToProps = (state: RootState): WorkloadListStateProps => ({
  workloads: Object.values(state.workloads),
});

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>
): WorkloadListDispatchProps => ({
  cancelWorkload: (id: number) => dispatch(cancel({ id })),
  updateStatus: (params: { id: number; status: Status }) =>
    dispatch(
      updateStatus({
        id: params.id,
        status: params.status,
      })
    ),
});

const WorkloadListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkloadList);

export { WorkloadList, WorkloadListContainer };

export default WorkloadList;
