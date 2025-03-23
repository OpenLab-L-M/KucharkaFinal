using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class sfadfsdfds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MealType",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "SpecialCategory",
                table: "Recipes");

            migrationBuilder.AddColumn<bool>(
                name: "Obed",
                table: "Recipes",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Ranajky",
                table: "Recipes",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Vecera",
                table: "Recipes",
                type: "bit",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Obed",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Ranajky",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Vecera",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Veganske",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Vegetarianske",
                table: "Recipes");

            migrationBuilder.AddColumn<string>(
                name: "MealType",
                table: "Recipes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SpecialCategory",
                table: "Recipes",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
