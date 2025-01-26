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
                Priority = task.Priority,
                StartTime = task.StartTime,
                DeadLine = task.DeadLine, 
                Description = task.Description,
                Name = task.Name,
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
        public void DeleteTask([FromRoute] int id)
        {
            _context.Remove(_context.Tasks.FirstOrDefault(t=>t.Id == id));
            _context.SaveChanges();
        }

    }
}
