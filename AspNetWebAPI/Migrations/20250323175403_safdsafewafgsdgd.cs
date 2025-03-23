using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class safdsafewafgsdgd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Veganske",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Vegetarianske",
                table: "Recipes");

            migrationBuilder.AddColumn<string>(
                name: "SpecialCategory",
                table: "Recipes",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpecialCategory",
                table: "Recipes");

            migrationBuilder.AddColumn<bool>(
                name: "Veganske",
                table: "Recipes",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Vegetarianske",
                table: "Recipes",
                type: "bit",
                nullable: true);
        }
    }
}
