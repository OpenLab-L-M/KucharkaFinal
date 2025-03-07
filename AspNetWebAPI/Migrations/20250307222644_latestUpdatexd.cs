using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class latestUpdatexd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Favourite",
                table: "Recipes",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Favourite",
                table: "Recipes");
        }
    }
}
