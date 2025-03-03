namespace AspNetCoreAPI
{
    public class GetUserDTO
    {
        public string? Id {  get; set; }
        public string? UserName { get; set;}
        public string? ProfileName { get; set;}
        public string? PasswordHash {  get; set; }
        public byte[]? PictureURL { get; set;}
        IEnumerable<RecipesDTO>? oblubeneReceptiky { get; set;}
        
    }
}
