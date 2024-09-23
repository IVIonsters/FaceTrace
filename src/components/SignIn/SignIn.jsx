import React, { Component } from 'react';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  // Update the state with the value of the input field - email
  onEmailChange(event) {
    this.setState({ signInEmail: event.target.value });
  }
  // Update the state with the value of the input field - password
  onPasswordChange(event) {
    this.setState({ signInPassword: event.target.value });
  }
  // Handles the submit button on the form
  onSubmitSignIn = () => {
    console.log(this.state);
  };
  // Handles the route change for the Sign In page
  handleSubmit(event) {
    event.preventDefault();
    this.props.onRouteChange('home');
  }

  render() {
    return (
      <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
        <main className="pa4 black-80">
          <form className="measure" onSubmit={this.handleSubmit}>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
              </div>
            </fieldset>
            <div className="">
              <input 
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit" 
                value="Sign in" 
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => this.props.onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
            </div>
          </form>
        </main>
      </article>
    );
  }
}

export default SignIn;