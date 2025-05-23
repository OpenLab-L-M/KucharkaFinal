﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AspNetCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class revert : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grams",
                table: "Ingredience");

            migrationBuilder.DropColumn(
                name: "Pieces",
                table: "Ingredience");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Grams",
                table: "Ingredience",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Pieces",
                table: "Ingredience",
                type: "int",
                nullable: true);
        }
    }
}
