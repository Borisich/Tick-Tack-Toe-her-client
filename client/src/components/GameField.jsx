
var React = require('react');
var socket = require('../../services/socket.js');
var soundManager = require('../../sounds/sounds.js');

var GameField = React.createClass({
    getInitialState: function(){
        return {
            shown: false,
            fieldState: ["empty","empty","empty","empty","empty","empty","empty","empty","empty"],
            myTurn: false,
            mySymbol: 'x'
        };
    },

    componentDidMount: function () {
        var self = this;

        //Процесс игры
        socket.on('start game', function () {
            console.log("Игра началась");

            //Показать поле
            self.setState({shown: true});

            //отображение хода другого игрока
            socket.on('other player turn',function(data){
                self.updateFieldState(data.num, data.symbol);
                socket.emit('other player turn getted');
            });

            //обработка события "ваш ход"
            socket.on('your turn',function(symbol){
                self.setState({myTurn: true});
                self.setState({mySymbol: symbol});
            });
        });
    },

    updateFieldState: function(id, state){
        var tmp = this.state.fieldState;
        tmp[id-1] = state;
        this.setState ({fieldState: tmp});
    },

    clickHandler: function(e){
        if (this.state.myTurn){
            var target = e.target;
            if (this.state.fieldState[target.id-1] == "empty"){
                this.setState({myTurn: false});
                this.updateFieldState(target.id, this.state.mySymbol);
                //отправить свой ход на сервер
                socket.emit('turn finished',target.id);
                soundManager.play('turn_finished');
            }
        }
        console.log("fieldState: ");
        console.log(this.state.fieldState);
    },

    render: function(){
      if (this.state.shown) {
          return (
              <div onClick={this.clickHandler}>

                  <div id='1' className={this.state.fieldState[0]}></div>
                  <div id='2' className={this.state.fieldState[1]}></div>
                  <div id='3' className={this.state.fieldState[2]}></div>
                  <div id='4' className={this.state.fieldState[3]}></div>
                  <div id='5' className={this.state.fieldState[4]}></div>
                  <div id='6' className={this.state.fieldState[5]}></div>
                  <div id='7' className={this.state.fieldState[6]}></div>
                  <div id='8' className={this.state.fieldState[7]}></div>
                  <div id='9' className={this.state.fieldState[8]}></div>
              </div>
          );
      }
      else return <div></div>
  }
});

module.exports = GameField;
