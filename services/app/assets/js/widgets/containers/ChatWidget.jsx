import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchState, addMessage } from '../middlewares/Chat';
import { currentUserSelector } from '../selectors';
import Messages from '../components/Messages.jsx';
import UserName from '../components/UserName';

class ChatWidget extends React.Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    users: PropTypes.array.isRequired,
    messages: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  state = { message: '' }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchState());
  }

  messagesEnd = null

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  }

  sendMessage = () => {
    const { message } = this.state;
    const { name } = this.props.currentUser;

    if (message) {
      addMessage(name, message);
      this.setState({ message: '' });
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  }

  render() {
    return (
      <div
        className="card-group"
        style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: '15px',
          left: '15px',
        }}
      >
        <div className="card col-8 p-0">
          <div className="ml-2 my-1 font-weight-bold">Chat</div>
          <Messages
            style={{
              display: 'inline-block',
              flexGrow: '1',
              width: '100%',
              height: '130px',
              overflowY: 'scroll',
              border: '1px solid #eee',
            }}
            messages={this.props.messages}
          />
          <div className="card-text">
            <div className="input-group input-group-sm">
              <input
                className="form-control"
                type="text"
                placeholder="Type message here..."
                value={this.state.message}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-success"
                  type="button"
                  onClick={this.sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card col-4 p-0">
          <span
            className="ml-2 my-1 font-weight-bold"
            title="Online users"
          >
            Online users
          </span>
          <div
            className="card-body"
            style={{
              display: 'inline-block',
              flexGrow: '1',
              width: '100%',
              height: '130px',
              overflowY: 'scroll',
              border: '1px solid #eee',
            }}
          >
            {this.props.users.map(user => (<div key={user.id} className="my-2"> <UserName user={user} /> </div>))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { users, messages } = state.chat;
  return {
    users,
    messages,
    currentUser: currentUserSelector(state),
  };
};

export default connect(mapStateToProps, null)(ChatWidget);
