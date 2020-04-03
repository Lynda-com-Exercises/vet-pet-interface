import React from 'react';
import '../css/App.css';

import AddApointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';

import {without} from 'lodash';

class App extends React.Component{

  constructor() {
    super();

    this.state = {
      myAppointments: [],
      lastIndex: 0,
      formDisplay: false
    }

    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
  }

  deleteAppointment(apt){
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt); //from lodash

    this.setState({
      myAppointments: tempApts
    })
  }

  toggleForm(){
    this.setState({
      formDisplay: !this.state.formDisplay
    })
  }

  addAppointment(apt){
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;

    tempApts.unshift(apt);

    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    })
  }

  componentDidMount(){
    fetch('./data.json')
    .then(result => result.json())
    .then(data => {
      const apts = data.map(item => {
        item.aptId = this.state.lastIndex;

        this.setState({
          lastIndex: this.state.lastIndex + 1
        });

        return item;
      });

      this.setState({
        myAppointments: apts
      });

    })
  }

  render(){
    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddApointments 
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />

                <SearchAppointments />

                <ListAppointments 
                  appointments={this.state.myAppointments}
                  deleteAppointment={this.deleteAppointment}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
}

export default App;
