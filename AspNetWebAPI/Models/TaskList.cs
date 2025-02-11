using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class TaskList
    {
        [Key]
        public int Id { get; set; }
        public int Priority { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? IsCompleted { get; set; }
        public DateTime DeadLine { get; set; }
        public DateTime StartTime { get; set; }

    }
}
