/**
 * Класс для логирования в консоль из кода
 */
const config = require("config");

class Log {    
    /**
     * Конструктор логера
     * @param string name   Имя класса или модуля от куда производится вывод в консоль
     */
    constructor(name = 'Log') {
        this.name       = name;
        /** подключаем библиотеку окраски текста в консоли */
        this.clc        = require("cli-color");
        /** назначаем типовые цвета  */
        this.error      = this.clc.red.bold;
        this.warn       = this.clc.yellow;
        this.notice     = this.clc.blue;
        /** Если в конфиге логирование включено то делаем доступные сообщения в консоль */
        config.get('log.console') == 'true' ? this.enable = true : false;
    }
    
    w(...args) {
        if (this.enable) {
            console.log(this.warn(args));
        }
    }

    d(method, ...args) {
        if (this.enable) {
            if (args.length) {
                console.log(this.clc.greenBright(this.name) + method, args);
            } else {
                console.log(this.clc.greenBright(this.name) + method);
            }
        }
    }

    green(args) {
        if (this.enable) {
            console.log(this.clc.greenBright(args));
        }
    }

    red(args) {
        if (this.enable) {
            console.log(this.clc.red(args));
        }
    }
}

module.exports = Log;