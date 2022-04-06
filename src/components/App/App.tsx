import React, { PureComponent } from 'react';

import { WorkloadListContainer } from '../WorkloadList';
import { WorkloadFormContainer } from '../WorkloadForm';

class App extends PureComponent {
  render() {
    return (
      <main className="container">
        <div className="content">
          <h1>CloudWork</h1>
          <hr />
          <section className="py-4">
            <h2>Workloads</h2>
            <div className="flex">
              <div className="flex-1 mr-4">
                <WorkloadListContainer />
              </div>

              <div className="item">
                <WorkloadFormContainer />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }
}

export default App;
