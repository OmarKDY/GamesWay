using GamesWay.Controllers;
using GamesWay.Data;
using GamesWay.Infrastructure.Helpers;
using GamesWay.Models;
using GamesWay.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Resources;
using static System.Net.WebRequestMethods;

namespace GamesWay.DMServices
{
    [Route("/[controller]")]
    [ApiController]
    public class MobiHitsController : ControllerBase
    {
        //Full Credintials================================
        //SUBSCRIPTION CREDINTIALS
        string Subuser = "Ertibat";
        string Subpassword = "AKde789wwsSWREWE";
        string SubClientId = "Ertibat";
        string SubencryptionKey = "DHDUFY9632ASedbu";

        //UNSUBSCRIPTION CREDINTIALS
        string UnSubuser = "Ertibat";
        string UnSubpassword = "WEDcte7128912ew2336";
        string UnSubClientId = "Ertibat";
        string UnSubencryptionKey = "NJIS9c632WEDcvtq";

        //SMS Push CREDINTIALS
        string SMSuser = "ErtiBat";
        string SMSpassword = "AErfdjhie8912ewWQE";
        string SMSClientId = "ErtiBat";
        string SMSencryptionKey = "NJIS9cQWED785239";
        //================================================
        string MsisdnCheck = "";
        string packageId = "2195";
        string encryptedPIN = "";
        private readonly ApplicationDbContext _context;
        private readonly DMHelpers _dMHelpers;
        private readonly ILogger<MobiHitsController> _logger;

        public MobiHitsController(ApplicationDbContext context, DMHelpers dMHelpers, ILogger<MobiHitsController> logger)
        {
            _dMHelpers = dMHelpers;
            _context = context;
            _logger = logger;
        }

