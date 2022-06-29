import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import Users from './Users';
import User from './User';



class App extends Component{
  constructor(){
    super();
    this.state = {
      users: [],
      userId: ''
    };
    this.createAUser = this.createAUser.bind(this);
    this.deleteAUser = this.deleteAUser.bind(this);
  }
  async componentDidMount(){
    try {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      const response = await axios.get('/api/users');
      this.setState({ users: response.data });
      window.addEventListener('hashchange', ()=> {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      });
    }
    catch(ex){
      console.log(ex);
    }
  }
  async createAUser(){
    let user = (await axios.post('/api/users')).data;
    const users = [...this.state.users, user];
    this.setState({ users });
    const lastUser = users[users.length-1]; 
    window.location.hash = `#${lastUser.id}`
  }
  async deleteAUser(user){
    (await axios.delete(`/api/users/${user.id}`));
    let users = this.state.users.filter( _user => _user.id !== user.id);
    this.setState({ users });
    if(this.state.userId){
      window.location.hash = ''; //set it so that you go back
    }
  }

  render(){
    const { users, userId } = this.state;
    const { createAUser, deleteAUser } = this;
    return (
      <div>
        <h1>Acme Writers Group ({ users.length })</h1>
        <button onClick={createAUser}>Add a User</button>
        <main>
          <Users users = { users } userId={ userId } deleteAUser={deleteAUser}/>
          {
            userId ? <User userId={ userId } /> : null
          }
        </main>
      </div>
    );
  }
}

const root = document.querySelector('#root');
render(<App />, root);


