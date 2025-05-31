// create our angular app and inject ngAnimate and ui-router 
// =============================================================================



var formApp = angular.module('formApp', ['ngAnimate', 'ui.router', 'ngMessages', 'FormContorollers', 'services', 'ngProgress', 'angulartics', 'angulartics.google.analytics'])

// configuring our routes   , 'services'
// =============================================================================
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('form', {
            url: '/form',
            templateUrl: 'Home/form',
            controller: 'formController',
            isLoginRequired: false
        })
        .state('form.input', {
            url: '/input',
            templateUrl: 'Home/formInput',
            isLoginRequired: true
        })

        .state('form.privacypolicy', {
            url: '/privacypolicy',
            templateUrl: 'Home/privacypolicy',
            isLoginRequired: true
        })


        .state('form.confirmation', {
            url: '/confirmation',
            templateUrl: 'Home/formConfirmation',
            isLoginRequired: true
        });

    $urlRouterProvider.otherwise('/form/input');
});

//ステートが変わったときに権限チェックする

formApp.run(['$rootScope', '$state', 'UserModel',
function ($rootScope, $state, UserModel) {
    
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {

        if (toState.name == "form.input") {

        }else if (toState.name == 'form.confirmation') {//資料選択がまだなら　偏移を　selection に移動させる

            if (!UserModel.getInputflag()) {
                if (fromState.name == 'form.input' || fromState.name == 'form.privacypolicy') {

                    if (fromState.name == 'form.input') {
                        $state.go('form.input');
                        e.preventDefault();

                    } else {
                        $state.go('form.privacypolicy');
                        e.preventDefault();
                    }

                } else {
                    $state.go('form.input');
                    e.preventDefault();
                } 

            } 
        } 

       

        //}

           
    });
    $rootScope.$on("$stateChangeSuccess", function () {
        $rootScope.$emit("$routeChangeSuccess")
    });
    $rootScope.$on("$routeChangeSuccess", function () {
        // ga('send', 'pageview'); // angulartics.google.analytics使用時は必要無い
        async_load();
    });


    }]);



// our controller for the form
// =============================================================================
var FormContorollers = angular.module('FormContorollers', []);

