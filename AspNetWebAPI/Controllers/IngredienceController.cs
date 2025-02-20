using AspNetCoreAPI.Data;
using AspNetCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IngredienceController : Controller
    {

        private readonly ApplicationDbContext _context;

        public IngredienceController(ApplicationDbContext context)
        {
            _context = context;
        }


        [Route("/addIngredience")]
        [HttpPost]
        public IActionResult AddIngredience(IngredienceDTO ingredience)
        {
            var ingredience1 = new Ingredience()
            {

                Name = ingredience.Name,

            };

            _context.Add(ingredience1);
            _context.SaveChanges();

            return Ok(ingredience1);
        }
        [Route("/addIngredienceDragAndDrop")]
        [HttpPost]
        public string AddIngredience(string ingredience)
        {
            var ingredience1 = new Ingredience()
            {

                Name = ingredience

            };

            _context.Add(ingredience1);
            _context.SaveChanges();

            return ingredience1.Name;
        }


        [Route("/getIngredience")]
        [HttpGet]
        public IEnumerable<IngredienceDTO> GetIngredience()
        {
             IEnumerable<Ingredience> ingrediences = _context.Ingredience;

                return ingrediences.Select(ingrediences =>
                    new IngredienceDTO
                    {
                        Id = ingrediences.Id,
                        Name = ingrediences.Name
                        
                    });
            

        }
    }
}

