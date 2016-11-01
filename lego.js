'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var fiendsList = collection ? collection.slice() : [];
    [].slice.call(arguments, 1)
    .sort(function (a, b) {
        return compare(a.name, b.name);
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

    return function func3(collection) {
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
    return function func1(collection) {
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
    return function func2(collection) {
        if (order === 'asc') {
            return collection.sort(function (a, b) {
                return compare(a[property], b[property]);
            });
        }

        return collection.sort(function (a, b) {
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
    return function func4(collection) {
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
    return function func5(collection) {
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

        return function func0(collection) {
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

        return function func0(collection) {
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
    if (Object.keys(obj).indexOf(key) !== -1) {
        return true;
    }

    return false;
}
