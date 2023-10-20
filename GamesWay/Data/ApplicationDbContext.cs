using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GamesWay.Models;
using Microsoft.AspNetCore.Identity;

namespace GamesWay.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Ignore<IdentityUser>();
            modelBuilder.Ignore<IdentityRole>();
            modelBuilder.Ignore<IdentityUserClaim<string>>();
            modelBuilder.Ignore<IdentityUserRole<string>>();
            modelBuilder.Ignore<IdentityUserLogin<string>>();
            modelBuilder.Ignore<IdentityUserToken<string>>();
            modelBuilder.Ignore<IdentityRoleClaim<string>>();
            modelBuilder.Entity<LogSessions>()
                .HasIndex(ls => ls.Msisdn);

            modelBuilder.Entity<Subscribers>()
                .HasIndex(s => s.Msisdn);

            modelBuilder.Entity<Transactions>()
                .HasIndex(t => t.TransactionId);
        }

        public DbSet<Subscribers> Subscribers { get; set; } = default!;
        public DbSet<Transactions> Transactions { get; set; } = default!;
        public DbSet<LogSessions> LogSessions { get; set; } = default!;
    }
}