using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Authentication.dto
{
    public class ConfirmEmailDTO
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
    }
}