        [HttpPost("PushPinAsync")]
        public async Task<ActionResult> PushPinAsync([FromBody] PushPinRequestModel model)
        {
            MsisdnCheck = $"971{model.Msisdn}";
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
            string apiUrl = "https://pt7.etisalat.ae/subscription-manager/v1/otp/push";
            string clientId = SubClientId;

            HttpResponseMessage response = await _dMHelpers.SendPostRequestAsync(apiUrl, clientId, requestBody);
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
                    var serializedPinObj = JsonConvert.SerializeObject(requestBody);
                    var userAttmp = new UserAttmp
                    {
                        txnid = requestBody["txnid"],
                        msisdn = MsisdnCheck,
                        responsemsg = responseObject.message,
                        packageId = requestBody["packageId"],
                        password = requestBody["password"],
                        user = requestBody["user"],
                        token = requestBody["token"],
                        sourceIP = requestBody["sourceIP"],
                        agency = "Mobihits",
                        DateOfAttmp = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                        serializeobj = serializedPinObj
                    };
                    _context.UserAttmp.Add(userAttmp);
                    await _context.SaveChangesAsync();
                    return Ok(new { Message = responseObject.message, TransId = txnid });
                }
                else if (responseObject.message == "ALREADY SUB")
                {
                    GenPinModel pinObj = await _dMHelpers.GeneratePINSMS(model.Msisdn);
                    await _dMHelpers.PushContentAsync(MsisdnCheck, pinObj, "");
                    var serializedPinObj = JsonConvert.SerializeObject(pinObj);
                    var userAttmp = new UserAttmp
                    {
                        txnid = requestBody["txnid"],
                        msisdn = MsisdnCheck,
                        responsemsg = responseObject.message,
                        packageId = requestBody["packageId"],
                        password = requestBody["password"],
                        user = requestBody["user"],
                        sourceIP = requestBody["sourceIP"],
                        agency = "Mobihits",
                        DateOfAttmp = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                        serializeobj = serializedPinObj
                    };
                    _context.UserAttmp.Add(userAttmp);
                    await _context.SaveChangesAsync();
                    return Ok(new { Message = responseObject.message, TransId = txnid });
                }
                else
                {
                    var serializedPinObj = JsonConvert.SerializeObject(requestBody);
                    var userAttmp = new UserAttmp
                    {
                        txnid = requestBody["txnid"],
                        msisdn = MsisdnCheck,
                        responsemsg = responseObject.message,
                        packageId = requestBody["packageId"],
                        password = requestBody["password"],
                        user = requestBody["user"],
                        sourceIP = requestBody["sourceIP"],
                        agency = "Mobihits",
                        DateOfAttmp = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                        serializeobj = serializedPinObj
                    };
                    _context.UserAttmp.Add(userAttmp);
                    await _context.SaveChangesAsync();
                    return BadRequest(new { Message = responseObject.message });
                }
            }
            return BadRequest(new { response = response });
        }

        [HttpPost("VerifyPinAsync")]
        public async Task<ActionResult> VerifyPinAsync([FromBody] VerifyPinRequestModel model)
        {
            var usrAttmp = _context.UserAttmp.FirstOrDefault(u => u.txnid == model.TransId);
            if (usrAttmp != null)
            {
                string jsonData = usrAttmp.serializeobj;
                if (usrAttmp.serializeobj != null && model.Message != null && model.Pin != null)
                {
                    string msisdn = usrAttmp.msisdn;
                    if (usrAttmp.responsemsg == "PIN SENT SUCCESSFUL")
                    {
                        VerifyPINObject pushPINObj = JsonConvert.DeserializeObject<VerifyPINObject>(jsonData);
                        if (model.TransId == usrAttmp.txnid)
                        {
                            // Deserialize the JSON string into your object type

                            encryptedPIN = await EncryptionHelpers.EncryptFieldAsync(model.Pin, SubencryptionKey);
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

                            string apiUrl = "https://pt7.etisalat.ae/subscription-manager/v1/otp/verify";
                            string clientId = SubClientId;

                            HttpResponseMessage response = await _dMHelpers.SendPostRequestAsync(apiUrl, clientId, requestBody);
                            // Check if the response message is "SUCCESS"
                            var responseContent = await response.Content.ReadAsStringAsync();
                            var responseObject = JsonConvert.DeserializeObject<ResponseModel>(responseContent);

                            if (responseObject.message == "SUBSCRIPTION SUCCESSFUL")
                            {
                                string prefixToRemove = "971";
                                if (msisdn.StartsWith(prefixToRemove))
                                {
                                    string resultMsisdn = msisdn.Substring(prefixToRemove.Length);
                                    //GenPinModel msgObj = new GenPinModel
                                    //{
                                    //    PinMSG = $"Dear Customer, Welcome to GamesWay service. You can access your account and enjoy the service by visiting: https://games-way.com/Subscribers/LoginURL?msisdn={resultMsisdn}, For Terms & Conditions, https://games-way.com/Home/Terms",
                                    //    ExpPinDate = DateTime.Now
                                    //};
                                    //await Task.Delay(10000);
                                    //await _dMHelpers.PushContentAsync(msisdn, msgObj, pushPINObj.txnid);
                                    return Ok(new { Message = responseObject.message, LoginUrl = $"https://games-way.com/Subscribers/LoginURL?msisdn={resultMsisdn}" });
                                }
                            }
                            else
                            {
                                return BadRequest(new { Message = responseObject.message });
                            }
                        }
                        else
                        {
                            return BadRequest(new { Message = "TransId is not identical" });
                        }
                    }
                    else if (usrAttmp.responsemsg == "ALREADY SUB")
                    {
                        var genPinModel = JsonConvert.DeserializeObject<GenPinModel>(jsonData);
                        if (genPinModel != null && !string.IsNullOrEmpty(genPinModel.PinMSG) && genPinModel.ExpPinDate > DateTime.Now)
                        {
                            // Deserialize the JSON string into your object type
                            string extractedPin = genPinModel.PinMSG.Substring(0, 4);
                            if (int.TryParse(extractedPin, out int extractedPinValue))
                            {
                                if (extractedPinValue == Convert.ToInt32(model.Pin))
                                {
                                    string prefixToRemove = "971";
                                    if (msisdn.StartsWith(prefixToRemove))
                                    {
                                        string resultMsisdn = msisdn.Substring(prefixToRemove.Length);
                                        return Ok(new { Message = "Already Subscribed", LoginUrl = $"https://games-way.com/Subscribers/LoginURL?msisdn={resultMsisdn}" });

                                    }
                                }
                                else
                                {
                                    var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                                    string errorMessage = resourceManager.GetString("INVALIDPIN");
                                    return BadRequest(new { Message = errorMessage });
                                }
                            }
                        }
                        else
                        {
                            var resourceManager = new ResourceManager("GamesWay.Resources.Controllers.SubscribersController", typeof(SubscribersController).Assembly);
                            string errorMessage = resourceManager.GetString("PINEXP");
                            return BadRequest(new { Message = errorMessage });
                        }
                    }
                }
            }

            return BadRequest("There's no user attemp with this TransId");
        }
    }
}
