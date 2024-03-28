using Newtonsoft.Json.Linq;
using System.Text.Json.Nodes;

namespace GamesWay.ViewModels
{
    public class VerifyPinRequestModel
    {
        public string? Pin { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string TransId { get; set; }
    }
}
