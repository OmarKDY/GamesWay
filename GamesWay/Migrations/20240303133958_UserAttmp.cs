using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamesWay.Migrations
{
    /// <inheritdoc />
    public partial class UserAttmp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserAttmp",
                columns: table => new
                {
                    txnid = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    msisdn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    packageId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    user = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sourceIP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    agency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfAttmp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAttmp", x => x.txnid);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAttmp");
        }
    }
}
