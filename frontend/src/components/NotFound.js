import React from 'react';

class NotFound extends React.Component {
  componentDidMount() {
    this.props.history.push('/search');
  }

  render() {
    return <div></div>;
  }
}

export default NotFound;
