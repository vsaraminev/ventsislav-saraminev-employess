import React, { Component } from 'react';
import { LINE_SEPARATOR } from '../utils/constants';
import utils from '../utils/utils';
import Output from './Output';

class Input extends Component {
   state = {
      employeesWorkedTogether: {},
      show: false
   };
   loadData = (event) => {
      event.preventDefault();
      let reader = new FileReader();
      const scope = this;
      reader.onload = function () {
         const text = reader.result;
         const splitedLines = text.split(LINE_SEPARATOR);
         const allEmployees = utils.populateEmployees(splitedLines);
         const employeesWorkedTogether = utils.findEmployeePair(allEmployees);
         scope.setState({ employeesWorkedTogether, show: true });
      }
      reader.readAsText(event.target.files[0]);
   };

   render() {
      return (
         <div>
            <h2>Please, click the button below to choose file:</h2>
            <div className="upload-btn-wrapper">
               <button className="btn">Choose text file, please</button>
               <input type="file" name="myfile" onChange={(event) => this.loadData(event)}/>
            </div>
            {!this.state.show ? null : <Output data={this.state.employeesWorkedTogether} />}
         </div>
      );
   }
}

export default Input;