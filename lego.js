'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;
var FUNCTION_PRIORITY = [
    'add',
    'or',
    'filterIn',
    'sortBy',
    'select',
    'format',
    'limit'
];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    // var fiendsList = collection.slice();
    var fiendsList = JSON.parse(JSON.stringify(collection));
    [].slice.call(arguments, 1)
    .sort(function (a, b) {
        return compare(
            FUNCTION_PRIORITY.indexOf(a.name), FUNCTION_PRIORITY.indexOf(b.name)
        );
    })
    .forEach(function (func) {
        fiendsList = func(fiendsList);
    });

    return fiendsList;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var args = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (item) {
            return args.filter(function (arg) {
                return isKey(item, arg);
            })
            .reduce(function (acc, arg) {
                acc[arg] = item[arg];

                return acc;
            }, {});
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (item) {
            return values.some(function (value) {
                return item[property] === value;
            });
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (a, b) {
            if (order === 'asc') {
                return compare(a[property], b[property]);
            }

            return compare(b[property], a[property]);
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (item) {
            if (isKey(item, property)) {
                item[property] = formatter(item[property]);
            }

            return item;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.or = function () {
        var functions = [].slice.call(arguments);

        return function or(collection) {
            var filtredCollection = [];
            functions.forEach(function (func) {
                filtredCollection = filtredCollection.concat(func(collection));
            });

            return filtredCollection;
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.and = function () {
        var functions = [].slice.call(arguments);

        return function and(collection) {
            var filtredCollection = collection.slice();
            functions.forEach(function (func) {
                filtredCollection = func(filtredCollection);
            });

            return filtredCollection;
        };
    };
}
function compare(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }

    return 0;
}
function isKey(obj, key) {
    return Object.keys(obj).indexOf(key) !== -1;
}
