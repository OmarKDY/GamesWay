using System.ComponentModel.DataAnnotations;

namespace GamesWay.Models
{
    public class UserAttmp
    {
        [Key]
        public string txnid { get; set; }
        public string msisdn { get; set; }
        public string responsemsg { get; set; }
        public string packageId { get; set; }
        public string password { get; set; }
        public string user { get; set; }
        public string? token { get; set; }
        public string sourceIP { get; set; }
        public string agency { get; set; }
        public string DateOfAttmp { get; set; }
        public string serializeobj { get; set; }
    }
}
