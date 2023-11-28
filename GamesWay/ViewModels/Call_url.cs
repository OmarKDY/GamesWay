using System.Xml.Serialization;

namespace GamesWay.ViewModels
{
    [XmlRoot("Call_url")]
    public class Call_url
    {
        public string msisdn { get; set; }
        public string package_id { get; set; }
        public string TransactionType { get; set; }
        public string Amount { get; set; }
        public string? channel { get; set; }
        public string transaction_id1 { get; set; }
        public string? transaction_id2 { get; set; }
    }
}
