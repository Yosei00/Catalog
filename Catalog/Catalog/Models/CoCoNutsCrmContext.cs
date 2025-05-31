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
            Database.SetInitializer<CoCoNutsCrmContext>(null);   //�V�K�쐬��}�C�O���[�V�������s��Ȃ�

        }

        public virtual DbSet<customer> customer { get; set; }
        public virtual DbSet<numbering> numbering { get; set; }
        public virtual DbSet<�⍇��> �⍇�� { get; set; }
    }
}
