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
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText:''
    }

    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
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

  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir
    })
  }

  searchApts(query){
    this.setState({
      queryText: query
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
    let order;
    let filteredApts = this.state.myAppointments;

    if(this.state.orderDir === 'asc'){
      order = 1;
    }else{
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()){
        return -1 * order;
      }else{
        return 1 * order;
      }
    }).filter(eachItem => {
      return (
        eachItem['petName'].toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) ||
        eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) ||
        eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) 

      )
    });


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

                <SearchAppointments 
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />

                <ListAppointments 
                  appointments={filteredApts}
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
