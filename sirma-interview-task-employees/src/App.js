import React, { Component } from 'react';
import { readString } from 'react-papaparse';

class App extends Component {
  constructor(props) {
    super(props);
  }

  calculcateDiffBetweenDates = (datePast, dateNow) => {
    if (dateNow) {
      dateNow = new Date();
    }
    const diffTime = Math.abs(new Date(datePast) - new Date(dateNow));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const parsed = readString(e.target.result);
      let res = {};

      Object.values(parsed.data).map(p => {
        if (p && p.length > 0 && Array.isArray(p) && p != '') {
          if (!res[parseInt(p[1])]) {
            res[parseInt(p[1])] = []
          }

          res[parseInt(p[1])].push(
            { name: p[0], difInDays: this.calculcateDiffBetweenDates(p[2], p[3]) }
          )
        }

      })

      console.log(`res`, res)

    };
    reader.readAsText(e.target.files[0])



  }

  render = () => {

    return (<div>
      <input type="file" onChange={(e) => this.showFile(e)} />
    </div>
    )
  }
}

export default App;
