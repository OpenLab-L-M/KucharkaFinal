using AspNetCoreAPI.Data;
using AspNetCoreAPI.Models;
using AspNetCoreAPI.Registration.dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;
using System;
using System.Linq;
using System.Security.Claims;

namespace AspNetCoreAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class UserController : ControllerBase

    {
        private readonly ApplicationDbContext _context;

        private readonly IWebHostEnvironment _environment;
        private readonly UserManager<ApplicationUser> _userManager;


        public UserController(ApplicationDbContext context, IWebHostEnvironment environment, 
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _environment = environment;
            _userManager = userManager;
        }

        [HttpGet("/userProfile")]
        public GetUserDTO? ReturnUserInfo()
        {
            var user = GetCurrentUser();
            GetUserDTO userik = new GetUserDTO();
            {
                userik.UserName = user.UserName;
                userik.Admin = GetCurrentUser().Admin;
                userik.ProfileName = user.ProfileName;
                userik.PictureURL = user.PictureURL;

            }
            return userik;
            
        }
        [HttpPost("/userProfile/changePassword")]
        public async Task<IActionResult> ChangePassword(PasswordDTO newPassword)
        {
            var userik = _context.Users.Where(x => x.Id == GetCurrentUser().Id).FirstOrDefault();
            var result = await _userManager.ChangePasswordAsync(userik, newPassword.OldPassword, newPassword.NewPassword);
            _context.SaveChanges();
            
            return StatusCode(201);

             
        }
        [HttpGet("/clickedUserProfile/myRecensions/{userName}")]
        public IEnumerable<RecensionDTO> MyWrittenRecensions([FromRoute] string userName)
        {
            if (userName == "undefined")
            {
                 var moje = GetCurrentUser();
                var komentariky = _context.Recensions.Where(x => x.UserName == GetCurrentUser().UserName);
                return komentariky.Select(x => new RecensionDTO
                {
                    AmountOfDisslikes = x.AmountOfDisslikes,
                    Admin = GetCurrentUser().Admin,
                    AmountOfLikes = x.AmountOfLikes,
                    Datetime = x.Datetime,
                    RecipesID = x.RecipeId,
                    UserID = x.UserId,
                    UserName = x.UserName,
                    ProfileName = x.ProfileName,
                    Content = x.Content,
                    UserImage = x.UserImage,
                });
            }
            else
            {
                var moje = _context.Users.Where(x => x.UserName == userName).FirstOrDefault();
                var komentariky = _context.Recensions.Where(x => x.UserName == moje.UserName);
                return komentariky.Select(x => new RecensionDTO
                {
                    AmountOfDisslikes = x.AmountOfDisslikes,
                    AmountOfLikes = x.AmountOfLikes,
                    Datetime = x.Datetime,
                    RecipesID = x.RecipeId,
                    UserID = x.UserId,
                    ProfileName = x.ProfileName,
                    UserName = x.UserName,
                    Content = x.Content,
                    UserImage = x.UserImage,
                });
            }

        }

        [HttpPut("/checkOwned")]
        public void CheckOwned([FromBody] int id)
        {
            
            var uprava = _context.NakupnyLists.FirstOrDefault(x => x.Id == id);
            if(uprava.isChecked == false)
            {
                uprava.isChecked = true;
                _context.SaveChanges();
            }

            else
            {
                uprava.isChecked = false;
                _context.SaveChanges();
            }

        }

        [HttpGet("/clickedUserProfile/{userName}")]
        public GetUserDTO? returnClickedUser([FromRoute] string userName)
        {
            if(userName == "undefined")
            {
                var tentoUser = GetCurrentUser();
                GetUserDTO tentoUserik = new GetUserDTO();
                {
                    tentoUserik.Admin = tentoUser.Admin;
                    tentoUserik.UserName = tentoUser.UserName;
                    tentoUserik.ProfileName = tentoUser.ProfileName;
                    tentoUserik.PictureURL = tentoUser.PictureURL;
                }
                return tentoUserik;
            }
            else {
                var user = _context.Userik.Where(x => x.UserName == userName).Single();
                GetUserDTO userik = new GetUserDTO();
                {
                    userik.Admin = user.Admin;
                    userik.UserName = user.UserName;
                    userik.ProfileName = user.ProfileName;
                    userik.PictureURL = user.PictureURL;

                }
                return userik;
            }


        }

        [HttpGet("/getAllUsers")]
        public IEnumerable<GetUserDTO> GetAllUsers()
        {
            var dbUsers = _context.Users.Where(x => x.UserName != GetCurrentUser().UserName);
           return dbUsers.Select(x =>
            new GetUserDTO
            {
                UserName = x.UserName,
                ProfileName = x.ProfileName,

            });
        }


        [HttpDelete("/deleteUser/{userName}")]
        public GetUserDTO DeleteUser([FromRoute] string userName)
        {
            var userForDeletion = _context.Users.FirstOrDefault(x => x.UserName == userName);
            _context.Remove(userForDeletion);
            _context.SaveChanges();
            return null;
        }
        [HttpGet("/getUserCreators")]
        public ActionResult<List<GetUserDTO>> GetAllUserCreators()
        {
            var users = _context.Userik.ToList();
            var userImages = users.Select(user => new GetUserDTO
            {
                Id = user.Id,
                PictureURL= user.PictureURL
            }).ToList();

            return Ok(userImages);
        }



        [HttpGet("/userProfile/usersRecipes/{userName}")]
        public IEnumerable<RecipesDTO> UserRecipes([FromRoute] string userName)
        {
            
            if (userName == "undefined")
            {
                IEnumerable<Recipe> currentUsersRecipes = _context.Recipes.Where(x => x.userID == GetCurrentUser().Id).ToList();
                return currentUsersRecipes.Select(currentRecipe => mapReceptToDto(currentRecipe));
            }
            else {
                var user = _context.Users.Where(x => x.UserName == userName).Single();
                IEnumerable<Recipe> dbRecipes = _context.Recipes.Where(x => x.userID == user.Id).ToList();
                return dbRecipes.Select(dbRecipe => mapReceptToDto(dbRecipe));
            }

        }
        [HttpPost("/recipes/addtofav/{id:int}")]
         public RecipesDTO addtofav([FromRoute] int id)
         {
             var novyOblubenec = _context.Recipes.Where(x => x.Id == id).FirstOrDefault();
            
             var userik = GetCurrentUser();
            var nachadzaSa = _context.UserRecipes.Any(x => x.RecipeId == id);
            
            
            ApplicationUserRecipe pridajOblubeny = new ApplicationUserRecipe()
            {
                RecipeId = novyOblubenec.Id,
                UserId = GetCurrentUser().Id,
            };
            
            if (!nachadzaSa)
            {
                _context.UserRecipes.Add(pridajOblubeny);
                _context.SaveChanges();
                return mapReceptToDto(novyOblubenec);
            }
            else
            {
 
                var vymaz = _context.UserRecipes.Where(x => x.RecipeId == id).Single<ApplicationUserRecipe>();
                _context.UserRecipes.Remove(vymaz);
                _context.SaveChanges();
                return null;
            }



        }
        [HttpDelete("/deleteWhole")]
        public void DeleteWholePlan()
        {
            var pocet = _context.NakupnyLists.ExecuteDelete();

        }
        [HttpDelete("/deleteSpecific/{day}")]
        public void DeleteSelectedDay([FromRoute] string day)
        {

            var naVymaz = _context.NakupnyLists.Where(x => x.Day == day);
            foreach (var vymaz in naVymaz)
            {
                _context.Remove(vymaz);
            }

            _context.SaveChanges();
        }
        [HttpGet("/getList/{day}")]
        public IEnumerable<nakupnyListDTO> ReturnOurList([FromRoute] string Day)
        {
            var zDb = _context.NakupnyLists.Where(x => x.Day == Day && GetCurrentUser().Id == x.UserId);
            return zDb.Select(Listvar =>
            new nakupnyListDTO
            {
                Day = Listvar.Day,
                Id = Listvar.Id,
                Name = Listvar.Name,
                isChecked = Listvar.isChecked,
            });
        }

        [HttpPost("/addToList")]
        public nakupnyListDTO AddToList(nakupnyListDTO newAdditionToCollection)
        {
            var nakupnyListek = new NakupnyList()
            {
                Day = newAdditionToCollection.Day,
                Name = newAdditionToCollection.Name,
                isChecked = false,
                UserId = GetCurrentUser().Id

            };
            _context.Add(nakupnyListek);
            _context.SaveChanges();

            return new nakupnyListDTO
            {
                Id = nakupnyListek.Id,
                Day = nakupnyListek.Day,
                Name = nakupnyListek.Name,
                isChecked = nakupnyListek.isChecked,
            };
        }

        [HttpGet("/userprofile/usersfavrecipes")]
        public IEnumerable<RecipesDTO> userfavrecipes()
        {
            var favouriteRecipeIds = _context.UserRecipes.Select(f => f.RecipeId).ToList();
            var fav = _context.UserRecipes
              .Include(f => f.recept)
              .Where(f => f.UserId == f.UserId  )
              .ToList();
            return fav.Select(f => mapReceptToDto(f.recept));
            
        }

        private RecipesDTO mapReceptToDto(Recipe dbRecipe)
        {
            return
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
                    Gramaz = dbRecipe.Gramaz,
                    Cukor = dbRecipe.Cukor,
                    Sacharidy = dbRecipe.Sacharidy,
                    Bielkoviny = dbRecipe.Bielkoviny,
                    Kalorie = dbRecipe.Kalorie,
                    Tuky = dbRecipe.Tuky,

                    Cas = dbRecipe.Cas
                };
        }
       
        protected ApplicationUser? GetCurrentUser()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);

            return _context.Users.SingleOrDefault(user => user.UserName == userName);
        }

        
        [Route("upload")]
        [HttpPost]
        public JsonResult SaveFile()
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

                var currentUser = GetCurrentUser();
                if (currentUser != null)
                {
                    currentUser.PictureURL = fileBytes;
                    _context.SaveChanges();
                }

                return new JsonResult(filename);
            }
            catch (Exception)
            {
                return new JsonResult("anonymous.png");
            }

        }


        [HttpDelete("/user/deleteImage")]
        public IActionResult DeleteImage()
        {
            var user = GetCurrentUser();
            if (user == null)
            {
                return NotFound();
            }

            user.PictureURL = null;
            _context.SaveChanges();

            return Ok();
        }
        [HttpGet("vratMojeKomenty")]
        public IEnumerable<RecensionDTO> MyRecensions()
        {
            IEnumerable<Recensions> mojeRecenzie = _context.Recensions.Where(x => x.UserId == GetCurrentUser().Id);
            return mojeRecenzie.Select(dbRecension => RecensionsToDTO(dbRecension)).ToList();
            
        }
        private RecensionDTO RecensionsToDTO(Recensions dbRecension)
        {
            return
                new RecensionDTO
                {
                    Id = dbRecension.Id,
                    UserID = dbRecension.UserId,
                    Content = dbRecension.Content,
                    CheckID = dbRecension.CheckId,
                    UserName = dbRecension.UserName,
                    AmountOfDisslikes = dbRecension.AmountOfDisslikes,
                    AmountOfLikes = dbRecension.AmountOfDisslikes,
                    Datetime = dbRecension.Datetime,
                    ProfileName = dbRecension.ProfileName,
                    RecipesID = dbRecension.RecipeId,
                };
        }

    }

}
