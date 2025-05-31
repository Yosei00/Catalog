/*
 breezeを使用するデータI/Oを行うサービス
*/
(function () {

    angular.module('formApp').factory('ioservice', ['$http', '$q', '$timeout', ioservice]);

    function ioservice($http, $q, $timeout) { //定義の始まり

   

        ///*********  サービスオブジェクトを定義する 手順 1 ***************/

        var service = {
            newCustomer: newCustomer,
            pardotPost: pardotPost
        };
        return service;　//ｻｰﾋﾞｽを返す


        ///*************  query を実装する  手順 2 *********************/

     
      
        ////Customerｵﾌﾞｼﾞｪｸﾄを作成する｡
        function newCustomer(customerData, toiawaseData) {
            var url = "Home/SaveCustomer";
           return $http.post(url, customerData).then(function (response) {
               if (response.data.state == 1) {
                   toiawaseData["parent_id"] = response.data.id;
                    var url2 = "Home/SaveRireki";
                  return  $http.post(url2, toiawaseData).then(function (response2) {
                        if (response2.data == "OK") {
                            return 1;
                        } else {
                            return 2;
                        }
                        

                    });


                    
                    

                } else {
                    return response.data.state;
                }
            });

        }

        function pardotPost(parameter) {
            var config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                transformRequest: function (data) {
                    var transStr;
                    if (data) {
                        for (var key in data) {
                            if (transStr) {
                                transStr += '&' + key + '=' + data[key];
                            } else {
                                transStr = key + '=' + data[key];
                            }
                        }
                    }
                    return transStr;
                }
            };
            var url = "https://go.pardot.com/l/288172/2017-01-22/wrz";
            return $http.post(url, parameter, config).then(function (response) {
                if (response.data.state == 1) {
                    return response.data.state;

                } else {
                    return response.data.state;
                }
            });

        }

  
     
    } //functionの終り

})(); //自動実行するように無名関数にする