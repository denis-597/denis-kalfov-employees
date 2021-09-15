import React, { Component } from 'react';
import { readString } from 'react-papaparse';

class App extends Component {
  constructor(props) {
    super(props);
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      console.log(text)
      // alert(text)

      const parsed = readString(text);
      console.log(`parsed`, parsed)

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
