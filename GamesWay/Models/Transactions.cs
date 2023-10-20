using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace GamesWay.Models
{
    public class Transactions
    {
        [Key]
        public string TransactionId { get; set; }
        public string? TransactionId2 { get; set; }
        public string? TransactionType { get; set; }
        public int? PackageAmount { get; set; }
        public string? DateOfSubscription { get; set; }
        public string? EndOfSubscription { get; set; }
        public string? Channel { get; set; } = string.Empty;

        // Add a foreign key property to refer to the associated subscriber
        public string SubscriberId { get; set; }
        public Subscribers Subscriber { get; set; }
    }
}