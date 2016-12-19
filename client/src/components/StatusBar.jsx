//Компонент строки состояния
var React = require('react');

var StatusBar = React.createClass({
  handleClick: function(){
    this.props.multiButton.onClick();
  },
  render: function(){
    return (
      <div>
        {this.props.text} <font color="#F5B1B1">{this.props.connectionText}</font> <br/><br/>
        <button disabled={this.props.multiButton.disabled} onClick={this.handleClick} >{this.props.multiButton.text}</button>
      </div>
      )
  }
});

module.exports = StatusBar;
