namespace Catalog.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("numbering")]
    public partial class numbering
    {
        public int id { get; set; }

        public int? state { get; set; }

        [StringLength(50)]
        public string table_name { get; set; }

        [StringLength(50)]
        public string column_name { get; set; }

        [StringLength(50)]
        public string apex { get; set; }

        public int? number { get; set; }

        public int? column_type { get; set; }
    }
}
