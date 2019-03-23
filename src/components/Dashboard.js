import axios from 'axios';
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'

const styles = {
  label: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 10,
  },
  root: {
    margin: '20px auto',
    maxWidth: 600,
    padding: '5px 20px 10px',
  },
};

class Dashboard extends Component {
  state = {
    data: [],
    loading: true,
  };

  componentDidMount() {
    this.axiosRequest = axios.get('data.json')
      .then(({ data }) => {
        this.setState({
          data,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.axiosRequest.abort();
  }

  render() {
    const { classes } = this.props;
    const { data, loading } = this.state;

    return (
      <>
        <Paper className={classes.root}>
          { loading
              ? <Typography className={classes.label}>Loading...</Typography>
              : <Typography className={classes.label}>Loaded ({data.length}) Items</Typography>
          }
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
