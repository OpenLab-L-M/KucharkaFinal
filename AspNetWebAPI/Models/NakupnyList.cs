using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class NakupnyList
    {
        [Key]
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Name { get; set; }
        public bool? isChecked { get; set; }
    }
}
