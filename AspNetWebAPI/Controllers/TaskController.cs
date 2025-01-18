using AspNetCoreAPI.Data;
using AspNetCoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TaskController
    {
        private readonly ApplicationDbContext _context;
        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("/taskList")]
        public IEnumerable<TaskDTO> GetTasks()
        {
            IEnumerable<TaskList> dbTasks = _context.Tasks;
            return dbTasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Name = t.Name,
                DeadLine = t.DeadLine,
                Description = t.Description,
                Priority = t.Priority,
                StartTime = t.StartTime,
            });
        }

    }
}
