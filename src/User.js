import React, { Component } from 'react';
import axios from 'axios';

class User extends Component{
  constructor(){
    super();
    this.state = {
      user: {},
      stories: []
    };
    this.createAStory = this.createAStory.bind(this);
    this.deleteAStory = this.deleteAStory.bind(this);
  }
  async componentDidMount(){
    let response = await axios.get(`/api/users/${this.props.userId}`);
    this.setState({ user: response.data });
    response = await axios.get(`/api/users/${this.props.userId}/stories`);
    this.setState({ stories: response.data });

  }
  async componentDidUpdate(prevProps){
    if(prevProps.userId !== this.props.userId){
      let response = await axios.get(`/api/users/${this.props.userId}`);
      this.setState({ user: response.data });
      response = await axios.get(`/api/users/${this.props.userId}/stories`);
      this.setState({ stories: response.data });
    }
  }
  async createAStory(){
    const story = (await axios.post(`/api/users/${this.props.userId}/stories`)).data;
    const stories = [...this.state.stories, story];
    console.log(stories);
    this.setState({ stories });
  }
  async deleteAStory(story){
    await axios.delete(`/api/stories/${story.id}`);
    let stories = this.state.stories.filter( _story => _story.id !== story.id);
    this.setState({ stories });
  }
  render(){
    const { user, stories } = this.state;
    const { createAStory, deleteAStory } = this;
    return (
      <div>
        Details for { user.name }
        <p>
          { user.bio }
        </p>
        <ul>
          {
            stories.map( story => {
              return (
                <li key={ story.id }>
                  { story.title } <button onClick={() => deleteAStory(story)}>Delete story</button>
                  <p>
                  { story.body }
                  </p>
                </li>
              );
            })
          }
        </ul>
        <button onClick = { () => createAStory() }>Generate a story</button>
      </div>
    );
  }
}

export default User;
