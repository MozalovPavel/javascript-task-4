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
    var fiendsList = collection ? collection.slice() : [];

    return [].slice.call(arguments, 1)
    .sort(function (a, b) {
        return compare(
            FUNCTION_PRIORITY.indexOf(a.name), FUNCTION_PRIORITY.indexOf(b.name)
        );
    })
    .reduce(function (acc, func) {
        return func(acc);
    }, fiendsList);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var propertys = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (item) {
            return propertys.filter(function (property) {
                return item.hasOwnProperty(property);
            })
            .reduce(function (acc, property) {
                acc[property] = item[property];

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
            return values.indexOf(item[property]) !== -1;
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
            if (item.hasOwnProperty(property)) {
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
            return collection.filter(function (item) {
                return functions.some(function (func) {
                    return func(collection).indexOf(item) !== -1;
                });
            });
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
            return functions.reduce(function (acc, func) {
                return func(acc);
            }, collection);
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
