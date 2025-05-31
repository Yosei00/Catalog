namespace Catalog.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("net_customer")]
    public partial class customer
    {
        public int id { get; set; }

        public int? entry_id { get; set; }

        public DateTime? entry_day { get; set; }

        public int? update_id { get; set; }

        public DateTime? update_day { get; set; }

        public int? type { get; set; }

        public int? partner_type { get; set; }

        public int? lead_type { get; set; }

        public int? spare_type { get; set; }

        public int? parent_id { get; set; }

        public int? state { get; set; }

        [Column(TypeName = "ntext")]
        public string memo { get; set; }

        public int? category_cd { get; set; }

        [StringLength(500)]
        public string customer_yomi { get; set; }

        [StringLength(500)]
        public string customer_name { get; set; }

        [StringLength(500)]
        public string customer_president { get; set; }

        [StringLength(50)]
        public string customer_zip { get; set; }

        [StringLength(500)]
        public string customer_address { get; set; }

        [StringLength(500)]
        public string customer_house { get; set; }

        [StringLength(50)]
        public string customer_phone { get; set; }

        [StringLength(50)]
        public string customer_fax { get; set; }

        [StringLength(50)]
        public string customer_mail { get; set; }

        [StringLength(500)]
        public string customer_c0 { get; set; }

        [StringLength(100)]
        public string customer_c1 { get; set; }

        public DateTime? customer_c2 { get; set; }

        [StringLength(100)]
        public string customer_c4 { get; set; }

        public DateTime? customer_c7 { get; set; }

        [StringLength(100)]
        public string customer_c8 { get; set; }

        [StringLength(100)]
        public string customer_c9 { get; set; }

        public DateTime? customer_d0 { get; set; }

        public int? customer_d1 { get; set; }

        public bool? customer_d2 { get; set; }

        [StringLength(500)]
        public string customer_d3 { get; set; }

        [StringLength(20)]
        public string customer_d4 { get; set; }

        public bool? customer_d6 { get; set; }

        [StringLength(100)]
        public string customer_d7 { get; set; }

        [StringLength(100)]
        public string customer_d8 { get; set; }

        [StringLength(100)]
        public string customer_d9 { get; set; }

        [StringLength(500)]
        public string customer_e0 { get; set; }

        [StringLength(100)]
        public string customer_e1 { get; set; }

        [StringLength(100)]
        public string 見積書 { get; set; }

        [StringLength(100)]
        public string 資料送付 { get; set; }

        [StringLength(100)]
        public string 情報取得方法 { get; set; }

        [StringLength(100)]
        public string 初期ニーズ { get; set; }

        [StringLength(100)]
        public string 受付担当者 { get; set; }

        [StringLength(100)]
        public string 発生原因 { get; set; }

        [StringLength(100)]
        public string 年代 { get; set; }

        public DateTime? 資料発送日 { get; set; }

        [StringLength(500)]
        public string 姓 { get; set; }

        [StringLength(500)]
        public string 名 { get; set; }

        [StringLength(500)]
        public string セイ { get; set; }

        [StringLength(500)]
        public string メイ { get; set; }

        [StringLength(500)]
        public string 都道府県 { get; set; }


        [StringLength(500)]
        public string 市区町村 { get; set; }

        [StringLength(500)]
        public string 町名番地 { get; set; }



    }
}
