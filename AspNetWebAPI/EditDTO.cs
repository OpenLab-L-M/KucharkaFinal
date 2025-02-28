namespace AspNetCoreAPI
{
    public class EditDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? Tuky { get; set; }
        public int? Gramaz { get; set; }
        public int? Cukor { get; set; }
        public int? Sacharidy { get; set; }
        public int? Bielkoviny { get; set; }
        public int? Kalorie { get; set; }
        public string? Ingrediencie { get; set; }
        public string? Description { get; set; }
        public string? ImgURL { get; set; }
        public List<string>? Postupicky { get; set; }
       
        public int? Cas { get; set; }
    }
}
