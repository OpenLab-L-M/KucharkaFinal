using System.Security.Cryptography.X509Certificates;

namespace AspNetCoreAPI
{
    public class RecipesDTO
    {
        public int Id { get; set; }
        public byte[]? image { get; set; }
        public string? Name { get; set; }
        public bool? Favourite { get; set; }
        public string? Description { get; set; }
        public string? ImageURL { get; set; }
        public string? Difficulty { get; set; }
        public string? CheckID { get; set; }
        public string? Ingrediencie { get; set; }
        public int? Cas { get; set; }
        public bool? Ranajky { get; set; }
        public bool? Obed { get; set; }
        public bool? Vecera { get; set; }
        public bool? Veganske { get; set; }
        public bool? Vegetarianske { get; set; }
        public int? Tuky { get; set; }
        public int? Gramaz {  get; set; }
        public int? Cukor { get; set; }
        public int? Sacharidy { get; set; }
        public int? Bielkoviny { get; set; }
        public int? Kalorie { get; set; }
        public bool? NizkoKaloricke { get; set; }
        public string? userID {  get; set; }
        public List<string>? Postupicky { get; set; }
        public bool? Admin { get; set; }
        public int? imageId { get; set; }   

}
}
