using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace GamesWay.Models
{
    public class LogSessions
    {
        [Key]
        public Guid SessionId { get; set; }
        public string Msisdn { get; set; }
        public DateTime LoginTime { get; set; }
        public bool IsActive { get; set; }
        public string EndOfSubscription { get; set; }
        public string SubscriberId { get; set; }
        public Subscribers Subscriber { get; set; }
    }
}
