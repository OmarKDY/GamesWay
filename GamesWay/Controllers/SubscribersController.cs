using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GamesWay.Data;
using GamesWay.Models;
using GamesWay.Infrastructure.Helpers;
using System.Text;
using Newtonsoft.Json;
using System.Resources;
using GamesWay.ViewModels;
using Microsoft.AspNetCore.Http;

namespace GamesWay.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class SubscribersController : Controller 
    {
        //Full Credintials================================
        //SUBSCRIPTION CREDINTIALS
        string Subuser = "Mobisofttest";
		string Subpassword = "mobit68732@k09";
		string SubClientId = "Mobisofttest";
        string SubencryptionKey = "DHDUFYlinsGDDSSs";

        //UNSUBSCRIPTION CREDINTIALS
        string UnSubuser = "MobiSoftDeAP";
        string UnSubpassword = "LxEtyMl9876Zl29418";
        string UnSubClientId = "MobiSoftDeAP";
        string UnSubencryptionKey = "NJIS9cWYUN67nbwk";

        //SMS Push CREDINTIALS
        string SMSuser = "EtisalatTesting1111";
        string SMSpassword = "ADHdyq84362adh1912";
        string SMSClientId = "EtisalatTesting1111";
        string SMSencryptionKey = "DGDUFYlinsGDDTch";
        //================================================

        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string ExpectedUsername = "Serv1ceUsern@me04";
        private const string ExpectedPassword = "Ert1b@tTechnolog1es04";
        string packageId = "2195";
        string encryptedPIN = "";
        string MsisdnCheck = "";

        public SubscribersController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = new HttpClient();
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        //PushPIN Endpoint
        [HttpPost("PushPINAsync")]
        public async Task<ActionResult> PushPINAsync([FromForm] string msisdn)
        {
            //Msisdn Check
            MsisdnCheck = $"971{msisdn}";
            //if (!MsisdnExists(MsisdnCheck))
            //{
                // Encrypt sensitive data
                (string encryptedUser, string encryptedPassword, string encryptedPackageId, string encryptedMsisdn) = await EncryptionHelpers.EncryptFieldsAsync(Subuser, Subpassword, packageId, MsisdnCheck, SubencryptionKey);

                Guid txnidGuid = Guid.NewGuid();
                string txnid = txnidGuid.ToString();
                string sourceIP = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
                Dictionary<string, string> requestBody = new Dictionary<string, string>
                {
                    { "adPartnerName", "google-ad" },
                    { "channel", "web" },
                    { "msisdn", encryptedMsisdn },
                    { "packageId", encryptedPackageId },
                    { "password", encryptedPassword },
                    { "pubId", "google-ad" },
                    { "sourceIP", sourceIP },
                    { "txnid", txnid },
                    { "user", encryptedUser }
                };

                // Serialize the request body to JSON
                string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

                // Create the HTTP request
                var request = new HttpRequestMessage(HttpMethod.Post, "https://pt7.etisalat.ae/subscription-manager/v1/otp/push");
                request.Headers.Add("Client-Id", SubClientId);
                request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                // Send the request
                HttpResponseMessage response = await _httpClient.SendAsync(request);

                // Handle the response here
                if (response.IsSuccessStatusCode)
                {
                    // Request was successful
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseObject = JsonConvert.DeserializeObject<ResponseModel>(responseContent);

                    // Check if the response message is "SUCCESS"
                    if (responseObject.message == "PIN SENT SUCCESSFUL")
                    {
                        // Add the "token" property with its value from the response
                        string tokenValue = responseObject.token;
                        requestBody.Add("token", tokenValue);
                        string json = JsonConvert.SerializeObject(requestBody);
                        TempData["PushPINObj"] = json;
                        return RedirectToAction("PINOTP", "Subscribers");
                    }
                    else if (responseObject.message == "ALREADY SUB")
                    {
                        GenPinModel pinObj = await GeneratePINSMS(msisdn);
                        await PushContentAsync(MsisdnCheck, pinObj, "");
                        var serializedPinObj = JsonConvert.SerializeObject(pinObj);
                        TempData["PINOBJ"] = serializedPinObj;
                        TempData["MSISDN"] = msisdn;
                    return RedirectToAction("PINOTP", "Subscribers");
                    }
                else
                {
                    ViewBag.ErrorMessage = responseObject.message;
                    return View("Subscribe"); //change it to returnURL-----------------------
                }
                }
                return BadRequest(response);
        }

        //VerifyPIN Endpoint
        [HttpPost("VerifyPINAsync")]
        public async Task<IActionResult> VerifyPINAsync([FromForm] string pin)
        {
            // Get the JSON string from TempData
            string jsonData = TempData["PushPINObj"] as string;
            var serializedPinObj = TempData["PINOBJ"] as string;
            string msisdn = TempData["MSISDN"] as string;
            if (jsonData != null)
            {
                // Deserialize the JSON string into your object type
                VerifyPINObject pushPINObj = JsonConvert.DeserializeObject<VerifyPINObject>(jsonData);
                string decryptedmsisdn = await EncryptionHelpers.DecryptAsync(pushPINObj.msisdn, SubencryptionKey);

                encryptedPIN = await EncryptionHelpers.EncryptFieldAsync(pin, SubencryptionKey);

                dynamic requestBody = new
                {
                    adPartnerName = "google-ad",
                    channel = "web",
                    msisdn = pushPINObj.msisdn,
                    packageId = pushPINObj.packageId,
                    password = pushPINObj.password,
                    pubId = "google-ad",
                    pin = encryptedPIN,
                    sourceIP = pushPINObj.sourceIP,
                    txnid = pushPINObj.txnid,
                    user = pushPINObj.user,
                    token = pushPINObj.token,
                };

                // Serialize the request body to JSON
                string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

                // Create the HTTP request
                var request = new HttpRequestMessage(HttpMethod.Post, "https://pt7.etisalat.ae/subscription-manager/v1/otp/verify");
                request.Headers.Add("Client-Id", SubClientId);
                request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                // Send the request
                HttpResponseMessage response = await _httpClient.SendAsync(request);

                // Handle the response here
                if (response.IsSuccessStatusCode)
                {
                    // Request was successful
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseObject = JsonConvert.DeserializeObject<ResponseModel>(responseContent);

                    // Check if the response message is "SUCCESS"
                    if (responseObject.message == "SUBSCRIPTION SUCCESSFUL")
                    {
                        string prefixToRemove = "971";
                        if (decryptedmsisdn.StartsWith(prefixToRemove))
                        {
                            string resultMsisdn = decryptedmsisdn.Substring(prefixToRemove.Length);
                            GenPinModel msgObj = new GenPinModel
                        {
                            PinMSG = $"Dear Customer, Welcome to GamesWay service. You can access your account and enjoy the service by visiting: https://games-way.com/Subscribers/LoginURL?msisdn={resultMsisdn}, For Terms & Conditions, https://games-way.com/Home/Terms",
                            ExpPinDate = DateTime.Now
                        };
                            //string resultMsisdn = decryptedmsisdn.Substring(prefixToRemove.Length);
                            await Task.Delay(2000);
                            await Login(resultMsisdn);
                            await PushContentAsync(decryptedmsisdn, msgObj, pushPINObj.txnid);
                            TempData.Remove("PushPINObj");
                            return RedirectToAction("GetGamesList", "Home");
                        }
                    }
                    else if (responseObject.message == "ALREADY SUB")
                    {
                        var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                        string errorMessage = resourceManager.GetString("AlrSub");
                        ViewBag.ErrorMessage = errorMessage;
                        //Call Login Method to enter portal
                        string prefixToRemove = "971";
                        if (decryptedmsisdn.StartsWith(prefixToRemove))
                        {
                            string resultMsisdn = decryptedmsisdn.Substring(prefixToRemove.Length);
                            await Login(resultMsisdn);
                            return RedirectToAction("GetGamesList", "Home");
                        }
                    }
                    else if (responseObject.message == "LOW BALANCE TO CHARGE")
                    {
                        var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                        string errorMessage = resourceManager.GetString("LowBalance");
                        ViewBag.ErrorMessage = errorMessage;
                        return View("PINOTP");
                    }
                    else if (responseObject.message == "INVALID PIN")
                    {
                        var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                        string errorMessage = resourceManager.GetString("INVALIDPIN");
                        ViewBag.ErrorMessage = errorMessage;
                        return View("PINOTP");
                    }
                    else
                    {
                        ViewBag.ErrorMessage = responseObject.message;
                        return View("PINOTP");
                    }
                }
            }
            else if (serializedPinObj != null)
            {
                //GenPinModel genPinModelSer = TempData["PINOBJ"] as GenPinModel;
                var genPinModel = JsonConvert.DeserializeObject<GenPinModel>(serializedPinObj);
                if (genPinModel != null && !string.IsNullOrEmpty(genPinModel.PinMSG) && genPinModel.ExpPinDate > DateTime.Now)
                {
                    // Deserialize the JSON string into your object type
                    string extractedPin = genPinModel.PinMSG.Substring(0, 4);
                if (int.TryParse(extractedPin, out int extractedPinValue))
                {
                    if (extractedPinValue == Convert.ToInt32(pin))
                    {
                        await Login(msisdn);
                        TempData.Remove("PINOBJ");
                        TempData.Remove("MSISDN");
                        return RedirectToAction("GetGamesList", "Home");
                    }
                    else
                    {
                        var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                        string errorMessage = resourceManager.GetString("INVALIDPIN");
                        ViewBag.ErrorMessage = errorMessage;
                        return View("PINOTP");
                    }
                }
            }
                else
                {
                    var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                    string errorMessage = resourceManager.GetString("PINEXP");
                    ViewBag.ErrorMessage = errorMessage;
                    return View("PINOTP");
                }
            }

            return BadRequest();
        }

		//PushContent Endpoint
		[HttpPost("PushContentAsync")]
        private async Task<IActionResult> PushContentAsync(string msisdn, GenPinModel pinObj, string txnid)
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
                    ViewBag.ErrorMessage = errorMessage;
                    return View("Login");
                }
			return RedirectToAction("Subscribe", "Subscribers");
		}

		// CallBackURL Endpoint
		[HttpPost("CallBackUrlAsync")]
        [Consumes("application/xml", "text/xml")]
        public async Task<IActionResult> CallBackUrlAsync([FromBody] Call_url Call_url)
        {
            //var remoteIpAddress = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            //var allowedIPs = new List<string> { "20.46.156.86", "40.119.172.142" };

            //if (!allowedIPs.Contains(remoteIpAddress))
            //{
            //    return StatusCode(StatusCodes.Status403Forbidden);
            //}

            string authorizationHeader = HttpContext.Request.Headers["Authorization"];
            
            // Check if the Authorization header is present and properly formatted
            if (IsValidAuthorizationHeader(authorizationHeader))
            {
                // Decode the Base64-encoded credentials
                string credentials = Encoding.UTF8.GetString(Convert.FromBase64String(authorizationHeader.Substring(6).Trim()));

                // Split the credentials into username and password
                string[] credentialParts = credentials.Split(':');
                if (credentialParts.Length == 2)
                {
                    string username = credentialParts[0];
                    string password = credentialParts[1];

                    // Check if the provided username and password match the expected values
                    if (username == ExpectedUsername && password == ExpectedPassword)
                    {
                        object requestBody = new
                        {
                            Msisdn = Call_url.msisdn,
                            PackageId = Call_url.package_id,
                            TransactionType = Call_url.TransactionType,
                            Amount = Call_url.Amount,
                            Channel = Call_url.channel,
                            TransactionId = Call_url.transaction_id,
                            TransactionId2 = Call_url.transaction_id2
                        };
                        await AddSubscriberAsync(requestBody);
                        return StatusCode(StatusCodes.Status200OK);
                    }
                }
            }

            // If the credentials are invalid or don't match, return a 403 Forbidden response
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        //UnSubscribe Endpoint
        [HttpPost("UnSubscribeAsync")]
        public async Task<IActionResult> UnSubscribeAsync([FromForm] string msisdn)
        {
            var subscriber = await _context.Subscribers
                .Include(s => s.Transactions) // Include transactions
                .FirstOrDefaultAsync(x => x.Msisdn == msisdn);

                var latestTransaction = subscriber.Transactions.OrderByDescending(t => t.DateOfSubscription).FirstOrDefault();

                // Encrypt sensitive data
                (string encryptedUser, string encryptedPassword, string encryptedPackageId, string encryptedMsisdn) = await EncryptionHelpers.EncryptFieldsAsync(UnSubuser, UnSubpassword, packageId, msisdn, UnSubencryptionKey);

            dynamic requestBody = new
            {
                msisdn = encryptedMsisdn,
                packageId = encryptedPackageId,
                password = encryptedPassword,
                txnid = latestTransaction.TransactionId,
                user = encryptedUser
            };

            // Serialize the request body to JSON
            string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

            // Create the HTTP request
            var request = new HttpRequestMessage(HttpMethod.Post, "https://pt5.etisalat.ae/mobisoft/unsubscription-manager/v1/unsub");
            request.Headers.Add("Client-Id", UnSubClientId);
            request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            // Send the request
            HttpResponseMessage response = await _httpClient.SendAsync(request);

            // Handle the response here
            if (response.IsSuccessStatusCode)
            {
                // Request was successful
                var responseContent = await response.Content.ReadAsStringAsync();
                var responseObject = JsonConvert.DeserializeObject<ResponseModel>(responseContent);

                // Check if the response message is "SUCCESS"
                if (responseObject.message == "UNSUBSCRIPTION SUCCESSFUL")
                {
                    var existingSession = await _context.LogSessions
                        .Where(x => x.Msisdn == msisdn)
                        .OrderByDescending(x => x.LoginTime)
                        .FirstOrDefaultAsync();
                    HttpContext.Session.Clear();
                    existingSession.IsActive = false;
                    _context.Entry(existingSession).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return RedirectToAction("", "Home");
                }
            }
            return BadRequest(response);
        }
        //UnSubscribe Endpoint
        [HttpPost("LogoutAsync")]
        public async Task<IActionResult> LogoutAsync([FromForm] string msisdn)
        {
            if (msisdn != null)
            {
                var subscriber = await _context.Subscribers.FirstOrDefaultAsync(x => x.Msisdn == msisdn);
                var existingSession = await _context.LogSessions
                    .Where(x => x.Msisdn == msisdn)
                    .OrderByDescending(x => x.LoginTime)
                    .FirstOrDefaultAsync();
                if (subscriber != null)
                {
                    HttpContext.Session.Clear();
                    existingSession.IsActive = false;
                    _context.Entry(existingSession).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return RedirectToAction("", "Home");
                }
            }
            return BadRequest();
        }


        // Custom authentication logic
        [HttpGet("LoginURL")]
        public async Task<IActionResult> LoginURL([FromQuery] string msisdn)
        {
            var loginResult = await Login(msisdn);
            if (loginResult is OkResult)
            {
                // If Login returns "OK," redirect to the GetGamesList action
                return RedirectToAction("GetGamesList", "Home");
            }
            else
            {
                return BadRequest("AccessDenied");
            }
        }

        [HttpPost("Login")]
        //[Consumes("application/x-www-form-urlencoded")]
        public async Task<IActionResult> Login([FromForm] string msisdn)
        {
            string validMsisdn = $"971{msisdn}";
            var subscriber = await _context.Subscribers.FirstOrDefaultAsync(x => x.Msisdn == validMsisdn);
            //var lastExistingSession = await _context.LogSessions
            //    .Where(x => x.Msisdn == validMsisdn)
            //    .OrderByDescending(x => x.LoginTime)
            //    .FirstOrDefaultAsync();

            //if (lastExistingSession != null && lastExistingSession.IsActive == true)
            //{
            //    // Session already exists for the same validMsisdn, unactive the old session.
            //    lastExistingSession.IsActive = false;
            //    _context.Entry(lastExistingSession).State = EntityState.Modified;
            //    await _context.SaveChangesAsync();
            //}

            var (subscriberMsisdn, isSubscribed, endOfSubscription) = await GetSubscriberInfo(validMsisdn);

            if (subscriberMsisdn != null)
            {
                DateTime.TryParse(endOfSubscription, out DateTime endOfSubscriptionDate);

                if (endOfSubscriptionDate > DateTime.Now)
                {
                    // Set session variables
                    //var newSession = new LogSessions
                    //{
                    //    SessionId = Guid.NewGuid(),
                    //    Msisdn = subscriberMsisdn,
                    //    LoginTime = DateTime.Now,
                    //    IsActive = true,
                    //    EndOfSubscription = endOfSubscription,
                    //    SubscriberId = subscriber.SubscriberId
                    //};
                    //HttpContext.Session.SetString("SessionId", newSession.SessionId.ToString());
                    HttpContext.Session.SetString("Msisdn", subscriberMsisdn);
                    HttpContext.Session.SetString("IsSubscribed", isSubscribed.ToString());
                    HttpContext.Session.SetString("EndOfSubscription", endOfSubscription);
                    //await AddLogSession(newSession);
                    subscriber.IsSubscribed = true;
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    subscriber.IsSubscribed = false;
                    await _context.SaveChangesAsync();
                    // Subscription has expired
                    var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                    string errorMessage = resourceManager.GetString("ErrorSubEx");
                    ViewBag.ErrorMessage = errorMessage;
                    return View("Login");
                }
            }
            else
            {
                // Authentication failed, return an error message
                // Subscription has expired
                var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                string errorMessage = resourceManager.GetString("InvMsisdn");
                ViewBag.ErrorMessage = errorMessage;
                return View("Login");
            }
        }
        //private async Task<IActionResult> AddLogSession(LogSessions newSession)
        //{
        //    _context.LogSessions.Add(newSession);
        //    await _context.SaveChangesAsync();
        //    return Ok();
        //}
        private async Task<GenPinModel> GeneratePINSMS(string msisdn)
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
        private async Task<(string Msisdn, bool IsSubscribed, string? EndOfSubscription)> GetSubscriberInfo(string validMsisdn)
        {
            var subscriber = await _context.Subscribers
                .Include(s => s.Transactions) // Include transactions
                .FirstOrDefaultAsync(x => x.Msisdn == validMsisdn);

            if (subscriber != null)
            {
                // Assuming you have a navigation property named "Transactions" in your Subscriber model
                var latestTransaction = subscriber.Transactions
                    .Where(t => t.TransactionType == "SUB" || t.TransactionType == "REN")
                    .OrderByDescending(t => t.DateOfSubscription)
                    .FirstOrDefault();

                // Return the required data
                if (latestTransaction != null)
                {
                    return (subscriber.Msisdn, subscriber.IsSubscribed, latestTransaction.EndOfSubscription);
                }
                else
                {
                    // If there are no transactions for this subscriber, set EndOfSubscription to null
                    return (subscriber.Msisdn, subscriber.IsSubscribed, null);
                }
            }

            return (null, false, null); // Return defaults when not found
        }

        // GET: Subscribers
        public async Task<IActionResult> Index()
        {

            ViewBag.SubscribersCount = await _context.Subscribers.CountAsync();
            ViewBag.IsSubscribedCount = await _context.Subscribers.CountAsync(x => x.IsSubscribed == true);
            return _context.Subscribers != null ?
                        View(await _context.Subscribers.ToListAsync()) :
                        Problem("Entity set 'ApplicationDbContext.Subscribers'  is null.");
        }

        [HttpGet("Subscribe")]
        public IActionResult Subscribe()
        {
            return View();
        }

        [HttpGet("Login")]
        public IActionResult Login()
        {
            return View();
        }

        [HttpGet("PINOTP")]
        public IActionResult PINOTP()
        {
            return View();
        }

		private bool MsisdnExists(string Msisdn)
        {
            return _context.Subscribers?.Any(e => e.Msisdn == Msisdn) ?? false;
        }

        // AddSubscriber Endpoint
        private async Task AddSubscriberAsync(object data)
        {
            var acceptLanguageHeader = HttpContext?.Request.Headers["Accept-Language"];
            var userLanguage = acceptLanguageHeader.ToString().Split(',')[0];

            string msisdn = GetPropertyValue<string>(data, "Msisdn");
            string transactionId = GetPropertyValue<string>(data, "TransactionId");

			// Check if the subscriber already exists
			var existingSubscriber = await _context.Subscribers
				.Include(s => s.Transactions) // Include transactions
				.FirstOrDefaultAsync(x => x.Msisdn == msisdn);


			if (existingSubscriber != null)
			{
                // Get the latest transaction associated with the subscriber
                //var latestTransaction = existingSubscriber.Transactions.OrderByDescending(t => t.DateOfSubscription).FirstOrDefault();

                //if (latestTransaction != null)
                //{
                    DateTime currentDate = DateTime.Now;

                    // Check if the latest transaction's subscription has expired
                    //if (DateTime.TryParse(latestTransaction.EndOfSubscription, out DateTime endOfSubscription) && endOfSubscription <= currentDate)
                    //{
                        // Subscriber's latest transaction subscription has expired, so add a new transaction
                        DateTime dateOfSubscription = currentDate;
                        TimeSpan subscriptionDuration = TimeSpan.FromHours(24);
                        DateTime newEndOfSubscription = dateOfSubscription.Add(subscriptionDuration);
                        int packageAmount = Convert.ToInt32(GetPropertyValue<string>(data, "Amount"));
                        Transactions newTransaction = new Transactions
                        {
                            TransactionId = transactionId.ToString(), // Assuming TransactionId is a string
                            TransactionId2 = GetPropertyValue<string>(data, "TransactionId2"),
                            TransactionType = GetPropertyValue<string>(data, "TransactionType"),
                            PackageAmount = packageAmount,
                            DateOfSubscription = dateOfSubscription.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                            EndOfSubscription = newEndOfSubscription.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                            Channel = GetPropertyValue<string>(data, "Channel"),
                            SubscriberId = existingSubscriber.SubscriberId // Link transaction to the subscriber
                        };
                        existingSubscriber.IsSubscribed = true;
                        existingSubscriber.IsFreeTrial = false;
                        _context.Transactions.Add(newTransaction);
                        await _context.SaveChangesAsync();
                    //}
                //}
                }
                else
                {
                    // If the subscriber doesn't exist, create a new subscriber and a new transaction
                    Guid clientIdGuid = Guid.NewGuid();
                    string clientId = clientIdGuid.ToString();

                    int packageAmount = Convert.ToInt32(GetPropertyValue<string>(data, "Amount"));
                    bool isFreeTrial = packageAmount == 0;

                    Subscribers newSubscriber = new Subscribers
                    {
                        SubscriberId = clientId,
                        Msisdn = msisdn,
                        PackageId = GetPropertyValue<string>(data, "PackageId"),
                        Lang = userLanguage,
                        IsSubscribed = true,
                        IsFreeTrial = isFreeTrial,
                    };

                    DateTime dateOfSubscription = DateTime.Now;
                    TimeSpan subscriptionDuration = TimeSpan.FromHours(24);
                    DateTime endOfSubscription = dateOfSubscription.Add(subscriptionDuration);

                    Transactions transaction = new Transactions
                    {
                        TransactionId = transactionId.ToString(), // Assuming TransactionId is a string
                        TransactionId2 = GetPropertyValue<string>(data, "TransactionId2"),
                        TransactionType = GetPropertyValue<string>(data, "TransactionType"),
                        PackageAmount = packageAmount,
                        DateOfSubscription = dateOfSubscription.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                        EndOfSubscription = endOfSubscription.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                        Channel = GetPropertyValue<string>(data, "Channel"),
                        SubscriberId = clientId // Link transaction to the new subscriber
                    };

                    // Associate the transaction with the new subscriber
                    newSubscriber.Transactions = new List<Transactions> { transaction };

                    // Add the new subscriber and transaction to the database
                    _context.Subscribers.Add(newSubscriber);
                    await _context.SaveChangesAsync();
                }
        }

        private static T GetPropertyValue<T>(object obj, string propertyName)
        {
            var propertyInfo = obj.GetType().GetProperty(propertyName);
            if (propertyInfo != null)
            {
                return (T)propertyInfo.GetValue(obj);
            }
            return default(T);
        }

		[HttpGet("CheckSession")]
		public async Task<IActionResult> CheckSession()
		{
            string subscriberMsisdn = "";
            if (HttpContext.Session.TryGetValue("Msisdn", out byte[] subscriberMsisdnBytes) &&
				HttpContext.Session.TryGetValue("IsSubscribed", out byte[] isSubscribedData) &&
				HttpContext.Session.TryGetValue("EndOfSubscription", out byte[] endOfSubscriptionData))
			{
			         subscriberMsisdn = Encoding.UTF8.GetString(subscriberMsisdnBytes);
				bool isSubscribed = BitConverter.ToBoolean(isSubscribedData, 0);
				string endOfSubscriptionString = Encoding.UTF8.GetString(endOfSubscriptionData);

                //var existingSession = await _context.LogSessions
                //    .Where(x => x.Msisdn == subscriberMsisdn)
                //    .OrderByDescending(x => x.LoginTime)
                //    .FirstOrDefaultAsync();
                if (isSubscribed && !string.IsNullOrEmpty(endOfSubscriptionString) /*&& existingSession.IsActive == true*/)
				{
                    // Session is valid
                    return Json(new { sessionValid = true });
				}
			}
            // Session is not valid
            return Json(new { sessionValid = false });
		}

        private bool IsValidAuthorizationHeader(string authorizationHeader)
        {
            // Check if the header is present and starts with "Basic "
            return !string.IsNullOrWhiteSpace(authorizationHeader) && authorizationHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase);
        }

    }
}