FormContorollers.controller('formController', ['$scope', '$http', '$rootScope', '$location', '$window', 'ioservice', '$timeout', 'UserModel', '$state', 'ngProgressFactory', function ($scope, $http, $rootScope, $location, $window, ioservice, $timeout, UserModel, $state, ngProgressFactory) {

    $scope.formData = {};// 入力データの受け取り用　オブジェクト
    $scope.metaData = {};// 内部設定用　オブジェクト

    $scope.metaData.PrefectureList = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];

    // **********************************************   選択表示項目　設定
    // 請求資料の保存時に使用するデータ配列 未使用
    var siryouArray = ["よりよく生きる 終活カタログ", "永代供養・納骨堂「おきなわ霊廟」", "永代供養・海洋散骨「美ら海」", "宮古島メモリアルパーク・総合カタログ", "石垣メモリアルパーク・総合カタログ", "事業案内", "自分らしいエンディングレシピ", "改葬・墓じまいケースタディ ", "ロケーションガイド", "メモリアルノート", "結-永代供養家族墓", "花想-永代供養樹木葬", "位牌永代供養","墓じまい・改葬供養"];
    // パンフレット請求時に使う　保存用兼　表示用
    //$scope.metaData.panh_a = ["名護やんばるメモリアルパーク", "具志川メモリアルパーク", "中城メモリアルパーク", "大里メモリアルパーク", "宮古島メモリアルパーク", "石垣メモリアルパーク"];
    // 現状　3か所
    $scope.metaData.panh_a = [ "具志川メモリアルパーク", "中城メモリアルパーク", "大里メモリアルパーク"];

//$scope.metaData.panh_b = ["（名護市）", "（うるま市）", "（中城村）", "（南城市）", "（宮古島市）", "（石垣市）"];

    // 現状　3か所
    $scope.metaData.panh_b = ["（うるま市）", "（中城村）", "（南城市）"];
    // 資料選択ページでの最初の質問事項
    //$scope.metaData.quesiton = ["沖縄県内でのお墓の建立について", "「おきなわ霊廟」の永代供養について", "海洋葬「美ら海」について", "墓じまい・改葬サービスについて", "仏壇や位牌の供養について", "エンディングノートや終活全般の事について"];

    $scope.metaData.quesiton = ["お墓の新規建立", "海洋散骨", "位牌の永代供養・仏壇じまい", "遺骨の永代供養", "樹木葬・期限付墓", "お墓の引越し（改葬）・墓じまい", "生前契約","ご見学・ご相談希望"];

    $scope.metaData.targetList = ["ご自身", "親", "兄弟/姉妹", "配偶者", "子", "その他親族"];
    // フォームデータ　オブジェクトの初期化
    
    $scope.formData.siryou = [];//　請求資料 選択が配列の真偽値で入る
    $scope.metaData.siryouAr = [];// 請求資料の名前一覧を保存し、確認で表示する際に使う
    $scope.metaData.zipflag = true;
    $scope.metaData.phoneflag = true;
    $scope.formData.genders = "男性";
    $scope.formData.ages = "20代";
    $scope.formData.Prefecture = null;
    $scope.metaData.quest = "";
    $scope.formData.situmon = [];// 最初の質問　選択が配列に真偽値で入る
    $scope.metaData.kysaviceAr = [];//興味のあるサービス質問、確認で表示する際に使う

    $scope.formData.target ="ご自身";

    $scope.formData.pasonalinfo = false;//個人情報保護　初期値
    $scope.formData.panh = [];// 請求パンフレット 選択が配列の真偽値で入る
    $scope.formData.infome = "同意する";
    $scope.formData.comment = "";
    UserModel.setSeleflag(true);//資料選択するまで止める
    $scope.metaData.selectflag = true;// 資料請求　状態
    $scope.metaData.moveok = true;//  上部偏移ボタンで使用

    $scope.metaData.hidenflag = ""; // 個人情報入力がOKのときに値が入る

    $scope.progressbar = ngProgressFactory.createInstance();//保存中に使うプログレスバー

    // リファラー処理　どのサイトから来たのかを覚えておく
    var ref = document.referrer;
   // ref = "http://localhost:55835/";
    $scope.metaData.referrer = ref;
    var regFrist = /^http:\/\//i;
    $scope.metaData.returnCD = 0;
    var jyouhou = ['ネット 整備協会', 'ネット おきなわ霊廟'];// customer 情報取得方法 の候補
    var found = ref.match(regFrist);
    // referroer が http://で始まっているかチェック
    if (found) {
        // ここが増える
        //alert(found);
            var newRef = ref.replace(regFrist, "");
            var ii = 11;
            $scope.metaData.testrerrer = newRef;
           var regOkinawa = /^www.oki-reibyou.jp\//i;// おきなわ霊廟 マッチ
          //  var regOkinawa = /^localhost:55835\//i;// テスト用 マッチ
           var regHakajimai = /^www.kaisou-kuyou.jp\//i; // おきなわの墓じまい
            var regMemorial = /^oki-memorial.org\//i;// メモリアル整備協会 マッチ
            var regSyukatu = /^syukatsu.jp.net\//;// 沖縄で終活　マッチ
            if (newRef.match(regOkinawa)) {

                $scope.metaData.returnCD = 1;// おきなわ霊廟からのリンクなら　1 

            } else if (newRef.match(regMemorial)) {
                $scope.metaData.returnCD = 0;// メモリアル整備協会からのリンクなら　0 
            } else if (newRef.match(regHakajimai)) {
                $scope.metaData.returnCD = 2;
            }else if(newRef.match(regSyukatu)){
                $scope.metaData.returnCD = 3;
            }


    }


    switch ($scope.metaData.returnCD) {
        case 0:
            $scope.metaData.linkURL = "https://oki-memorial.org/";
            break;
        case 1:
            $scope.metaData.linkURL = "http://www.oki-reibyou.jp/";
            break;
        case 2:
            $scope.metaData.linkURL = "http://www.kaisou-kuyou.jp/";
            break;
        case 3:
            $scope.metaData.linkURL = "http://syukatsu.jp.net/";
            break;
    }
    $scope.returnlink = $scope.metaData.linkURL;

    //興味のあるサービス変更イベント
    $scope.kysaviceCn = function (setNo) {

        $scope.inputForm.quest.$touched = true;
        $scope.metaData.quest = "";
        // 確認画面で表示するために、興味のあるサービスの名前を　表示用配列に格納する
        $scope.metaData.kysaviceAr = [];
        var i = 0;
        for (var key in $scope.formData.situmon) {
            if ($scope.formData.situmon[key]) {
                $scope.metaData.kysaviceAr[i] = $scope.metaData.quesiton[key];
                i++;
            }
        }
        for (var x in $scope.metaData.kysaviceAr) {
            $scope.metaData.quest += $scope.metaData.kysaviceAr[x];
        }
        $scope.metaData.quest.$touched = true;

    }




    //請求資料 選択変更イベント
    $scope.siryoCn = function () {

        // 確認画面で表示するために、選択された資料の名前を　表示用配列に格納する
        $scope.metaData.siryouAr = [];
        var arrData = $scope.formData.siryou;
        var i = 0
        for(var key in arrData){
            if(arrData[key]){
                $scope.metaData.siryouAr[i] = siryouArray[key];
                i++;
            }
        }
        var arrData2 = $scope.formData.panh;
        for (var key in arrData2) {
            if (arrData2[key]) {
                $scope.metaData.siryouAr[i] = $scope.metaData.panh_a[key];
                i++;
            }
        }


        if (i > 0) {
            UserModel.setSeleflag(true);
            $scope.metaData.selectflag = false;// 資料請求　状態
            $scope.metaData.moveok = true;//  上部偏移ボタンで使用

        } else {
            UserModel.setSeleflag(false);
            $scope.metaData.selectflag = true;// 資料請求　状態
            $scope.metaData.moveok = false;//  上部偏移ボタンで使用

        }

    }

    $scope.jikkou = false;
   
    // 資料請求情報を保存
    $scope.saveNewRequest = function () {
        // 二重書き込みを禁止する
        if ($scope.jikkou)
            return;
        $scope.jikkou = true;

        $scope.progressbar.start();//プログレスバー 開始
        //　保存処理  
        var customerData = {};
        customerData["資料発送日"] = new Date(9999, 11, 31);// 9999-12-31 は未発送の意味
        customerData["state"] = 1;
        customerData["entry_id"] = 999;
        customerData["update_id"] = 999;
        customerData["customer_name"] = $scope.formData.username;
        customerData["customer_yomi"] = $scope.formData.namekana;
        customerData["customer_c9"] = $scope.formData.genders;
        customerData["type"] = 0;
        customerData["partner_type"] = 0;
        customerData["lead_type"] = 1;
        customerData["spare_type"] = 0;
        customerData["parent_id"] = 0;
        customerData["customer_d2"] = false; //郵送不要

        customerData["customer_d6"] = true; // 郵送先指定

        customerData["customer_zip"] = $scope.formData.zip;
        customerData["customer_address"] = $scope.formData.Prefecture + $scope.formData.city + $scope.formData.StreetName;
        if (!customerData["customer_address"]) {
            customerData["customer_address"] = "未記入";
        }
        customerData["customer_house"] = $scope.formData.address2;
        
        
        customerData["customer_d8"] = "インターネット";//customer_d8 情報経路1
        customerData["customer_d9"] = "財団HP資料請求";//customer_d9 情報経路2
       
        customerData["customer_phone"] = $scope.formData.phone;
        customerData["customer_d4"] = "";


        customerData["customer_mail"] = $scope.formData.email;

        customerData["情報取得方法"] = "ネット資料請求";
        customerData["年代"] = $scope.formData.ages;

        customerData["姓"] = $scope.formData.username_sei;
        customerData["名"] = $scope.formData.username_mei;

        customerData["セイ"] = $scope.formData.namekana_sei;
        customerData["メイ"] = $scope.formData.namekana_mei;

        customerData["都道府県"] = $scope.formData.Prefecture;
        customerData["市区町村"] = $scope.formData.city;
        customerData["町名番地"] = $scope.formData.StreetName;
        // 請求資料
        var toiawaseData = {};
        var nowDate = new Date();
        var memo_value = GetMemoValue();
        customerData["memo"] = memo_value;

        toiawaseData["年代"] = $scope.formData.ages;
        toiawaseData["情報源"] = "財団HP";
        toiawaseData["state"] = 1;
        toiawaseData["update_id"] = 999;
        toiawaseData["subparent_id"] = 0;
        toiawaseData["subparent_name"] = "";
        toiawaseData["subparent_suffix"] = "";
        toiawaseData["相談内容"] = "";
        toiawaseData["備考"] = "";
        var jyohousyutoku = ["メール", "メール（霊廟サイト）", "メール（墓じまい）", "メール（沖縄で終活）"];
        toiawaseData["情報取得"] = jyohousyutoku[$scope.metaData.returnCD];
        toiawaseData["お問合せ霊園"] = "";

        ioservice.newCustomer(customerData, toiawaseData).then(queryComplert);

        //$scope.pardot();
    }

    function GetMemoValue() {
        var nowDate = new Date();

        var memo_value = nowDate.getFullYear() + "/" + (("0" + (nowDate.getMonth() + 1)).slice(-2)) + "/" + (("0" + nowDate.getDate()).slice(-2)) + " web資料請求　- 顧客回答\n";
        memo_value += "興味のあるサービス\n";
        var first = true;
        // 最初の質問をまとめて文字列にする
        for (var key in $scope.formData.situmon) {
            if ($scope.formData.situmon[key] == true) {
                if (!first)
                    memo_value += "\n";
                memo_value += $scope.metaData.quesiton[key];
                first = false;

            }
        }
        if (first)
            memo_value += "未回答\n";

        // 請求資料をまとめて文字列に加える
        first = true;
        memo_value += "\nどなたの為の資料\n"
        memo_value += $scope.formData.target;

        if ($scope.formData.question && $scope.formData.question != "") {
            memo_value += "\n********** 相談内容 **********";
            memo_value += "\n" + $scope.formData.question;
        }
        return memo_value;
    }


    // 保存待機　ご完了画面へ偏移
    function queryComplert(data) {
        
        var nflag = true;
        var wait = function () {
            $timeout(function () {
            }, 500);
        };
        for (var i = 0; i < 20 && nflag; i++) {

            wait();
            if (data) {
                nflag = false;
                if (data == 1) {//保存成功
                    $scope.progressbar.complete();// プログレスバー完了


                    ///  ↓↓↓↓↓↓↓↓　　重要 テスト中はB 本場環境では　Aにする事　　↓↓↓↓↓↓↓↓↓

                    SendPardot(); /// A

                    //$window.location.href = "../gratitude?id=" + $scope.metaData.returnCD;// B

                    ///  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑



                } else {// 保存失敗
                    $scope.progressbar.complete();// プログレスバー完了
                    $window.location.href = "../error";//エラーページを作る
                }

            }
        }
        $scope.jikkou = false;
    }
    // フォーカスアウトイベント　受け取り
    $scope.metaData.postC1 = "";// 郵便番号の前半が入る　jpostl に渡す為
    $scope.metaData.postC2 = "";// 郵便番号の後半が入る
  
    //　ng-click  住所検索用apiにデータを渡す、隠しinput要素に挿入
    $scope.addsrach = function () {
        $scope.metaData.postcode1 = $scope.metaData.postC1;
        $scope.metaData.postcode2 = $scope.metaData.postC2;
        JpostlCallbackEventFlag = true;
    }

    //　上部ナビゲーションや 進むリンクを　クリック  必須条件を確認し未記入なら、フラグで管理する
    $scope.selectEvent = function (data) {
        $scope.metaData.selectflag = true; // 旧仕様の残り

            if ($state.current.name == 'form.input') {
            formInputTouched();// エラー状態を表示
            UserModel.setInputViewCountFlag(true);//一度でもinput から進もうとした　falg
            if ($scope.inputForm.$invalid == true) {// 入力規則違反がある場合
                $scope.metaData.hidenflag = "";
                UserModel.setInputflag(false);
            } else {
                $scope.metaData.hidenflag = "ok";
                UserModel.setInputflag(true);
            }
            $scope.formData.comment = GetMemoValue();
            $scope.pardot();
        }
    }
    // 送付先情報の入力フォームを全て操作済みにする（エラー状態を表示する）
    function formInputTouched() {
        $scope.inputForm.username.$touched = true;
        $scope.inputForm.namekana.$touched = true;
        $scope.inputForm.zip.$touched = true;
        //   $scope.inputForm.address.$touched = true;
        $scope.inputForm.Prefecture.$touched = true;
        $scope.inputForm.city.$touched = true;
        $scope.inputForm.StreetName.$touched = true;

        $scope.inputForm.quest.$touched = true;

        $scope.inputForm.address2.$touched = true;
        $scope.inputForm.phone.$touched = true;
        $scope.inputForm.email.$touched = true;
        $scope.inputForm.pasonalinfo.$touched = true;
        //$scope.inputForm.email2.$touched = true;
    }
    
    $scope.nameInputEvent = function () {
        var sei = $scope.formData.username_sei || "";
        var mei = $scope.formData.username_mei || "";
        if (sei.length > 0 && mei.length > 0) {
            $scope.formData.username = sei + "　" + mei;
        } else {
            $scope.formData.username = "";
        }
    }
    $scope.namekanaInputEvent = function () {
        var sei = $scope.formData.namekana_sei || "";
        var mei = $scope.formData.namekana_mei || "";
        if (sei.length > 0 && mei.length > 0) {
            $scope.formData.namekana = sei + "　" + mei;
        } else {
            $scope.formData.namekana = "";
        }
    }
    $scope.pardot = function () {

        var parameter = {};

        $("#pname_sei").val($scope.formData.username_sei);

        $("#pname_sei").val($scope.formData.username_sei);
        $("#pname_mei").val($scope.formData.username_mei);
        $("#kana_sei").val($scope.formData.namekana_sei);

        $("#kana_mei").val($scope.formData.namekana_mei);
        $("#sex").val($scope.formData.genders);
        $("#age").val($scope.formData.ages);
        $("#tel").val($scope.formData.phone);
        $("#mail").val($scope.formData.email);
        $("#zipcode").val($scope.formData.zip);
        $("#pref").val($scope.formData.Prefecture);
        $("#citys").val($scope.formData.city);
        $("#address").val($scope.formData.StreetName);
        $("#house").val($scope.formData.address2);
        $("#comment").val($scope.formData.comment);

        $("#returnId").val($scope.metaData.returnCD);

        //$("#success_location").val("http://memorial-churaumi.azurewebsites.net/gratitude?id=" + $scope.metaData.returnCD);
      //  ioservice.pardotPost(parameter).then(pardotComplert);




        /*
        var params = {sleep: 3};
        var config = {
            params: params, timeout: 1500
        };

        $http({
            method: 'POST',
            url: 'http://localhost/test.php',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            transformRequest: transform,
            data: parameter
        }).success(function (data, status, headers, config) {
            $scope.postCallTimeoutResult = logResult("POST SUCCESS", data, status, headers, config);
            console.log("コネクションOK");
            console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.postCallTimeoutResult = logResult("POST ERROR", data, status, headers, config);
            console.log("コネクション失敗");
        });
        */
    }

    function pardotComplert(data) {

        var nflag = true;
        var wait = function () {
            $timeout(function () {
            }, 200);
        };
        for (var i = 0; i < 20 && nflag; i++) {

            wait();
            if (data) {
                nflag = false;
                if (data == 1) {
                    console.log("コネクションOK");
                    console.log(data);
                } else {
                    console.log("コネクション失敗");
                }

            }
        }

        ioservice.newCustomer($scope.SaveDatas.customerData, $scope.SaveDatas.toiawaseData).then(queryComplert);

    }


}]);
function SendPardot() {
    document.getElementById("pform").submit();
    //  $('#pform').submit();
}

