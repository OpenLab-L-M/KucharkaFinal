using AspNetCoreAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }
         
    public DbSet<Recipe> Recipes { get; set; } = default!;
    public DbSet<ApplicationUser> Userik { get; set; } = default!;
    public DbSet<ApplicationUserRecipe> UserRecipes { get; set; } = default!;

    public DbSet<Ingredience> Ingredience { get; set; } = default!;
    
    public DbSet<Recensions> Recensions { get; set; } = default!;
    public DbSet<Images> Images { get; set; }
    public DbSet<LikeRecensions> LikeRecensions { get; set; } = default!;
    public DbSet<Postupy> Postupiky { get; set; } = default!;
    public DbSet<TaskList> Tasks { get; set; }
    public DbSet<NakupnyList> NakupnyLists { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure one-to-one relationship between Recipe and Images
            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.Images)
                .WithOne(i => i.Recipe)
                .HasForeignKey<Recipe>(r => r.ImageId)
                .OnDelete(DeleteBehavior.Cascade); // Ensure cascading delete if needed
        }
    }
}
