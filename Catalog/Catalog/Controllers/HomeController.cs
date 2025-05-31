using System;
using System.Collections.Generic;
using System.Linq;
using Catalog.Models;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Mail;
using SendGrid;
using System.IO;
using System.Text;

namespace Catalog.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "資料請求・お問い合せ-沖縄メモリアル整備協会";
            return View();
        }

        // 請求終了画面
        public ActionResult SiryouSeikyuEnd(string id)
        {
            ViewBag.Title = "資料請求完了-沖縄県メモリアル整備協会";
            string[] data = { "沖縄県メモリアル整備協会", "おきなわ霊廟", "おきなわで墓じまい", "沖縄で終活" };
            string[] url = { "https://oki-memorial.org/", "http://www.oki-reibyou.jp/", "http://www.kaisou-kuyou.jp/", "http://syukatsu.jp.net/" };
            try
            {
                ViewBag.Rerrer = data[int.Parse(id)];
                ViewBag.url = url[int.Parse(id)];
            }
            catch
            {
                ViewBag.Rerrer = data[0];
                ViewBag.url = url[0];
            }
            return View("SiryouSeikyuEnd", null);
        }

        // 請求エラー画面
        public ActionResult SiryouSeikyuError()
        {
            ViewBag.Title = "資料請求送信エラー";
            return View("SiryouSeikyuError", null);
        }

        //　*****************  ui-router api ********************
        public ActionResult form()
        {
            return PartialView("_form", null);
        }

        public ActionResult formInput()
        {
            return PartialView("_form-input", null);
        }
        public ActionResult formSurvey()
        {
            return PartialView("_form-survey", null);
        }
        public ActionResult formConfirmation()
        {
            return PartialView("_form-confirmation", null);
        }

        public ActionResult formselection()
        {
            return PartialView("_form-selection", null);
        }

        public ActionResult privacypolicy()
        {
            return PartialView("_Privacy-policy", null);
        }

        public ActionResult mailtest()
        {
            return PartialView("_form-mailtest", null);
        }


        /// <summary>
        /// 資料請求してきた顧客の情報新規登録
        /// </summary>
        /// <param name="model"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveCustomer(customer cus)
        {
            using (CoCoNutsCrmContext Context = new CoCoNutsCrmContext())
            {


                DateTime now = DateTime.Now;
                cus.entry_day = now; //作成日
                cus.update_day = now; // 更新日
                DateTime toDay = DateTime.Today;
                cus.customer_c2 = toDay;
                Context.customer.Add(cus);
                if (cus.customer_name == null)
                {
                    cus.state = 11;
                    return Json(cus, JsonRequestBehavior.AllowGet);   //名前が無かったら　エラーで戻す
                }
                if (cus.customer_address == null)
                {

                    cus.state = 12;
                    return Json(cus, JsonRequestBehavior.AllowGet);   //住所が無かったら　エラーで戻す

                }
              //  string number = GetNumber();
                cus.customer_c0 = "";//　顧客番号はここでは振らない


                // ヨミガナ　からスペースを削除
                string cusyomi = cus.customer_yomi;
                //削除する文字の配列
                char[] removeChars = new char[] { ' ', '　' };

                //削除する文字を1文字ずつ削除する
                foreach (char c in removeChars)
                {
                    cusyomi = cusyomi.Replace(c.ToString(), "");
                }
                cus.customer_yomi = cusyomi;

                try
                {
                    Context.SaveChanges();         //データベースに保存
                }
                catch (Exception e)
                {
                    cus.state = 2;
                }

            }

            return Json(cus, JsonRequestBehavior.AllowGet);   // ここではJsonを返すようにする。
        }


        [HttpPost]
        public ActionResult SaveRireki(問合せ model)
        {
            using (CoCoNutsCrmContext Context = new CoCoNutsCrmContext())
            {
                
                // customer テーブルから契約者情報を取り出す。
                var cus = Context.customer.Single(a => a.id == model.parent_id);
                var cus_mail = cus.customer_mail;
                var cus_name = cus.customer_name;
                var cus_jyou = model.情報取得;
                string cus_seikyu = "";
                switch (cus_jyou)
                {
                    case "メール":
                        cus_seikyu = "沖縄県メモリアル整備協会";
                        break;
                    case "メール（霊廟サイト）":
                        cus_seikyu = "おきなわ霊廟";
                        break;
                    case "メール（墓じまい）":
                        cus_seikyu = "おきなわで墓じまい";
                        break;
                    case "メール（沖縄で終活）":
                        cus_seikyu = "沖縄で終活";
                        break;
                }
                DateTime now = DateTime.Now;
                model.update_day = now; //作成日
                model.問合せ日 = now;

                Context.問合せ.Add(model);

                try
                {
                    Context.SaveChanges();         //データベースに保存
                    goMail(cus_mail,cus_name,cus_seikyu);
                }
                catch (Exception e)
                {
                    model.state = 2;
                }

            }

            return Json("OK", JsonRequestBehavior.AllowGet);   // ここではJsonを返すようにする。
        }


        //private string GetNumber()
        //{
        //    using (CoCoNutsCrmContext Context = new CoCoNutsCrmContext())
        //    {

        //        // 顧客番号を取得し DB上のカウンターを進めておくAPI
        //        // Single は1行を即時取得
        //        var number = Context.numbering.Single(a => a.id == 3);
        //        var vol = number.number;
        //        vol++;
        //        number.number = vol;
        //        Context.SaveChanges();
        //        return vol.ToString();
        //    }
        //}

        private void goMail(string toAddress,string cusName,string cusSeikyu)
        {
            string text = "";
            //
            using (StreamReader sr = new StreamReader(Request.PhysicalApplicationPath +
                "Controllers/MailTextData.txt", Encoding.GetEncoding("utf-8")))
            {
                text = sr.ReadToEnd();
            }
            // Create the email object first, then add the properties.
            SendGridMessage myMessage = new SendGridMessage();
            var username = System.Environment.GetEnvironmentVariable("SENDGRID_USER");
            var pswd = System.Environment.GetEnvironmentVariable("SENDGRID_PASS");
            myMessage.AddTo(toAddress);
            myMessage.From = new MailAddress("info@oki-memorial.org", "沖縄県メモリアル整備協会");
            myMessage.Subject = cusSeikyu + "の資料請求ありがとうございました";
            string htmlText = "<p>"+ cusName +"様</p><br>"+"<p>この度は、" + cusSeikyu;
            myMessage.Html = htmlText + text;

            // Create credentials, specifying your user name and password.
            var credentials = new NetworkCredential(username, pswd);

            // Create an Web transport for sending email.
            var transportWeb = new Web(credentials);

            // Send the email, which returns an awaitable task.
            transportWeb.DeliverAsync(myMessage);

            // If developing a Console Application, use the following
            // transportWeb.DeliverAsync(mail).Wait();
        }

    }
}
