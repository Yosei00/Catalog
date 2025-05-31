namespace Catalog.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("net_問合せ")]
    public partial class 問合せ
    {
        public int id { get; set; }

        public int? parent_id { get; set; }

        public int? state { get; set; }

        public int? update_id { get; set; }

        public DateTime? update_day { get; set; }

        public int? subparent_id { get; set; }

        [StringLength(200)]
        public string subparent_name { get; set; }

        [StringLength(2)]
        public string subparent_suffix { get; set; }

        public string memo { get; set; }

        public DateTime? 問合せ日 { get; set; }

        [StringLength(100)]
        public string 相談内容 { get; set; }

        [StringLength(100)]
        public string 情報源 { get; set; }

        [StringLength(100)]
        public string 年代 { get; set; }

        [StringLength(500)]
        public string 備考 { get; set; }

        [StringLength(100)]
        public string 情報取得 { get; set; }

        [StringLength(100)]
        public string お問合せ霊園 { get; set; }
    }
}
