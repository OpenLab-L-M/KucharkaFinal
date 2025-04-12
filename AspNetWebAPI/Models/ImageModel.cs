namespace AspNetCoreAPI.Models
{
    public class ImageModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public byte[] Data { get; set; }
        public string? userId { get; set; } = null;
    }
}
