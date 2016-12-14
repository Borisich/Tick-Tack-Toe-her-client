//Компонент строки состояния

var React = require('react');


var socket = require('../../services/socket.js');

var soundManager = require('../../sounds/sounds.js');

var StatusBar = React.createClass({
    getInitialState: function () {
        return {
            shown: false,
            text: ""
        };
    },
    componentDidMount: function () {
        var self = this;
        socket.on('start game', function () {
            console.log("Игра началась");
            self.setState({shown: true});

            socket.once('wait other player', function () {
                self.setState({text: "Ход соперника..."});
            });

            socket.on('opponent informed',function(){
                self.setState({text: "Ход соперника..."});
            });

            //обработка события "ваш ход"
            socket.on('your turn',function(symbol){
                soundManager.play('my_turn');
                self.setState({text: "Ваш ход!"});
            });

            //Обработка события "конец игры"
            socket.once('end game', function(data){

                switch (data){
                    case "loose":
                        soundManager.play('loose');
                        self.setState({text: "Игра закончилась. Вы проиграли"});
                        console.log("Игра закончилась. Вы проиграли");
                        break;
                    case "win":
                        soundManager.play('win');
                        self.setState({text: "Игра закончилась. Вы выиграли!! УРАА!"});
                        console.log("Игра закончилась. Вы выиграли!! УРАА!");
                        break;
                    case "pat":
                        soundManager.play('pat');
                        self.setState({text: "Игра закончилась. Ничья"});
                        console.log("Игра закончилась. Ничья");
                        break;
                    case "disconnect":
                        soundManager.play('disconnect');
                        self.setState({text: "Игра закончилась. Игрок отключился"});
                        console.log("Дисконнект");
                        break;
                    default:
                }
            })
        });

    },
    render: function(){
        if (this.state.shown) {
            return <div>{this.state.text} </div>
        }
        else return <div></div>
    }
});

module.exports = StatusBar;
