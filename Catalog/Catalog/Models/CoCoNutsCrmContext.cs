namespace Catalog.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class CoCoNutsCrmContext : DbContext
    {
        public CoCoNutsCrmContext()
            : base("name=CoCoNutsCrmContext")
        {
            Database.SetInitializer<CoCoNutsCrmContext>(null);   //新規作成やマイグレーションを行わない

        }

        public virtual DbSet<customer> customer { get; set; }
        public virtual DbSet<numbering> numbering { get; set; }
        public virtual DbSet<問合せ> 問合せ { get; set; }
    }
}
