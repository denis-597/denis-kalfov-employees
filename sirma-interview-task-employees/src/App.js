import React, { Component } from 'react';
import { readString } from 'react-papaparse';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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
      dateNow = new Date();
    }

    const diffTime = Math.abs(new Date(dateNow) - new Date(datePast));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  showFile = async (e) => {
    e.preventDefault()

    const reader = new FileReader()
    let res = {}

    reader.onload = async (e) => {
      const parsed = readString(e.target.result);

      Object.values(parsed.data).map(p => {
        if (p && p.length > 0 && Array.isArray(p) && p != '') {
          if (!res[parseInt(p[1])]) { // If object with key [the project id] is not found create it 
            res[parseInt(p[1])] = {}
          }

          if (!res[parseInt(p[1])][p[0]]) { // If object with key [the employee id/name] is not found - create it
            res[parseInt(p[1])][p[0]] = this.calculcateDiffBetweenDates(p[2], p[3])
          } else {
            res[parseInt(p[1])][p[0]] += this.calculcateDiffBetweenDates(p[2], p[3]) // Sum the value of existing key with the new one
          }
        }
      })


      // console.log(`sortable`, sortable)
      this.setState({ data: res })
      console.log(`res Here`, res)
    };
    reader.readAsText(e.target.files[0])


  }

  render = () => {
    console.log(`this.state.data`, this.state.data)
    return (
      <div>
        <input type="file" onChange={(e) => this.showFile(e)} />

        <br />
        <br />

        <Grid container spacing={3}>

          <Grid item xs={3}>
            <Paper>Employee ID #1</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>Employee ID #2</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>Project ID</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>Days worked</Paper>
          </Grid>

          {Object.values(this.state.data).map((r, k) => {

            return Object.values(r).slice(0, 1).map((rr, kk) => {
              console.log(`rr`, rr)
              return null
              return (
                <>
                  <Grid item xs={3}>
                    <Paper>{Object.keys(r)[0]}</Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>{Object.keys(r)[1]}</Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>{Object.keys(this.state.data)[k]}</Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>{rr}+{Object.values(r)[kk+1]}</Paper>
                  </Grid>
                </>
              )
            })

          })}

        </Grid>

      </div>
    )
  }
}

export default App;
