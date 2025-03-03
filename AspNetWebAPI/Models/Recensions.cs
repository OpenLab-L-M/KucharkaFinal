using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class Recensions
    {
        [Key]
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? CheckId { get; set; }
        public int RecipeId { get; set; }
        public string? Content { get; set; }
        public string? UserName { get; set; }
        public string? ProfileName { get; set; }
        public int? AmountOfLikes { get; set; } = 0;
        public int? AmountOfDisslikes { get; set; } = 0;
        public string? Datetime { get; set; }
        public byte[]? UserImage { get; set; }


        public ApplicationUser user { get; set; } = default!;
        public Recipe recept { get; set; } = default!;
    }
}
