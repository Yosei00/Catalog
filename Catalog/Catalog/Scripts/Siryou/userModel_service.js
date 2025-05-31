angular.module('services', [])
.service('UserModel', [
    '$q',
    '$state',
    function ($q, $state) {

        var self = this;
        var _delayFlag = false;
        var _data = null;
        var _seleflag = null;
        var _inputflag = null;
        var _inputViewCountFlag = false;

        this.setUser = function (data) {
            _data = data;
        };

        this.getUser = function () {
            return _data;
        };

        this.setSeleflag = function (data) {
            _seleflag = data;
        };

        this.getSeleflag = function () {
            return _seleflag;
        };

        this.setInputflag = function (data) {
            _inputflag = data;
        };

        this.getInputflag = function () {
            return _inputflag;
        };

        this.setDelayFlag = function (data) {
            _delayFlag = data;
        }

        this.getDelayFlag = function () {
            return _delayFlag;
        }

        this.setInputViewCountFlag = function (data) {
            _inputViewCountFlag = data;
        }

        this.getInputViewCountFlag = function () {
            return _inputViewCountFlag;
        }

    }
]);