// ディレクティブ 郵便番号から住所を検索　google api jpostal を使用
// input タグにつけたIDをダイレクトに指定しているので、再利用する際は注意
formApp.directive('zipDirective',['$timeout', function ($timeout) {
    
    return {
        restrict: 'A',
        
        link: function (scope, elm, attrs) {
         //   console.log(attrs);
            // elm[0].addEventListener("click", function () {
            var element = elm[0];
            scope.$watch(function () { return element.value }, function () {
                    $('#postcode1').jpostal({
                        postcode: [
                            "#postcode1",
                            "#postcode2"
                        ],
                        address: {
                            '#Prefecture': '%3',
                            
                            '#city': '%4',

                            '#streetname': '%5'

                        }

                    }, function () {
                        $timeout(function () {
                            var result = CallBackMethod();
                            // alert(result);
                            if (JpostlCallbackEventFlag && result[1].length > 0 && (scope.formData.StreetName != result[0] || scope.formData.city != result[1])) {

                                scope.formData.StreetName = result[0];
                                scope.formData.city = $("#city").val();
                                scope.formData.Prefecture = $("#Prefecture").val();
                                JpostlCallbackEventFlag = false;
                            }
                        },1000);
                       
                    });
                    $('#postcode1').change();


            });
          //  })

        }
    };
}]);
var JpostlCallbackEventFlag = false;
function CallBackMethod() {
    return [$('#streetname').val(),$('#city').val()];
}


