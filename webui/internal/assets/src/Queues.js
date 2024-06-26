import React from 'react';
import PropTypes from 'prop-types';
import styles from './bootstrap.min.css';
import cx from './cx';

export default class Queues extends React.Component {
  static propTypes = {
    url: PropTypes.string,
  }

  state = {
    queues: []
  }

  constructor(props){
    super(props);
    this.timeout = null;
  }

  componentWillMount() {
    if (!this.props.url) {
      return;
    }
    fetch(this.props.url).
      then((resp) => resp.json()).
      then((data) => {
        this.setState({queues: data});
      });
  }
  componentDidMount(){
    this.timeout = setInterval(() =>{
      if (!this.props.url) {
        return;
      }
      fetch(this.props.url).
        then((resp) => resp.json()).
        then((data) => {
          this.setState({queues: data});
        });
    },2000);  
  }


  componentWillUnmount(){
    if(this.timeout){
      clearInterval(this.timeout);
    }
  }

  get queuedCount() {
    let count = 0;
    this.state.queues.map((queue) => {
      count += queue.count;
    });
    return count;
  }

  render() {
    return (
      <div className={cx(styles.panel, styles.panelDefault)}>
        <div className={styles.panelHeading}><h2>Queues</h2></div>
        <div className={styles.panelBody}>
          <p>{this.state.queues.length} queue(s) with a total of {this.queuedCount} item(s) queued.</p>
        </div>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Count</th>
                <th>Latency (seconds)</th>
              </tr>
              {
                this.state.queues.map((queue) => {
                  return (
                    <tr key={queue.job_name}>
                      <td>{queue.job_name}</td>
                      <td>{queue.count}</td>
                      <td>{queue.latency}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
