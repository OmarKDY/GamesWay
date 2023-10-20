using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamesWay.Models
{
    public class Subscribers
    {
        [Key]
        public string SubscriberId { get; set; } = string.Empty;
        public string? Msisdn { get; set; } = string.Empty;
        public string? PackageId { get; set; } = string.Empty;
        public string? Lang { get; set; } = string.Empty;

        public ICollection<Transactions> Transactions { get; set; } = new List<Transactions>();
        public ICollection<LogSessions> LogSessions { get; set; } = new List<LogSessions>();

        public bool IsSubscribed { get; set; }
        public bool IsFreeTrial { get; set; }
    }
}
