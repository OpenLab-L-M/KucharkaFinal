using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class Images
    {

        [Key]
        public int Id { get; set; }
        public string? userId { get; set; } = null;
        public byte[]? image { get; set; }


        public Recipe Recipe { get; set; }
    }
}
