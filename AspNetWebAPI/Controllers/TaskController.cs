using AspNetCoreAPI.Data;
using AspNetCoreAPI.Migrations;
using AspNetCoreAPI.Models;
using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AspNetCoreAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TaskController : ControllerBase  
    {
        private readonly ApplicationDbContext _context;
        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }
        protected ApplicationUser? GetCurrentUser()
        {
            // Get the username from the current User's claims
            var userName = User?.FindFirstValue(ClaimTypes.Name);

            // Find the user in the database
            return _context.Users.SingleOrDefault(user => user.UserName == userName);
        }


        [HttpGet("/taskList")]
        public IEnumerable<TaskDTO> GetTasks()
        {
            IEnumerable<TaskList> dbTasks = _context.Tasks.Where(x=> x.IsCompleted == false && x.UserId == GetCurrentUser().Id);
            return dbTasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                //CheckId = GetCurrentUser().Id,
                //UserId = t.UserId,
                Name = t.Name,
                DeadLine = t.DeadLine,
                Description = t.Description,
                Priority = t.Priority,
                StartTime = t.StartTime,
                IsCompleted = t.IsCompleted,
            });
        }
        [HttpPost("/createTask")]
        public void AddTask(TaskDTO taskToCreate)
        {
            TaskList nTask = new TaskList()
            {
                StartTime = DateTime.Now,
                DeadLine = taskToCreate.DeadLine,
                Description = taskToCreate.Description,
                Priority = taskToCreate.Priority,
                Name = taskToCreate.Name,
                IsCompleted = false,
                UserId = GetCurrentUser().Id
            };
            _context.Add(nTask);
            _context.SaveChanges();

        }
        [HttpGet("/TaskDetail/{id:int}")]
        public TaskDTO GetTasks([FromRoute] int id)
        {
            return mapToDTO(_context.Tasks.FirstOrDefault(t => t.Id == id));
        }
        public TaskDTO mapToDTO(TaskList task)
        {
            return new TaskDTO()
            {
                Id = task.Id,
                Admin = GetCurrentUser().Admin,
                Priority = task.Priority,
                StartTime = task.StartTime,
                DeadLine = task.DeadLine, 
                Description = task.Description,
                Name = task.Name,
                IsCompleted = task.IsCompleted,
            };
        }
        [HttpPost("/TaskDetail/edit")]
        public TaskDTO EditTask(TaskDTO editedTask)
        {
            var taskFromDB = _context.Tasks.FirstOrDefault(t => t.Id == editedTask.Id);
            taskFromDB.DeadLine = editedTask.DeadLine;
            taskFromDB.Description = editedTask.Description;
            taskFromDB.Name = editedTask.Name;
            taskFromDB.Priority = editedTask.Priority;
            taskFromDB.StartTime = taskFromDB.StartTime;
            _context.SaveChanges();
            return mapToDTO(taskFromDB);
        }
        [HttpDelete("/TaskDetail/delete/{id:int}")]
        public TaskDTO DeleteTask([FromRoute] int id)
        {
            _context.Remove(_context.Tasks.FirstOrDefault(t=>t.Id == id));
            _context.SaveChanges();
            return null;
        }
        [HttpPut("/changeToFinished")]
        public TaskDTO changeToFinished([FromBody]int id)
        {
            
            var naZmenu = _context.Tasks.FirstOrDefault(x => x.Id == id);
            if (naZmenu.IsCompleted == false)
            {
                naZmenu.IsCompleted = true;
            }
            else if (naZmenu.IsCompleted == true)
            {
                naZmenu.IsCompleted = false;
            }
            _context.SaveChanges();
            return mapToDTO(naZmenu);
        }

        [HttpGet("/finishedTasks")]
        public IEnumerable<TaskDTO> getFinishedTasks()
        {
            var finishedTasks =  _context.Tasks.Where(x => x.IsCompleted == true && x.UserId == GetCurrentUser().Id);
            return finishedTasks.Select(x => new TaskDTO
            {
                DeadLine = x.DeadLine,
                Description = x.Description,
                Id = x.Id,
                IsCompleted = x.IsCompleted,
                Name = x.Name,
                Priority = x.Priority,
                StartTime = x.StartTime,
            });
        }
        



    }
}
