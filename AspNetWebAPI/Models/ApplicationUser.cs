using Microsoft.AspNetCore.Identity;

namespace AspNetCoreAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public byte[]? PictureURL { get; set; }
        public string? ProfileName { get; set; }
        public bool? Admin {  get; set; }

    
    }
}
