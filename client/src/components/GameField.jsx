
var React = require('react');
var socket = require('../../services/socket.js');
var soundManager = require('../../sounds/sounds.js');

var GameField = React.createClass({
    getInitialState: function(){
        return {
            shown: false,
            fieldState: ["empty","empty","empty","empty","empty","empty","empty","empty","empty"],
            myTurn: false,
            mySymbol: 'x',
            myNumber: 1
        };
    },

    componentDidMount: function () {
        var self = this;
        //Если приконнектился продолжать
        socket.on('game status', function (gameData) {
            console.log("Игра продолжается");

            //Показать поле
            self.setState({shown: true});

            //отображение текущего положения дел
            self.updateFieldState(gameData.field);
            self.setState({myTurn: gameData.nowTurn, myNumber: gameData.playerNumber})

        });
        //Процесс новой игры
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

    updateFieldState: function(state){
        var tmp = [];
        for (var i=0; i<state.length; i++){
          if (state[i] == 1){
            tmp[i] = 'x';
          }
          else if (state[i] == -1){
            tmp[i] = 'o';
          }
          else{
              tmp[i] = 'empty';
          }
        }
        this.setState ({fieldState: tmp});
    },

    clickHandler: function(e){
        if (this.state.myTurn){
            var target = e.target;
            if (this.state.fieldState[target.id-1] == "empty"){
                this.setState({myTurn: false});
                //обновить поле
                var tmp = this.state.fieldState;
                if (this.state.myNumber == 1){
                  tmp[target.id-1] = "x";
                }
                else if (this.state.myNumber == 2){
                  tmp[target.id-1] = "o";
                }
                this.setState({fieldState: tmp})
                //отправить свой ход на сервер
                socket.emit('turn done',{targetId: target.id});
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
