﻿
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public byte[]? ImageURL { get; set; }
        public string? Difficulty { get; set; }
        public string? CheckID { get; set; }
        
        
    }
}
