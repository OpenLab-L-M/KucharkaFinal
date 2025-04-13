using AspNetCoreAPI.Data;
using AspNetCoreAPI.Migrations;
using AspNetCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using DeepL;
using System.Net.Http;
using Nutritionix;
using System.Linq;
using Mailjet.Client.Resources;
using static System.Net.Mime.MediaTypeNames;
using System.Drawing;

namespace AspNetCoreAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class RecipesController : Controller
    {
        private readonly ApplicationDbContext _context;


    

        public RecipesController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet("/recipes/")]
        public async  Task<IEnumerable<RecipesDTO>> GetRecipesList()
        {
            

            List<Recipe> dbRecipes =  await _context.Recipes.ToListAsync();
            return dbRecipes.Select(dbRecipe =>
                 new RecipesDTO
                {
                    Id = dbRecipe.Id,
                    Name = dbRecipe.Name,
                    Description = dbRecipe.Description,
                    Difficulty = dbRecipe.Difficulty,
                    ImageURL = dbRecipe.ImageURL,
                    CheckID = dbRecipe.CheckID,
                    userID = dbRecipe.userID,
                    Ingrediencie = dbRecipe.Ingrediencie,
                    Veganske = dbRecipe.Veganske,
                    Vegetarianske = dbRecipe.Vegetarianske,
                    Ranajky = dbRecipe.Ranajky,
                    Obed = dbRecipe.Obed,
                    Vecera = dbRecipe.Vecera,
                    Tuky = dbRecipe.Tuky,
                    Sacharidy = dbRecipe.Sacharidy,
                    Bielkoviny = dbRecipe.Bielkoviny,
                    Cukor = dbRecipe.Cukor,
                    Gramaz = dbRecipe.Gramaz,
                    Kalorie = dbRecipe.Kalorie,
                    Cas = dbRecipe.Cas,
                    imageId = dbRecipe.ImageId,
                    
        }); 
        }
        [HttpPost("/GetPaginated")]
        public async Task<IEnumerable<RecipesDTO>> GetPaginatedRecipes([FromBody] PaginatorData jono)
        {

            var query = _context.Recipes
                     .OrderBy(r => r.Id); 

            var paginatedDbRecipes = await query
                .Skip((int)jono.Index * (int)jono.Length) 
                .Take((int)jono.Length)             
                .Select(dbRecipe => new RecipesDTO   
                {
                    Id = dbRecipe.Id,
                    Name = dbRecipe.Name,
                    Description = dbRecipe.Description,
                    Difficulty = dbRecipe.Difficulty,
                    ImageURL = dbRecipe.ImageURL,
                    CheckID = dbRecipe.CheckID,
                    userID = dbRecipe.userID,
                    Ingrediencie = dbRecipe.Ingrediencie,
                    Veganske = dbRecipe.Veganske,
                    Vegetarianske = dbRecipe.Vegetarianske,
                    Ranajky = dbRecipe.Ranajky,
                    Obed = dbRecipe.Obed,
                    Vecera = dbRecipe.Vecera,
                    Tuky = dbRecipe.Tuky,
                    Sacharidy = dbRecipe.Sacharidy,
                    Bielkoviny = dbRecipe.Bielkoviny,
                    Cukor = dbRecipe.Cukor,
                    Gramaz = dbRecipe.Gramaz,
                    Kalorie = dbRecipe.Kalorie,
                    Cas = dbRecipe.Cas,
                    imageId = dbRecipe.ImageId,
                })
                .ToListAsync();                // Execute the final query

            return paginatedDbRecipes;

        }
        public async Task<List<string>> mapToPostupyStrings( int recipesID)
        {
            List<Postupy> dbPostupy = await _context.Postupiky.Where(x => x.RecipesId == recipesID).ToListAsync();
            List<string> postupyContext = dbPostupy.Select(x => x.postupy).ToList();
            return postupyContext;

        }

        [HttpDelete("/deleteIngredient/{ingr}")]
        public void deleteIngredient([FromRoute] string ingr)
        {
            var vymazIngr = _context.Ingredience.FirstOrDefault(x => x.Name == ingr);
            _context.Remove(vymazIngr);
            _context.SaveChanges();
        }

        [HttpGet("{id:int}")]
        public async Task<RecipesDTO>GetRecipes(int id)
        {
 
            var recipe = _context.Recipes.Single(savedId => savedId.Id == id);
            return new RecipesDTO
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                Difficulty = recipe.Difficulty,
                ImageURL = recipe.ImageURL,
                CheckID = recipe.CheckID,
                userID = GetCurrentUser().Id,
                Postupicky = await mapToPostupyStrings(recipe.Id),
                Tuky = recipe.Tuky,
                Bielkoviny = recipe.Bielkoviny,
                Sacharidy = recipe.Sacharidy,
                Cukor = recipe.Cukor,
                Ranajky = recipe.Ranajky,
                Obed = recipe.Obed,
                Vecera = recipe.Vecera,
                Kalorie = recipe.Kalorie,
                Gramaz = recipe.Gramaz,
                Ingrediencie = recipe.Ingrediencie,
                Veganske = recipe.Veganske,
                Vegetarianske = recipe.Vegetarianske,
                Admin = GetCurrentUser().Admin,
                Cas = recipe.Cas,
                imageId = recipe.ImageId
            };
           
        }
        [HttpGet("/CreateRecipe/Ingredients")]
        public IEnumerable<string> ReturnIngredients()
        {
            IEnumerable<string> ingredients = _context.Ingredience.Select(x => x.Name);
            return ingredients;
        }

        [HttpGet("/getImage/{id:int}")]
        public ImagesDTO GetImage(int id)
        {
            var image = _context.Images.Single(savedId => savedId.Id == id);
            return new ImagesDTO
            {
                Id = image.Id,
                image = image.image
            };

        }


        [HttpGet("/getAllImages")]
        public ActionResult<List<ImagesDTO>> GetImages()
        {
            var images = _context.Images.ToList();
            var imagesDTO = images.Select(image => new ImagesDTO
            {
                Id = image.Id,
                image = image.image
            }).ToList();

            return Ok(imagesDTO);

        }
      

        [HttpPost("/CreateRecipe")]
        public RecipesDTO CreateRecipe( RecipesDTO receptik)
        {
            var user = GetCurrentUser();
            RecipesDTO recept = new RecipesDTO();
            recept = receptik;

            var nReceptik = new Recipe()
            {
                Id = receptik.Id,
                Name = receptik.Name,
                Description = receptik.Description,
                Difficulty = receptik.Difficulty,
                ImageURL = receptik.ImageURL,
                CheckID = receptik.CheckID,
                userID = GetCurrentUser().Id,
                Ingrediencie = receptik.Ingrediencie,
                Veganske = receptik.Veganske,
                Vegetarianske = receptik.Vegetarianske,
                Ranajky = receptik.Ranajky,
                Obed = receptik.Obed,
                Vecera = receptik.Vecera,
                Tuky =  receptik.Tuky,
                
                Sacharidy = receptik.Sacharidy,
                Cukor = receptik.Cukor,
                Gramaz = receptik.Gramaz,
                Bielkoviny = receptik.Bielkoviny,
                Kalorie = receptik.Kalorie,
                Cas = receptik.Cas,
                ImageId = receptik.imageId

            };
            nReceptik.CheckID = user?.Id;
            
            _context.Add(nReceptik);
            _context.SaveChanges();
            for (int i = 0; i < recept.Postupicky.Count; i++)
            {
                if (recept.Postupicky[i] != "")
                {
                    var Postup = new Postupy
                    {
                        postupy = recept.Postupicky[i],
                        RecipesId = nReceptik.Id,
                    };
                    _context.Postupiky.Add(Postup);
                }
                else
                {
                    continue;
                }
            }
            _context.SaveChanges();
            return receptik;
        }

        [Route("upload")]
        [HttpPost]
        public int SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                var filename = postedFile.FileName;

                byte[] fileBytes;
                using (var memoryStream = new MemoryStream())
                {
                    postedFile.CopyTo(memoryStream);
                    fileBytes = memoryStream.ToArray();
                    
                }


                var images = new Models.Images()
                {
                    image = fileBytes,
                    userId = GetCurrentUser().Id
                    
                };
         
                _context.Images.Add(images);
                _context.SaveChanges();

                return images.Id;
            }
            catch (Exception)
            {
                return 0;
            }

        }


        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeleteRecipe(int id)
        {
            var recipe = _context.Recipes.FirstOrDefault(savedId => savedId.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(recipe);
            _context.SaveChanges();
            return NoContent();
        }

        protected ApplicationUser? GetCurrentUser()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);

            return _context.Users.SingleOrDefault(user => user.UserName == userName);
        }


        /*   [HttpPost("upload")]
           public IActionResult UploadImage()
           {
               return Ok(new { message = "Image uploaded successfully" });
           }
           */
        [HttpPut("Editujem")]
        public async Task<RecipesDTO> Edit(EditDTO receptik)
        {
            var nReceptik = _context.Recipes.FirstOrDefault(x => x.Id == receptik.Id);
            var postupicky = _context.Postupiky.Where(x=> x.RecipesId == receptik.Id).ToList();
            /*for (int i = 0; i < postupicky.Count - 1; i++)
            {
                postupicky[i].postupy = receptik.Postupicky[i];
            }*/
            nReceptik.Name = receptik.Name;
            
            nReceptik.Ingrediencie = receptik.Ingrediencie;
            nReceptik.Description = receptik.Description;
            nReceptik.ImageURL = receptik.ImgURL;
            nReceptik.Cas = receptik.Cas;
            nReceptik.Tuky = receptik.Tuky;
            nReceptik.Sacharidy = receptik.Sacharidy;
            nReceptik.Cukor = receptik.Cukor;
            nReceptik.Gramaz = receptik.Gramaz;
            nReceptik.Bielkoviny = receptik.Bielkoviny;
            nReceptik.Kalorie = receptik.Kalorie;
            var neviemUz = new RecipesDTO()
            {
                Id = nReceptik.Id,
                Difficulty = nReceptik.Difficulty,
                Name = nReceptik.Name,
                Tuky = nReceptik.Tuky,
                Sacharidy = nReceptik.Sacharidy,
                Cukor = nReceptik.Cukor,
                Gramaz = nReceptik.Gramaz,
                Bielkoviny = nReceptik.Bielkoviny,
                Kalorie = nReceptik.Kalorie,
                Ingrediencie = nReceptik.Ingrediencie,
                Description = nReceptik.Description,
                ImageURL = nReceptik.ImageURL,
                Postupicky = await mapToPostupyStrings(nReceptik.Id),
                Cas = nReceptik.Cas
            };
            _context.SaveChanges();
            return neviemUz;
        }
        [HttpPost("PridajRecenziu")]
        public RecensionDTO AddRecension(RecensionDTO nRecenzia)
        {
            Recensions recenzia = new Recensions();
            //var recenzia = _context.Recensions.FirstOrDefault(x => x.UserId == GetCurrentUser().Id && x.RecipeId == nRecenzia.RecipesID);
            recenzia.RecipeId = nRecenzia.RecipesID;
            var receptik = _context.Recipes.FirstOrDefault(x => x.Id == nRecenzia.RecipesID);
            recenzia.RecipesName = receptik.Name;
            recenzia.Content = nRecenzia.Content;
            recenzia.Datetime = nRecenzia.Datetime;
            recenzia.UserImage = nRecenzia.UserImage;
            recenzia.UserName = GetCurrentUser().UserName;
            recenzia.ProfileName = GetCurrentUser().ProfileName;
            recenzia.UserId = GetCurrentUser().Id;
            _context.Add(recenzia);
            _context.SaveChanges();
            var vraciam = new RecensionDTO()
            {
                Id = recenzia.Id,
                Datetime = DateTime.Now.ToString(),
                RecipesID = nRecenzia.RecipesID,
                Content = nRecenzia.Content,
                ProfileName = GetCurrentUser().ProfileName,
                UserName = GetCurrentUser().UserName,
                
            };
            return vraciam;
            
        }
        [HttpGet("recenzie/{id:int}")]
        public async Task<IEnumerable<RecensionDTO>> GetRecensions([FromRoute] int id)
        {
            IEnumerable<Recensions> dbRecensions = await _context.Recensions.Where(x => x.RecipeId == id).ToArrayAsync();


            return dbRecensions.Select(dbRecension =>
                new RecensionDTO
                {
                    Id = dbRecension.Id,
                    Content = dbRecension.Content,
                    Datetime = dbRecension.Datetime,
                    UserImage = dbRecension.UserImage,
                    UserID = dbRecension.UserId,
                    UserName = dbRecension.UserName,
                    Admin = GetCurrentUser().Admin,
                    ProfileName = dbRecension.ProfileName,
                    AmountOfLikes = dbRecension.AmountOfLikes,
                    AmountOfDisslikes = dbRecension.AmountOfDisslikes,
                    CheckID = GetCurrentUser().Id
                }); 
        }
        [HttpPost("likeRecension/{recensionId:int}")] 
        public async Task<ActionResult<RecensionDTO>> LikeRecension([FromRoute] int recensionId) 
        {

            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized("User not authenticated."); 
            }
            var currentUserId = currentUser.Id; 


            var recension = await _context.Recensions
                                          .FirstOrDefaultAsync(r => r.Id == recensionId);
            if (recension == null)
            {
                return NotFound($"Recension with ID {recensionId} not found.");
            }


            var existingLike = await _context.LikeRecensions
                                             .FirstOrDefaultAsync(lr => lr.RecenziaId == recensionId && lr.UserId == currentUserId);


            if (existingLike != null)
            {

                if (existingLike.IsLiked == true)
                {

                    _context.LikeRecensions.Remove(existingLike);
                    recension.AmountOfLikes = recension.AmountOfLikes > 0 ? recension.AmountOfLikes - 1 : 0; // Prevent negative counts
                }
                else
                {

                    existingLike.IsLiked = true;
                    recension.AmountOfLikes++;
                    recension.AmountOfDisslikes = recension.AmountOfDisslikes > 0 ? recension.AmountOfDisslikes - 1 : 0; // Prevent negative counts
                }
            }
            else
            {

                var newLike = new LikeRecensions()
                {

                    UserId = currentUserId,
                    RecenziaId = recensionId,
                    IsLiked = true,

                };
                _context.LikeRecensions.Add(newLike);
                recension.AmountOfLikes++;
            }

            try
            {

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update like status due to a database error.");
            }
            catch (Exception ex)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }



            var resultDto = new RecensionDTO()
            {
                RecipesID = recension.RecipeId,
                UserName = recension.UserName,
                Content = recension.Content,
                Datetime = recension.Datetime,
                ProfileName = recension.ProfileName,
                Id = recension.Id,
                UserID = recension.UserId, 
                CheckID = currentUserId,   
                AmountOfLikes = recension.AmountOfLikes,
                AmountOfDisslikes = recension.AmountOfDisslikes
            };

            return Ok(resultDto); 
        }
        /*[HttpGet("/Homepage/returnRandomRecipe")]
        public IEnumerable<RecipesDTO> ReturnRandomRecipe()
        {
            List<Recipe> filtrovany = new List<Recipe>();
            int pocet = _context.Recipes.Count();
            if (pocet != 0)
            {
                Random rng = new Random();
                List<Recipe> dbRecipes = _context.Recipes.ToList();
                List<int> randomIds = new List<int>();
                int rng2;
                if( pocet -1 <= 0) {
                    return null;
                }
                else
                {
                    for (int i = 0; i < pocet - pocet / 2; i++)
                    {
                        rng2 = rng.Next(1, pocet);
                        if (randomIds.Contains(rng2))
                        {
                            continue;
                        }


                        else
                        {
                            filtrovany.Add(dbRecipes[rng2]);

                        }
                        randomIds.Add(rng2);

                    }


                }
            }
                
            if (filtrovany.Count != 0)
            {
                return filtrovany.Select(dbRecipe =>
               new RecipesDTO
               {
                   Id = dbRecipe.Id,
                   Name = dbRecipe.Name,
                   Description = dbRecipe.Description,
                   Difficulty = dbRecipe.Difficulty,
                   ImageURL = dbRecipe.ImageURL,
                   CheckID = dbRecipe.CheckID,
                   userID = dbRecipe.userID,
                   Ingrediencie = dbRecipe.Ingrediencie,
                   Veganske = dbRecipe.Veganske,
                   Vegetarianske = dbRecipe.Vegetarianske,

                   Cas = dbRecipe.Cas,
                   imageId = dbRecipe.ImageId
               }).Reverse();
            }
            else {
                return null;
                }

            }*/
        [HttpPost("disslikeRecension/{id:int}")]
        public async Task<ActionResult<RecensionDTO>> DisslikeRecension([FromBody] int RecensionId)
        {
            var User =  GetCurrentUser();
            var dLike = await _context.Recensions
                .FirstOrDefaultAsync(x => x.Id == RecensionId);
            var existuje = await _context.LikeRecensions.FirstOrDefaultAsync(x => x.RecenziaId == RecensionId && x.UserId == User.Id);

            if (existuje != null)
            {
                if(existuje.IsLiked == false)
                {
                    _context.LikeRecensions.Remove(existuje);
                    dLike.AmountOfDisslikes -= 1;
                }
                else
                {
                    existuje.IsLiked = false;
                    dLike.AmountOfLikes -= 1;
                    dLike.AmountOfDisslikes += 1;

                }
            }

            else if (existuje == null)
            {
                LikeRecensions nLike = new LikeRecensions()
                {
                    User = User,
                    Recenzia = dLike,
                    IsLiked = false,

                    RecenziaId = RecensionId,
                    UserId = User.Id
                };
                dLike.AmountOfDisslikes += 1;

                _context.LikeRecensions.Add(nLike);


            }
            await _context.SaveChangesAsync();
            var pseudoSignaly = new RecensionDTO()
            {
                RecipesID = dLike.RecipeId,
                UserName = dLike.UserName,
                Content = dLike.Content,
                Id = dLike.Id,
                UserID = dLike.UserId,
                Datetime = dLike.Datetime,
                ProfileName = dLike.ProfileName,
                CheckID = User.Id,
                AmountOfLikes = dLike.AmountOfLikes,
                AmountOfDisslikes = dLike.AmountOfDisslikes
            };
            return Ok(pseudoSignaly);
        }
        [HttpDelete("removeRecension/{id:int}")]
        public RecensionDTO RemoveRecension([FromRoute]int id)
        {
            var vymaz = _context.Recensions.Where(x => x.Id == id).Single();
            _context.Remove(vymaz);
            _context.SaveChanges();
            return null;

            

        }


    }


}
