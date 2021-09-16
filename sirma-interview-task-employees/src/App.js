import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { readString } from 'react-papaparse';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
require('datejs');

const styles = ({
  eachRowStyle: {
    '& .MuiPaper-root': {
      padding: 10
    }
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  calculcateDiffBetweenDates = (datePast, dateNow) => {
    datePast = datePast.replace(/\s/g, '')
    dateNow = dateNow.replace(/\s/g, '')
    if (dateNow == 'NULL') {
      dateNow = Date.today();
    }

    const diffTime = Math.abs(Date.parse(dateNow) - Date.parse(datePast));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  showFile = async (e) => {
    e.preventDefault()

    const reader = new FileReader()
    let res = {}

    reader.onload = async (e) => {
      const parsed = readString(e.target.result);

      Object.values(parsed.data).map(row => {
        let rowEmployee = row[0]
        let rowProject = parseInt(row[1]);
        let rowDateFrom = row[2];
        let rowDateTo = row[3];

        if (row && row.length > 0 && Array.isArray(row) && row != '') {
          if (!res[rowProject]) { // If object with key [the project id] is not found create it 
            res[rowProject] = {}
          }

          if (!res[rowProject]['empl_' + rowEmployee]) { // If object with key [the employee id/name] is not found - create it
            res[rowProject]['empl_' + rowEmployee] = this.calculcateDiffBetweenDates(rowDateFrom, rowDateTo)
          } else {
            res[rowProject]['empl_' + rowEmployee] += this.calculcateDiffBetweenDates(rowDateFrom, rowDateTo) // Sum the value of existing key with the new one
          }
        }
      })

      let sorted = {}
      Object.values(res).map((r, k) => {
        sorted[Object.keys(res)[k]] = Object.entries(r) // Sort the object
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      })

      this.setState({ data: sorted })
    };

    reader.readAsText(e.target.files[0])
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', marginTop: 50 }}>

        <input style={{ display: 'none' }} type="file" onChange={(e) => this.showFile(e)} id="button-file" />

        <label htmlFor="button-file">
          <Button variant="contained" component="span">
            Upload file
          </Button>
        </label>

        <br />
        <br />

        <Grid container spacing={3}>

          <Grid item xs={3} className={classes.eachRowStyle}>
            <Paper>Employee ID #1</Paper>
          </Grid>
          <Grid item xs={3} className={classes.eachRowStyle}>
            <Paper>Employee ID #2</Paper>
          </Grid>
          <Grid item xs={3} className={classes.eachRowStyle}>
            <Paper>Project ID</Paper>
          </Grid>
          <Grid item xs={3} className={classes.eachRowStyle}>
            <Paper>Days worked</Paper>
          </Grid>

          {Object.values(this.state.data).map((r, k) => (
            Object.values(r).slice(0, 1).map((rr, kk) => {
              let employeeRow = Object.keys(r)[0].split('_')[1];
              let employeeRowSecond = Object.keys(r)[1].split('_')[1];
              let projectIdRow = Object.keys(this.state.data)[k]
              let daysWorkedRow = rr * 1 + (Object.values(r)[kk + 1]) * 1;

              return <React.Fragment key={k} >
                <Grid item xs={3} className={classes.eachRowStyle}>
                  <Paper>{employeeRow}</Paper>
                </Grid>
                <Grid item xs={3} className={classes.eachRowStyle}>
                  <Paper>{employeeRowSecond}</Paper>
                </Grid>
                <Grid item xs={3} className={classes.eachRowStyle}>
                  <Paper>{projectIdRow}</Paper>
                </Grid>
                <Grid item xs={3} className={classes.eachRowStyle}>
                  <Paper>{daysWorkedRow}</Paper>
                </Grid>
              </React.Fragment>
            })
          ))}

        </Grid>

      </div >
    )
  }
}

export default (withStyles(styles)(App));
