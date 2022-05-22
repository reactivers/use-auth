'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var useLocalStorage = require('@reactivers/use-local-storage');
var react = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var AuthContext = react.createContext({});
var AuthProvider = function (_a) {
    var _b = _a.authTokenKeyName, authTokenKeyName = _b === void 0 ? 'token' : _b, _c = _a.localStorageTokenKeyName, localStorageTokenKeyName = _c === void 0 ? "token" : _c, _user = _a.user, _onLogin = _a.onLogin, _onLogout = _a.onLogout, initialCheckToken = _a.initialCheckToken, children = _a.children;
    var _d = react.useState(_user), user = _d[0], setUser = _d[1];
    var _e = useLocalStorage.useLocalStorage(localStorageTokenKeyName), getItem = _e.getItem, removeItem = _e.removeItem, setItem = _e.setItem;
    var onLogin = react.useCallback(function (info) {
        var oldToken = getItem();
        var newToken = info[authTokenKeyName];
        if (!oldToken || !!newToken) {
            setItem(newToken);
        }
        var newUser = __assign({ token: newToken || oldToken }, (info || {}));
        setUser(__assign(__assign({}, newUser), { isLoggedIn: true }));
        if (_onLogin)
            _onLogin(info);
    }, [_onLogin, authTokenKeyName]);
    var onLogout = react.useCallback(function () {
        setUser({
            isLoggedIn: false,
        });
        removeItem();
        if (_onLogout)
            _onLogout();
    }, [_onLogout]);
    var setToken = react.useCallback(function (token) {
        if (token === undefined) {
            setUser(function (old) { return (__assign(__assign({}, old), { isLoggedIn: false, token: undefined })); });
            removeItem();
        }
        else {
            setUser(function (old) { return (__assign(__assign({}, old), { token: token })); });
            setItem(token);
        }
    }, []);
    react.useEffect(function () {
        if (initialCheckToken) {
            var oldToken = getItem();
            if (oldToken) {
                setToken(oldToken);
            }
        }
    }, [initialCheckToken, setToken]);
    return (jsxRuntime.jsx(AuthContext.Provider, __assign({ value: {
            localStorageTokenKeyName: localStorageTokenKeyName,
            user: user,
            setUser: setUser,
            setToken: setToken,
            onLogin: onLogin,
            onLogout: onLogout
        } }, { children: children })));
};
var useAuthContext = function () {
    var context = react.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthContext.Provider');
    }
    return context;
};
AuthProvider.defaultProps = {
    localStorageTokenKeyName: "token",
    authTokenKeyName: "token",
    user: { isLoggedIn: false },
    initialCheckToken: true,
};

var useAuth = function () {
    var _a = useAuthContext(), onLogout = _a.onLogout, onLogin = _a.onLogin, setToken = _a.setToken, setUser = _a.setUser, contextUser = _a.user;
    var isLoggedIn = contextUser.isLoggedIn, user = __rest(contextUser, ["isLoggedIn"]);
    var token = user.token;
    var logout = react.useCallback(function () {
        onLogout();
    }, [onLogout]);
    var login = react.useCallback(function (data) {
        onLogin(data);
    }, [onLogin]);
    return {
        setToken: setToken,
        login: login,
        logout: logout,
        setUser: setUser,
        user: contextUser,
        isLoggedIn: isLoggedIn,
        token: token
    };
};

exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
