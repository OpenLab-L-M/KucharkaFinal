using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class pridavameNutricieDoDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Bielkoviny",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Cukor",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Kalórie",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Sacharidy",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Tuky",
                table: "Recipes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bielkoviny",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Cukor",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Kalórie",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Sacharidy",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Tuky",
                table: "Recipes");
        }
    }
}
