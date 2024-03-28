using System.Text;
using GamesWay.ViewModels;
using GamesWay.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Resources;
using GamesWay.Data;

namespace GamesWay.Infrastructure.Helpers
{
    public class DMHelpers : ControllerBase
    {        
        //Full Credintials================================
        //SMS Push CREDINTIALS
        string SMSuser = "ErtiBat";
        string SMSpassword = "AErfdjhie8912ewWQE";
        string SMSClientId = "ErtiBat";
        string SMSencryptionKey = "NJIS9cQWED785239";
        //================================================
        string packageId = "2195";
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _context;

        public DMHelpers(HttpClient httpClient, ApplicationDbContext context)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<HttpResponseMessage> SendPostRequestAsync(string apiUrl, string clientId, object requestBody)
        {
            // Serialize the request body to JSON
            string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

            // Create the HTTP request
            var request = new HttpRequestMessage(HttpMethod.Post, apiUrl);
            request.Headers.Add("Client-Id", clientId);
            request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            // Send the request
            HttpResponseMessage response = await _httpClient.SendAsync(request);

            return response;
        }
        public async Task<GenPinModel> GeneratePINSMS(string msisdn)
        {
            Random random = new Random();
            int randomNumber = random.Next(1000, 10000);
            string pinMSG = $"{randomNumber} is your PIN code.please use it to confirm your login request to the mobile number 971{msisdn} to Games Way Daily.";
            GenPinModel PinObj = new GenPinModel
            {
                PinMSG = pinMSG,
                ExpPinDate = DateTime.Now.AddMinutes(5)
            };
            return PinObj;
        }
        public async Task<IActionResult> PushContentAsync(string msisdn, GenPinModel pinObj, string txnid)
        {
            var acceptLanguageHeader = HttpContext?.Request.Headers["Accept-Language"];
            var userLanguages = acceptLanguageHeader.ToString().Split(',');
            var primaryLanguage = userLanguages.Select(lang => lang.Split(';')[0].Split('-')[0]).FirstOrDefault();

            // Check if the subscriber already exists
            var existingSubscriber = await _context.Subscribers
                .Include(s => s.Transactions)
                .FirstOrDefaultAsync(x => x.Msisdn == msisdn);

            if (existingSubscriber != null)
            {
                var latestTransactions = existingSubscriber.Transactions.OrderByDescending(t => t.DateOfSubscription).FirstOrDefault();

                txnid = latestTransactions.TransactionId;
            }
            // Encrypt sensitive data
            (string encryptedUser, string encryptedPassword, string encryptedPackageId, string encryptedMsisdn) = await EncryptionHelpers.EncryptFieldsAsync(SMSuser, SMSpassword, packageId, msisdn, SMSencryptionKey);

            // Create the request body
            var requestBody = new
            {
                user = encryptedUser,
                password = encryptedPassword,
                packageId = encryptedPackageId,
                msisdn = encryptedMsisdn,
                txnid = txnid,
                senderId = "GamesWay",
                text = pinObj.PinMSG,
                lang = primaryLanguage
            };

            // Serialize the request body to JSON
            string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

            // Create the HTTP request
            var request = new HttpRequestMessage(HttpMethod.Post, "https://pt7.etisalat.ae/content-manager/v1/content/push");
            request.Headers.Add("client-id", SMSClientId);
            request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            // Send the request
            HttpResponseMessage response = await _httpClient.SendAsync(request);

            // Handle the response
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();

                var responseObject = JsonConvert.DeserializeObject<ResponseModel>(responseContent);

                // Check if the response message is "SUCCESS"
                if (responseObject.message == "SUCCESS")
                {
                    return Ok();
                }
            }
            else
            {
                var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                string errorMessage = resourceManager.GetString("INVALIDPIN");
                return BadRequest(errorMessage);
            }
            return BadRequest(response);
        }

    }
}
