using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class Ingredience
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }

    }
}
