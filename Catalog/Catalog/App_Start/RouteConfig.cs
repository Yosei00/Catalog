using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Catalog
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "SiryouSeikyuEnd",
                url: "gratitude/{id}",
                defaults: new
                {
                    Controller = "Home",
                    action = "SiryouSeikyuEnd",
                    id = UrlParameter.Optional
                }
            );
            routes.MapRoute(
                name: "SiryouSeikyuError",
                url: "error/{id}",
                defaults: new
                {
                    Controller = "Home",
                    action = "SiryouSeikyuError",
                    id = UrlParameter.Optional
                }
            );



            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}