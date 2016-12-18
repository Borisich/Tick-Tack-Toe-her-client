//компонент пригласительной ссылки
var React = require('react');

var socket = require('../../services/socket.js');

var InviteLink = React.createClass({
    getInitialState: function () {
        return {
            link: "",
            shown: false,
            comment: "",
            roomID: ""
        };
    },
    componentDidMount: function () {
        var self = this;
        //Прием от сервера ссылки на приглашение другого игрока
        socket.on('invite link', function (link) {
            console.log("Получена ссылка: "+link);
            socket.emit('link getted');
            //выводим ссылку на экран
            self.setState({
                shown: true,
                link: link,
                comment: "Ссылка: "
            });
        });

        //Обработка запроса сервера о передаче параметров url (url?params)
        socket.on('require url params', function () {
            console.log("Получен запрос require url params");
            socket.emit('url params', {href: window.location.href,
                params: window.location.search});
            console.log("window.location: ");
            console.log(window.location);
            console.log("Отправлено: ");
            console.log({href: window.location.href,
                params: window.location.search});
        });

        //Обработка сообщения сервера, если была попытка подключиться к комнате, которая занята
        socket.on('room is full', function () {
            console.log("Комната уже занята");

            self.setState({
                shown: true,
                link: "",
                comment: "Ошибка. Комната уже занята."
            });

        });

        //Обработка сообщения сервера, если была попытка подключиться к несуществующей комнате
        socket.on('game not found', function () {
            console.log("Игра не найдена");
            self.setState({
                shown: true,
                link: "",
                comment: "Ошибка. Игра не найдена. Проверьте правильность ссылки."
            });
        });

        socket.on('game status', function () {
            console.log("Игра началась");
            self.setState({
                shown: false
            });
        });

    },

    render: function(){
        var additionalInfo = "";
        if (this.state.link) {
          additionalInfo =
          <div>
            (скопируйте и отправьте сопернику, чтобы начать игру)
            <br/><br/>
            <b>Игра начнется автоматически</b>
            <br/><br/>
            Чтобы потом продолжить начатую игру, введите в адресную строку следующую ссылку:
            <br/>
            <b>{this.state.link}1</b>
            <br/>
            где цифра 1 в конце - ваш номер. У оппонента соответственно номер 2.
          </div>
        };
        if (this.state.shown) {
            return (
            <div>
              <h1>Добро пожаловать в сетевую игру "Крестики-нолики"!</h1>
              <br/>
              {this.state.comment}
              <br/>

              <h3>{this.state.link}</h3>

              {additionalInfo}

            </div>
          )
        }
        else return <div></div>
    }
});

module.exports = InviteLink;
