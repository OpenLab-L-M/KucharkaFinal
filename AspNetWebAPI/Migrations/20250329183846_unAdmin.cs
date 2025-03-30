using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class unAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Admin",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Admin",
                table: "AspNetUsers",
                type: "bit",
                nullable: true);
        }
    }
}
