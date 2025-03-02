using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class dalsieKategorie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NizkoKaloricke",
                table: "Recipes",
                newName: "Vecera");

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

            migrationBuilder.RenameColumn(
                name: "Vecera",
                table: "Recipes",
                newName: "NizkoKaloricke");
        }
    }
}