// メールアドレス 比較用　デレクティブ
formApp.directive('mailcompDirective', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var element = elm[0];
            scope.$watch(function (){ return element.value },function(){

                //メールアドレス再入力のチェック　文字入力後1秒後に判定処理を行う
                var email2stop;
                $timeout.cancel(email2stop);      // 続けて入力があれば、前の処理を取りやめる
                email2stop = $timeout(function () {
                    if (scope.formData.email == scope.formData.email2) {//確認用メールが同じなら　$error と $invalid を解除する
                        scope.inputForm.email2.$error.orError = false;
                        if (scope.inputForm.email2.$error.required != true && scope.inputForm.email2.$error.email != true)
                        scope.inputForm.email2.$invalid = false;//
                    } else {
                        scope.inputForm.email2.$error.orError = true;
                        scope.inputForm.email2.$invalid = true;
                        if (scope.inputForm.email2.$viewValue) {//値が何かあるならこの時点で操作済みとする
                            scope.inputForm.email2.$touched = true;
                        }

                    }
                }, 1000);

            });

        }

    }
}]);
// 全角を半角に変換する
formApp.directive('convertmToascii', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.on('change', function () {
                if (typeof (this.value) != "string") return false;
                var word = this.value;
                word = word.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
                // ng-model への反映(これがないとフォームの値だけ更新され、ng-modelの値は更新されない)
                if (ngModel != null) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(word);
                    });
                }
                this.value = word;
            });
        }
    };
});
//　電話番号の入力ディレクティブ
formApp.directive('phoneCustomDirective', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.on('change', function(){
                if(typeof(this.value)!="string") return false;
                var word = this.value;
                word = word.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);    
                });
                var oldWord = word;
                word = word.replace(/[^0-9]/g, '');//いったん数字以外を取り除く
                var chekf = word.substring(0,1);
                if (word.length >= 10 && word.length <= 11 && chekf == '0') {// 数字のみで1０か11なら
                    if(word.length == 11){// 11ケタの場合 
                        var topNum = word.substring(0, 3);
                       // if(topNum == '070' || topNum == '080' || topNum == '090'){
                            var secondNum = word.substring(3, 7);
                            var thirdNum = word.substring(7, 11);
                            word = topNum + "-" + secondNum + "-" + thirdNum;
                       // }
                    } else {
                        var topNum = word.substring(0, 2);
                        if(topNum == '03' || topNum == '06'){// 東京と大阪は2-4-4
                            var secondNum = word.substring(2, 6);
                            var thirdNum = word.substring(6, 10);
                            word = topNum + "-" + secondNum + "-" + thirdNum;
                        } else {
                            topNum = word.substring(0, 3);
                            var secondNum = word.substring(3, 6);
                            var thirdNum = word.substring(6, 10);
                            word = topNum + "-" + secondNum + "-" + thirdNum;
                        }
                    }
                    scope.metaData.phoneflag = false;
                    scope.inputForm.phone.$invalid = false;
                    scope.inputForm.phone.$error = {};
                    scope.inputForm.phone.$touched = true;

                } else {
                    word = oldWord;
                    scope.metaData.phoneflag = true;
                    scope.inputForm.phone.$invalid = true;
                    scope.inputForm.phone.$touched = true;
                    scope.inputForm.phone.$error = {};
                    scope.inputForm.phone.$error.orError = true;

                    scope.inputForm.phone.$invalid = true;
                    scope.inputForm.$invalid = true;
                }

                // ng-model への反映(これがないとフォームの値だけ更新され、ng-modelの値は更新されない)
                if (ngModel != null) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(word);
                    });
                }
                this.value = word;
            });
        }
    };
})
//郵便番号 に成っているか確認
formApp.directive('zipmatchDirective', function () {
    // 全角英数字を半角英数字に置き換える機能を　string 型に追加
    String.prototype.toOneByteAlphaNumeric = function () {
        return this.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, ele, attrs, ngModel) {
            var element = ele[0];
            scope.$watch(function (){ return element.value },function(){
                if (typeof (element.value) != "string") return false;
                if (element.value == "") return false;
                var data = element.value.toOneByteAlphaNumeric();//値を半角に変換
                var oldData = data;
                var str = data.replace(/[^0-9]/g, '');//いったん数字以外を取り除く
                data = str;

                if (data.length != 7) {//７桁以外は郵便番号ではないのでエラーに
                    data = oldData;
                    scope.inputForm.zip.$error = {};
                    scope.inputForm.zip.$error.orError = true;
                    scope.metaData.zipflag = true;
                    scope.inputForm.zip.$invalid = true;
                    scope.inputForm.zip.$touched = true;
                    scope.inputForm.$invalid = true;
                    scope.metaData.postC1 = "";
                    scope.metaData.postC2 = "";
                    scope.formData.zip = data;

                } else {//郵便番号形式なら postC1 と postC2 に値を入れて OK に
                    scope.inputForm.zip.$touched = true;
                    scope.inputForm.zip.$error = {};
                    scope.inputForm.zip.$invalid = false;
                    var str1 = data.substring(0, 3);
                    var str2 = data.substring(3, 8);
                    data = str1 + '-' + str2;
                    scope.metaData.zipflag = false;
                    scope.metaData.postC1 = str1;
                    scope.metaData.postC2 = str2;
                    scope.formData.zip = data;

                }
            });

        }

    }


});
formApp.filter('lineBreak', function ($sce) {
    return function (input, exp) {
        input = (input) ? input : " ";
        var replacedHtml = input.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return $sce.trustAsHtml(replacedHtml.replace(/\n|\r/g, '<br>'));
    };
});