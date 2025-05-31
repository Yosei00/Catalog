using System.Web;
using System.Web.Optimization;
namespace Catalog
{
    public class BundleConfig
    {
        // Bundling の詳細については、http://go.microsoft.com/fwlink/?LinkId=254725 を参照してください
        public static void RegisterBundles(BundleCollection bundles)
        {
            // ******************** jquery ***********************
            // (基本) jquery
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/javascripts/jquery/jquery-2.1.3.js"));


            // ********************   angulrajs  *********************
            // (基本) angularjs 
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                       "~/javascripts/angular/angular.js",           // 本体
                       "~/javascripts/angular/angular-ui-router.js", // 
                       "~/javascripts/angular/angular-animate.js",   // 画面偏移のアニメーション
                       "~/javascripts/angular/angular-messges.js"    // 複数のエラーのうち1つを選んで表示
                       ));


            // (アプリ) 資料請求用
            bundles.Add(new ScriptBundle("~/bundles/catalog").Include(
            "~/Scripts/Siryou/siryouApp.js",
            "~/Scripts/Siryou/ioservice.js",
            "~/Scripts/Siryou/userModel_service.js"
            ));



            // 開発と学習には、Modernizr の開発バージョンを使用します。次に、実稼働の準備が
            // できたら、http://modernizr.com にあるビルド ツールを使用して、必要なテストのみを選択します。
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));


            // bootstrap3 基本設定 
            bundles.Add(new StyleBundle("~/bootstrap.scss").Include("~/stylesheets/bootstrap.css"));


            // 資料請求ページ css
            bundles.Add(new StyleBundle("~/catarogstyle.scss").Include("~/stylesheets/catalogstyle.css"));

            
        }
    }
}