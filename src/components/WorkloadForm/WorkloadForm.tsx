import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { submit, created } from '../../state/workloads/actions';
import { Status } from '../../state/workloads/types';

interface WorkloadFormDispatchProps {
  submitWorkload: (complexity: number) => void;
  createWorkload: (
    params: {
      id: number;
      status: Status;
      complexity: number;
      completeDate: Date;
    }
  ) => void;
}

interface WorkloadFormProps extends WorkloadFormDispatchProps {}

interface WorkloadFormState {
  complexity: number;
}

class WorkloadForm extends React.PureComponent<
  WorkloadFormProps,
  WorkloadFormState
> {
  defaultState = {
    complexity: 5,
  };

  state = this.defaultState;

  handleSubmit = (e: React.MouseEvent) => {
    const { complexity } = this.state;
    const { submitWorkload, createWorkload } = this.props;
    submitWorkload(complexity);
    createWorkload({
      id: +`${Date.now()}`,
      complexity,
      completeDate: moment()
        .add(10, 'second')
        .toDate(),
      status: 'WORKING',
    });

    this.setState(this.defaultState);
    e.preventDefault();
  };

  render() {
    return (
      <form>
        <h2>Create workload</h2>

        <div>
          <label>
            Complexity: {this.state.complexity}
            <br />
            <input
              value={this.state.complexity}
              onChange={(e) =>
                this.setState({ complexity: Number(e.target.value) })
              }
              type="range"
              min="1"
              max="10"
            />
          </label>
        </div>

        <div>
          <button onClick={this.handleSubmit} type="submit">
            Start work
          </button>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): WorkloadFormDispatchProps => ({
  submitWorkload: (complexity: number) => dispatch(submit({ complexity })),
  createWorkload: (params: {
    id: number;
    status: Status;
    complexity: number;
    completeDate: Date;
  }) =>
    dispatch(
      created({
        id: params.id,
        status: params.status,
        completeDate: params.completeDate,
        complexity: params.complexity,
      })
    ),
});

const WorkloadFormContainer = connect(
  null,
  mapDispatchToProps
)(WorkloadForm);

export { WorkloadForm, WorkloadFormContainer };

export default WorkloadForm;
